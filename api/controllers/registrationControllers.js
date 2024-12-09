const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");

// Helpers
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

const flattenObjectWithPrefix = (obj, prefix = '') => {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      Object.assign(acc, flattenObjectWithPrefix(obj[k], pre + k));
    } else {
      acc[pre + k] = String(obj[k]); // Convert both keys and values to strings
    }
    return acc;
  }, {});
};

// Endpoints
module.exports = ({ clientUrl, serverUrl, stripe, webhookSecret, redisClient }) => {

  const registrationGetPastTeamNameList = async (req, res) => {
    console.log('In api/registration_get_past_team_name_list...');
 
    try {
      const year = req.params.year;
      const db = getFirestore();
      const { teamTableNameList } = req.body; // Expecting an array of table names
      let allTeamNames = new Set();

      for (const tableName of teamTableNameList) {
        const snapshot = await db.collection(tableName).get();
        snapshot.forEach(doc => {
          allTeamNames.add(doc.data().teamName);
        });
      }

      // Convert Set to array and send response
      res.json({ teamNames: Array.from(allTeamNames) });
    } catch (error) {
      console.error("Error fetching past team names: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  const registrationCheckoutSession = async (req, res) => {
    console.log('In api/registration_checkout_session...');
  
    try {
      const metadataKey = `metadata:${uuidv4()}`;
      let lineItems = [];

      // Debugging: Log req.body and req.files
      console.log('Request body:', req.body);
      console.log('Uploaded files:', req.files);
  
      // Extract and parse formData
      const formData = req.body; // Ensure middleware to parse `multipart/form-data` is configured if using file uploads
      const { type, year, tableName } = JSON.parse(formData.metaDataObject);
    
      if (type === "angler") {
        console.log("Handling angler case...");
        const { anglerDetails, adultFee, juniorFee } = JSON.parse(formData.metaDataObject);
  
        // Save metadata for anglers to Redis
        await redisClient.set(metadataKey, JSON.stringify({ type, year, tableName, anglerDetails, adultFee, juniorFee }));
  
        // Create line items for Stripe
        anglerDetails.forEach((angler) => {
          const fee = angler.ageBracket === "Adult" ? adultFee : juniorFee;
          lineItems.push({
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${angler.anglerName} (${angler.ageBracket})`,
                description: `Division: ${angler.division}`,
              },
              unit_amount: fee * 100, // Convert to cents
            },
            quantity: 1,
          });
        });
      } else if (type === "sponsor") {
        console.log("Handling sponsor case...");
        const { sponsorName, selectedTier, selectedSponsorships, totalFee, tierFeeStructure, selectedSponsorshipsFeeStructure } = JSON.parse(formData.metaDataObject);
  
        // Handle sponsor logo if present
        const imageBuffers = {};
        if (req.files.sponsorLogo) {
          console.log("Processing images...");
          req.files.sponsorLogo.forEach((file) => {
            imageBuffers[file.originalname] = {
              buffer: file.buffer.toString('base64'), // Convert buffer to base64
              originalname: file.originalname,
              fieldname: file.fieldname,
              mimetype: file.mimetype,
            };
          });
        }
  
        // Save metadata for sponsor to Redis
        await redisClient.set(metadataKey, JSON.stringify({ type, year, tableName, sponsorName, selectedTier, selectedSponsorships, totalFee, imageBuffers }));
  
        // Create line items for Stripe
        if (selectedTier && selectedTier !== "None") {
          const tierFee = tierFeeStructure[selectedTier] || 0; // Extract fee from tierFeeStructure
          if (tierFee > 0) {
            lineItems.push({
              price_data: {
                currency: 'usd',
                product_data: {
                  name: `Sponsorship Tier: ${selectedTier}`,
                },
                unit_amount: tierFee * 100, // Convert to cents
              },
              quantity: 1,
            });
          }
        }
  
        // Add sponsorship fees to line items
        selectedSponsorships.forEach((sponsorship) => {
          const sponsorshipFee =
            selectedSponsorshipsFeeStructure[sponsorship] || 0; // Extract fee from selectedSponsorshipsFeeStructure
          if (sponsorshipFee > 0) {
            lineItems.push({
              price_data: {
                currency: 'usd',
                product_data: {
                  name: `Additional Sponsorship: ${sponsorship}`,
                },
                unit_amount: sponsorshipFee * 100, // Convert to cents
              },
              quantity: 1,
            });
          }
        });

      } else {
        throw new Error("Invalid registration type.");
      }
  
      // Create Stripe Checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        phone_number_collection: { enabled: true },
        line_items: lineItems,
        metadata: { redisKey: metadataKey }, // Store the Redis key in Stripe's metadata
        success_url: `${clientUrl}/${year}/registration_success`,
        cancel_url: `${clientUrl}/${year}/registration_error`,
      });
  
      // Respond with the session URL
      res.json({ url: session.url });
    } catch (error) {
      console.error('Error in registrationCheckoutSession:', error);
      res.status(500).json({ error: error.message });
    }
  }; 

  const registrationWebhook = async (req, res) => {
    console.log('In api/registrationWebhook...');
  
    const payload = req.rawBody.toString();
    const sig = req.headers['stripe-signature'];
  
    let event;
    try {
      event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
      console.log('Successfully created webhook event!');
    } catch (err) {
      console.log(err);
      return res.status(400).send(`Error while attempting to create webhook event: ${err.message}`);
    }
  
    // Send an immediate response to Stripe
    res.status(200).end();
  
    if (event.type === 'checkout.session.completed') {
      const metadataKey = event.data.object.metadata.redisKey;
  
      // Retrieve metadata from Redis
      const storedMetadata = await redisClient.get(metadataKey);
      const metadata = JSON.parse(storedMetadata);
  
      // Perform Firestore operations asynchronously
      try {
        if (metadata.type === 'angler') {
          await handleAnglerCase(metadata, event.data.object);
        } else if (metadata.type === 'sponsor') {
          await handleSponsorCase(metadata, event.data.object);
        } else {
          console.error("Invalid metadata type in webhook.");
        }
  
        // Optionally clear the stored metadata in Redis after processing
        await redisClient.del(metadataKey);
      } catch (error) {
        console.log("Error while trying to write to Firestore: ", error);
      }
    }
  };
  
  const handleAnglerCase = async (metadata, stripeEventData) => {
    console.log('Handling angler case in processFirestore...');
    
    const db = getFirestore();
  
    const { anglerDetails, year, tableName } = metadata;
    const customerDetails = stripeEventData.customer_details || {};
  
    // Create a new entry in the Firebase database for every single angler
    for (const angler of anglerDetails) {
      const anglerData = {
        ...angler,
        hasCheckedIn: false,
        tableName,
        registrationFee: angler.ageBracket === "Adult" ? metadata.adultFee : metadata.juniorFee,
        email: customerDetails.email || null,
        phone: customerDetails.phone || null,
        registrationTimestamp: new Date().toISOString(),
        paymentStatus: stripeEventData.payment_status,
      };
  
      try {
        const docRef = await db.collection(`anglers${year}`).add(anglerData);
        await docRef.update({ anglerId: docRef.id });
        console.log(`Angler ${angler.anglerName} added with ID: ${docRef.id}`);
        // FIXME: add a property called "anglerId" to the document where docRef.id is the value
      } catch (error) {
        console.error(`Error adding angler ${angler.anglerName}:`, error);
      }
    }
  };
  
  const handleSponsorCase = async (metadata, stripeEventData) => {
    console.log('Handling sponsor case in processFirestore...');
    
    const db = getFirestore();
    const bucket = getStorage().bucket();
  
    const { sponsorName, year, tableName, selectedTier, selectedSponsorships, totalFee, imageBuffers } = metadata;
    const customerDetails = stripeEventData.customer_details || {};
  
    // Upload sponsor logo to Google Cloud Storage if provided
    let logoUrl = null;
    if (imageBuffers && Object.keys(imageBuffers).length > 0) {
      const [fileName, fileData] = Object.entries(imageBuffers)[0]; // Assuming one logo per sponsor
      const buffer = Buffer.from(fileData.buffer, 'base64');
      const sanitizedFilename = fileName.replace(/\s+/g, '-');
      const filename = `${uuidv4()}-${sanitizedFilename}`;
      const fileUpload = bucket.file(filename);
  
      try {
        await fileUpload.save(buffer, {
          metadata: {
            contentType: fileData.mimetype,
          },
        });
        logoUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
        console.log(`Sponsor logo uploaded to URL: ${logoUrl}`);
      } catch (error) {
        console.error(`Error uploading sponsor logo ${fileName}:`, error);
      }
    }
  
    // Create a new entry in the Firebase database for the sponsor
    const sponsorData = {
      sponsorName,
      tableName,
      selectedTier,
      selectedSponsorships,
      totalFee,
      logoUrl,
      email: customerDetails.email || null,
      phone: customerDetails.phone || null,
      registrationTimestamp: new Date().toISOString(),
      paymentStatus: stripeEventData.payment_status,
    };
  
    try {
      const docRef = await db.collection(`sponsors${year}`).add(sponsorData);
      await docRef.update({ sponsorId: docRef.id });
      console.log(`Sponsor ${sponsorName} added with ID: ${docRef.id}`);
    } catch (error) {
      console.error(`Error adding sponsor ${sponsorName}:`, error);
    }
  };  

  const registrationGetNumberOfRegisteredTeams = async (req, res) => {
    try {
      const year = req.params.year;
      const db = getFirestore();
      const snapshot = await db.collection(`teams${year}`).get();
      const totalTeams = snapshot.size; // Count the number of documents
      res.json({ totalTeams });
    } catch (error) {
      console.error("Error fetching total registered teams: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const registrationGetNumberOfCheckedInTeams = async (req, res) => {
    try {
      const year = req.params.year;
      const db = getFirestore();
      const snapshot = await db.collection(`teams${year}`).where('hasCheckedIn', '==', true).get();
      const checkedInTeams = snapshot.size; // Count the number of documents where hasCheckedIn is true
      res.json({ checkedInTeams });
    } catch (error) {
      console.error("Error fetching checked-in teams: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  const registrationGetTotalFeesCollected = async (req, res) => {
    try {
      const year = req.params.year;
      const db = getFirestore();
      const snapshot = await db.collection(`teams${year}`).get();
  
      let totalFees = 0;
      snapshot.forEach(doc => {
        totalFees += doc.data().totalFeePaidAtCheckout || 0;
      });
  
      res.json({ totalFees });
    } catch (error) {
      console.error("Error fetching total fees collected: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  const registrationGetTotalRegistrationFeesCollected = async (req, res) => {
    try {
      const year = req.params.year;
      const db = getFirestore();
      const snapshot = await db.collection(`teams${year}`).get();
  
      let totalRegistrationFees = 0;
      snapshot.forEach(doc => {
        totalRegistrationFees += doc.data().registrationFee || 0;
      });
  
      res.json({ totalRegistrationFees });
    } catch (error) {
      console.error("Error fetching total registration fees collected: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  const registrationGetTotalAddOnFeesCollected = async (req, res) => {
    try {
      const year = req.params.year;
      const db = getFirestore();
      const snapshot = await db.collection(`teams${year}`).get();
  
      let totalAddOnFees = 0;
      snapshot.forEach(doc => {
        const addOns = doc.data();
        Object.keys(addOns).forEach(key => {
          if (addOns[key] && addOns[key].costOfPurchase) {
            totalAddOnFees += addOns[key].costOfPurchase;
          }
        });
      });
  
      res.json({ totalAddOnFees });
    } catch (error) {
      console.error("Error fetching total add-on fees collected: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  return {
    registrationGetPastTeamNameList,
    registrationCheckoutSession,
    registrationWebhook,
    registrationGetNumberOfRegisteredTeams,
    registrationGetNumberOfCheckedInTeams,
    registrationGetTotalFeesCollected,
    registrationGetTotalRegistrationFeesCollected,
    registrationGetTotalAddOnFeesCollected,
    upload
  };
};


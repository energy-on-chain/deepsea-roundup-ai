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
        sponsorName: "None",
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

  const registrationByAdmin = async (req, res) => {
    console.log('In api/registration_by_admin...');
  
    const db = getFirestore();
    const bucket = getStorage().bucket();
  
    try {
      // Extract and parse formData
      const metaDataObject = JSON.parse(req.body.metaDataObject); // JSON metadata sent in the form
      const { type, year, tableName, email, phone } = metaDataObject;
  
      if (type === "angler") {
        console.log("Handling angler case...");
        const { anglerDetails, adultFee, juniorFee } = metaDataObject;
  
        for (const angler of anglerDetails) {
          const anglerData = {
            ...angler,
            hasCheckedIn: false,
            tableName,
            sponsorName: "None",
            registrationFee: angler.ageBracket === "Adult" ? adultFee : juniorFee,
            email: email || "Admin Registered",
            phone: phone || "Admin Registered",
            registrationTimestamp: new Date().toISOString(),
            paymentStatus: "Admin Registered",
          };
  
          try {
            const docRef = await db.collection(`anglers${year}`).add(anglerData);
            await docRef.update({ anglerId: docRef.id });
            console.log(`Angler ${angler.anglerName} added with ID: ${docRef.id}`);
          } catch (error) {
            console.error(`Error adding angler ${angler.anglerName}:`, error);
          }
        }
      } else if (type === "sponsor") {
        console.log("Handling sponsor case...");
        const { sponsorName, selectedTier, selectedSponsorships, totalFee } = metaDataObject;
  
        // Handle logo upload
        let logoUrl = null;
        if (req.file) {
          const buffer = req.file.buffer;
          const sanitizedFilename = `${uuidv4()}-${req.file.originalname.replace(/\s+/g, '-')}`;
          const fileUpload = bucket.file(sanitizedFilename);
  
          try {
            await fileUpload.save(buffer, {
              metadata: {
                contentType: req.file.mimetype,
              },
            });
            logoUrl = `https://storage.googleapis.com/${bucket.name}/${sanitizedFilename}`;
            console.log(`Sponsor logo uploaded to URL: ${logoUrl}`);
          } catch (error) {
            console.error(`Error uploading sponsor logo:`, error);
          }
        }
  
        const sponsorData = {
          sponsorName,
          tableName,
          selectedTier,
          selectedSponsorships,
          totalFee,
          logoUrl,
          email: email || "Admin Registered",
          phone: phone || "Admin Registered",
          registrationTimestamp: new Date().toISOString(),
          paymentStatus: "Admin Registered",
        };
  
        try {
          const docRef = await db.collection(`sponsors${year}`).add(sponsorData);
          await docRef.update({ sponsorId: docRef.id });
          console.log(`Sponsor ${sponsorName} added with ID: ${docRef.id}`);
        } catch (error) {
          console.error(`Error adding sponsor ${sponsorName}:`, error);
        }
      } else {
        throw new Error("Invalid registration type.");
      }
  
      res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
      console.error('Error in registrationByAdmin:', error);
      res.status(500).json({ error: 'Failed to process registration' });
    }
  };  

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

  const registrationGetNumberOfRegisteredSponsors = async (req, res) => {
    console.log('In api/registration_get_number_of_registered_sponsors')
    try {
      const year = req.params.year;
      const db = getFirestore();
      console.log('year', year)
      const snapshot = await db.collection(`sponsors${year}`).get();
      const totalSponsors = snapshot.size; // Count the number of documents
      console.log('returning num sponsors:', totalSponsors)
      res.json({ totalSponsors });
    } catch (error) {
      console.error("Error fetching total registered sponsors: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const registrationGetTotalSponsorDonationsCollected = async (req, res) => {
    console.log('In api/registration_get_total_sponsor_donations_collected')
    try {
      const year = req.params.year;
      const db = getFirestore();
      const snapshot = await db.collection(`sponsors${year}`).get();
  
      let totalDonationFees = 0;
      snapshot.forEach(doc => {
        totalDonationFees += doc.data().totalFee || 0;
      });
  
      console.log('sponsor donation:', totalDonationFees)
      res.json({ totalDonationFees });
    } catch (error) {
      console.error("Error fetching total sponsor donations collected: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const registrationGetNumberOfRegisteredTeams = async (req, res) => {
    console.log('In api/registraiton_get_number_of_registered_teams')
    try {
      const year = req.params.year;
      const db = getFirestore();
      const snapshot = await db.collection(`anglers${year}`).get();
      const totalTeams = snapshot.size; // Count the number of documents
      res.json({ totalTeams });
    } catch (error) {
      console.error("Error fetching total registered teams: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const registrationGetNumberOfCheckedInTeams = async (req, res) => {
    console.log('In api/registraiton_get_number_of_checked_in_teams')
    try {
      const year = req.params.year;
      const db = getFirestore();
      const snapshot = await db.collection(`anglers${year}`).where('hasCheckedIn', '==', true).get();
      const checkedInTeams = snapshot.size; // Count the number of documents where hasCheckedIn is true
      res.json({ checkedInTeams });
    } catch (error) {
      console.error("Error fetching checked-in teams: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  const registrationGetTotalRegistrationFeesCollected = async (req, res) => {
    console.log('In api/registraiton_get_total_registration_fees_collected')
    try {
      const year = req.params.year;
      const db = getFirestore();
      const snapshot = await db.collection(`anglers${year}`).get();
  
      let totalRegistrationFees = 0;
      snapshot.forEach(doc => {
        totalRegistrationFees += doc.data().registrationFee || 0;
      });
  
      console.log('Returning total registration fees collected:', totalRegistrationFees)
      res.json({ totalRegistrationFees });
    } catch (error) {
      console.error("Error fetching total registration fees collected: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  return {
    registrationCheckoutSession,
    registrationWebhook,
    registrationByAdmin,
    registrationGetPastTeamNameList,
    registrationGetNumberOfRegisteredSponsors,
    registrationGetTotalSponsorDonationsCollected,
    registrationGetNumberOfRegisteredTeams,
    registrationGetNumberOfCheckedInTeams,
    registrationGetTotalRegistrationFeesCollected,
    upload
  };
};


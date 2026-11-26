const multer = require('multer');
const crypto = require('crypto');
const { getFirestore, Timestamp, FieldValue } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");
const config = require('../config');
const emailService = require('../services/emailService');
const { quoteAnglers, quoteSponsor, PricingError } = require('../services/pricing');

// Helpers
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

// Pending registrations wait here between "Go to payment" and Stripe's webhook. Each doc
// carries an expireAt date; a Firestore TTL policy on that field deletes abandoned checkouts.
const PENDING = 'pendingRegistrations';
const PENDING_TTL_DAYS = 7;

// Staging only: lets us test checkout outside the registration window (prices stay real-time).
const ignoreRegistrationWindow = !config.isProd && process.env.REGISTRATION_TEST_MODE === 'true';

// Uploads one image to Storage and returns a permanent download URL (Firebase download
// token, so no URL signing permission is needed on Cloud Run).
const uploadImage = async (file) => {
  const bucket = getStorage().bucket();
  const filename = `${crypto.randomUUID()}-${file.originalname.replace(/\s+/g, '-')}`;
  const downloadToken = crypto.randomUUID();
  await bucket.file(filename).save(file.buffer, {
    metadata: { contentType: file.mimetype, metadata: { firebaseStorageDownloadTokens: downloadToken } },
  });
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filename)}?alt=media&token=${downloadToken}`;
};

// Stripe sends people back to whichever allowed site they started from
// (web.app during testing, the custom domain in production).
const returnBaseUrl = (req) => {
  const origin = (req.headers.origin || '').replace(/\/$/, '');
  return config.allowedOrigins.includes(origin) ? origin : config.defaultClientUrl;
};

// JSON round-trip drops `undefined`, which Firestore rejects.
const clean = (obj) => JSON.parse(JSON.stringify(obj));

// Prices a registration from the year's config. Anything price-related the browser sent is ignored.
const priceRegistration = (year, meta, options) => {
  if (meta.type === 'angler') {
    const quote = quoteAnglers(year, meta.anglerDetails, Date.now(), options);
    return {
      quote,
      metadata: {
        type: 'angler', year: String(year), tableName: meta.tableName,
        anglerDetails: meta.anglerDetails, adultFee: quote.adultFee, juniorFee: quote.juniorFee,
      },
    };
  }
  if (meta.type === 'sponsor') {
    const quote = quoteSponsor(year, meta.selectedTier, meta.selectedSponsorships, Date.now(), options);
    return {
      quote,
      metadata: {
        type: 'sponsor', year: String(year), tableName: meta.tableName, sponsorName: meta.sponsorName,
        selectedTier: quote.selectedTier, selectedSponsorships: quote.selectedSponsorships, totalFee: quote.total,
      },
    };
  }
  throw new PricingError('Invalid registration type.');
};

// Firestore writes for a paid (or admin) registration. They take a transaction or batch
// so the whole registration saves together or not at all. paymentEventData is the Stripe
// checkout session (or, for admin registrations, an object of the same shape).
const handleAnglerCase = (writer, metadata, paymentEventData) => {
  const db = getFirestore();
  const { anglerDetails, year, tableName } = metadata;
  const customerDetails = paymentEventData.customer_details || {};
  const ids = [];

  for (const angler of anglerDetails) {
    const ref = db.collection(`anglers${year}`).doc();
    writer.set(ref, clean({
      ...angler,
      hasCheckedIn: false,
      tableName,
      sponsorName: "None",
      registrationFee: angler.ageBracket === "Adult" ? metadata.adultFee : metadata.juniorFee,
      email: customerDetails.email || null,
      phone: customerDetails.phone || null,
      registrationTimestamp: new Date().toISOString(),
      paymentStatus: paymentEventData.payment_status,
      ...(paymentEventData.id ? { stripeSessionId: paymentEventData.id } : {}),
      anglerId: ref.id,
    }));
    ids.push(ref.id);
  }
  return ids;
};

const handleSponsorCase = (writer, metadata, paymentEventData) => {
  const db = getFirestore();
  const { sponsorName, year, tableName, selectedTier, selectedSponsorships, totalFee, logoUrl } = metadata;
  const customerDetails = paymentEventData.customer_details || {};

  const ref = db.collection(`sponsors${year}`).doc();
  const sponsorData = {
    sponsorName,
    tableName,
    selectedTier,
    selectedSponsorships,
    totalFee,
    logoUrl: logoUrl || null,
    email: customerDetails.email || null,
    phone: customerDetails.phone || null,
    registrationTimestamp: new Date().toISOString(),
    paymentStatus: paymentEventData.payment_status,
    ...(paymentEventData.id ? { stripeSessionId: paymentEventData.id } : {}),
    sponsorId: ref.id,
  };
  writer.set(ref, clean(sponsorData));
  return { ids: [ref.id], sponsorData };
};

// Endpoints
const registrationFactory = ({ stripe, webhookSecret }) => {

  const registrationCheckoutSession = async (req, res) => {
    const year = req.params.year;
    try {
      const meta = JSON.parse(req.body.metaDataObject);
      const { quote, metadata } = priceRegistration(year, meta,
        { ignoreCutoff: ignoreRegistrationWindow });

      // Upload the sponsor logo now, so the webhook only has to save the registration.
      const logo = req.files?.sponsorLogo?.[0];
      if (metadata.type === 'sponsor' && logo) metadata.logoUrl = await uploadImage(logo);

      const pendingRef = getFirestore().collection(PENDING).doc();
      await pendingRef.set({
        status: 'pending',
        type: metadata.type,
        year: String(year),
        metadata: clean(metadata),
        quotedTotal: quote.total,
        createdAt: FieldValue.serverTimestamp(),
        expireAt: Timestamp.fromMillis(Date.now() + PENDING_TTL_DAYS * 24 * 60 * 60 * 1000),
      });

      const baseUrl = returnBaseUrl(req);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        phone_number_collection: { enabled: true },
        line_items: quote.lineItems.map((li) => ({
          price_data: {
            currency: 'usd',
            product_data: { name: li.name, ...(li.description ? { description: li.description } : {}) },
            unit_amount: Math.round(li.unitAmount * 100),
          },
          quantity: li.quantity,
        })),
        metadata: { metadataKey: pendingRef.id, year: String(year), type: metadata.type },
        success_url: `${baseUrl}/${year}/registration_success`,
        cancel_url: `${baseUrl}/${year}/registration_error`,
      });

      await pendingRef.update({ stripeSessionId: session.id });
      res.json({ url: session.url });
    } catch (e) {
      if (e instanceof PricingError) return res.status(400).json({ error: e.message });
      console.error('Error creating checkout session:', e);
      res.status(500).json({ error: e.message });
    }
  };

  const registrationWebhook = async (req, res) => {
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, req.headers['stripe-signature'], webhookSecret);
    } catch (err) {
      console.error('Stripe webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
    }

    if (event.type !== 'checkout.session.completed') return res.status(200).end();

    const session = event.data.object;
    const pendingId = session.metadata?.metadataKey;
    console.log(`Stripe checkout completed: event=${event.id} session=${session.id} pending=${pendingId} amount=${session.amount_total}`);

    try {
      const result = await saveRegistration(pendingId, session);
      console.log(`Webhook result for ${session.id}: ${result.message}`);
      if (result.sponsorData) await emailService.notifySponsorRegistered(result.sponsorData);
      // Saved, already saved earlier, or nothing we can save: either way Stripe should stop retrying.
      res.status(200).end();
    } catch (error) {
      console.error(`Webhook processing failed for ${session.id}:`, error);
      // 500 makes Stripe retry for up to 3 days.
      res.status(500).send(`Processing error: ${error.message}`);
    }
  };

  // Saves the registration exactly once per checkout, even if Stripe delivers the event twice.
  const saveRegistration = async (pendingId, session) => {
    const db = getFirestore();
    if (!pendingId) {
      console.error(`REGISTRATION NOT SAVED: Stripe session ${session.id} has no metadataKey.`);
      return { message: 'missing-metadata' };
    }
    const pendingRef = db.collection(PENDING).doc(pendingId);

    return db.runTransaction(async (tx) => {
      const pendingSnap = await tx.get(pendingRef);
      if (!pendingSnap.exists) {
        console.error(`REGISTRATION NOT SAVED: no pending registration ${pendingId} for paid Stripe session ${session.id}.`);
        return { message: 'missing-pending' };
      }
      const pending = pendingSnap.data();
      if (pending.status === 'completed') return { message: `duplicate (${(pending.savedIds || []).join(', ')})` };

      const metadata = pending.metadata;
      let ids;
      let sponsorData = null;
      if (metadata.type === 'angler') {
        ids = handleAnglerCase(tx, metadata, session);
      } else if (metadata.type === 'sponsor') {
        ({ ids, sponsorData } = handleSponsorCase(tx, metadata, session));
      } else {
        console.error(`REGISTRATION NOT SAVED: pending ${pendingId} has unknown type ${metadata.type}.`);
        return { message: 'invalid-type' };
      }

      tx.update(pendingRef, {
        status: 'completed',
        savedIds: ids,
        completedAt: FieldValue.serverTimestamp(),
        amountPaid: session.amount_total / 100,
      });
      return { message: `saved ${metadata.type} ${ids.join(', ')}`, sponsorData };
    });
  };

  // Admin day-of registration: no payment, saved straight away. Fees still come from the
  // config (registration deadline and "prices pending" do not apply to admins).
  const registrationByAdmin = async (req, res) => {
    const year = req.params.year;
    try {
      const meta = JSON.parse(req.body.metaDataObject);
      const { metadata } = priceRegistration(year, meta, { ignoreCutoff: true, ignorePending: true });
      if (metadata.type === 'sponsor' && req.file) metadata.logoUrl = await uploadImage(req.file);

      const adminPayment = {
        customer_details: { email: meta.email || "Admin Registered", phone: meta.phone || "Admin Registered" },
        payment_status: "Admin Registered",
      };

      const batch = getFirestore().batch();
      let sponsorData = null;
      if (metadata.type === 'angler') {
        handleAnglerCase(batch, metadata, adminPayment);
      } else {
        ({ sponsorData } = handleSponsorCase(batch, metadata, adminPayment));
      }
      await batch.commit();
      console.log(`Admin ${req.adminUser?.email} registered ${metadata.type} for ${year}`);

      if (sponsorData) await emailService.notifySponsorRegistered(sponsorData);
      res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
      if (error instanceof PricingError) return res.status(400).json({ error: error.message });
      console.error('Error in registrationByAdmin:', error);
      res.status(500).json({ error: 'Failed to process registration' });
    }
  };

  const registrationGetPastTeamNameList = async (req, res) => {
    try {
      const db = getFirestore();
      const { teamTableNameList } = req.body; // Expecting an array of table names
      const allTeamNames = new Set();

      for (const tableName of teamTableNameList || []) {
        if (!/^anglers\d{4}$/.test(tableName)) continue;
        const snapshot = await db.collection(tableName).get();
        snapshot.forEach(doc => allTeamNames.add(doc.data().teamName));
      }

      res.json({ teamNames: Array.from(allTeamNames) });
    } catch (error) {
      console.error("Error fetching past team names: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const registrationGetNumberOfRegisteredSponsors = async (req, res) => {
    try {
      const year = req.params.year;
      const snapshot = await getFirestore().collection(`sponsors${year}`).get();
      res.json({ totalSponsors: snapshot.size });
    } catch (error) {
      console.error("Error fetching total registered sponsors: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const registrationGetTotalSponsorDonationsCollected = async (req, res) => {
    try {
      const year = req.params.year;
      const snapshot = await getFirestore().collection(`sponsors${year}`).get();
      let totalDonationFees = 0;
      snapshot.forEach(doc => {
        totalDonationFees += doc.data().totalFee || 0;
      });
      res.json({ totalDonationFees });
    } catch (error) {
      console.error("Error fetching total sponsor donations collected: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const registrationGetNumberOfRegisteredTeams = async (req, res) => {
    try {
      const year = req.params.year;
      const snapshot = await getFirestore().collection(`anglers${year}`).get();
      res.json({ totalTeams: snapshot.size });
    } catch (error) {
      console.error("Error fetching total registered teams: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const registrationGetNumberOfCheckedInTeams = async (req, res) => {
    try {
      const year = req.params.year;
      const snapshot = await getFirestore().collection(`anglers${year}`).where('hasCheckedIn', '==', true).get();
      res.json({ checkedInTeams: snapshot.size });
    } catch (error) {
      console.error("Error fetching checked-in teams: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const registrationGetTotalRegistrationFeesCollected = async (req, res) => {
    try {
      const year = req.params.year;
      const snapshot = await getFirestore().collection(`anglers${year}`).get();
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

module.exports = registrationFactory;
module.exports.handleAnglerCase = handleAnglerCase;
module.exports.handleSponsorCase = handleSponsorCase;
module.exports.priceRegistration = priceRegistration;

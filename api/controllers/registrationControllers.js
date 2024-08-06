const { getFirestore } = require("firebase-admin/firestore");

module.exports = ({ clientUrl, serverUrl, stripe, webhookSecret }) => {

  const registrationGetPastTeamNameList = async (req, res) => {
    console.log('In api/registration-get-past-team-name-list...');

    try {
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
    console.log('In api/registration-checkout-session...');

    try {

      // Extract metadata
      const metaDataObject = {    
        'teamName': req.body.teamName,
        'registrationFee': req.body.registrationFee,
        'hasCheckedIn': req.body.hasCheckedIn ,
        'isEarlybird': req.body.isEarlybird,
        'teamTableName': req.body.teamTableName,
      };

      // Define line items 
      let registrationTypeString = "Team Registration";
      if (metaDataObject.isEarlybird) {
        registrationTypeString = "Team Registration (Earlybird)"
      };
      const lineItems = [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: registrationTypeString
          },
          unit_amount: parseInt(req.body.registrationFee) * 100
        },
        quantity: 1,
      }];

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        phone_number_collection: { enabled: true },
        line_items: lineItems,
        metadata: metaDataObject,
        success_url: `${clientUrl}/registration_success`,
        cancel_url: `${clientUrl}/registration_error`
      });

      res.json({ url: session.url });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  };

  const registrationWebhook = async (req, res) => {
    console.log('In api/webhook...');

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
      // Perform Firestore operations asynchronously
      processFirestore(event).catch(error => {
        console.log("Error while trying to write to Firestore: ", error);
      });
    }
  };

  const processFirestore = async (event) => {
    console.log('In processFirestore() function inside registrationWebhook() creating a new team registration record in firebase...');

    const db = getFirestore();    // connect to db
    const metadata = event.data.object.metadata; // Access metadata from the event object
    
    // Add the team document and get the document reference
    const teamDocRef = await db.collection(metadata.teamTableName).add({
      teamName: metadata.teamName,
      registrationFee: metadata.registrationFee,
      hasCheckedIn: metadata.hasCheckedIn, 
      isEarlybird: metadata.isEarlybird,
      registrationTimestampInLocalTime: new Date().toLocaleString(),
      teamEmail: event.data.object.customer_details.email,
      teamCardholderName: event.data.object.customer_details.name,
      teamPhone: event.data.object.customer_details.phone,
      teamPaymentStatus: event.data.object.payment_status,
      totalFee: event.data.object.amount_total
    });

    // Now add the teamId using the newly created doc number in firebase
    await teamDocRef.update({ teamId: teamDocRef.id });

    console.log('Successfully saved a new team registration record in firebase');
  };

  return {
    registrationGetPastTeamNameList,
    registrationCheckoutSession,
    registrationWebhook
  };
};


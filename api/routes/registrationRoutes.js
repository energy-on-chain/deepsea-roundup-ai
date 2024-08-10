const express = require('express');
const bodyParser = require("body-parser");

module.exports = ({ clientUrl, serverUrl, stripe, webhookSecret, redisClient }) => {
  const router = express.Router();
  const { 
    registrationGetPastTeamNameList, 
    registrationCheckoutSession, 
    registrationWebhook,
    upload  
  } = require('../controllers/registrationControllers')({ clientUrl, serverUrl, stripe, webhookSecret, redisClient });

  router.post('/api/registration-get-past-team-name-list', registrationGetPastTeamNameList);
  router.post('/api/registration-checkout-session', upload.fields([
    { name: 'requiredImageUploads', maxCount: 10 },
    { name: 'imageUploads', maxCount: 10 }
  ]), registrationCheckoutSession);
  router.post('/api/registration-webhook', bodyParser.raw({ type: 'application/json' }), registrationWebhook);

  return router;
};


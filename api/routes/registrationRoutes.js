const express = require('express');
const bodyParser = require("body-parser");

module.exports = ({ clientUrl, serverUrl, stripe, webhookSecret }) => {
  const router = express.Router();
  const { 
    registrationGetPastTeamNameList, 
    registrationCheckoutSession, 
    registrationWebhook, 
  } = require('../controllers/registrationControllers')({ clientUrl, serverUrl, stripe, webhookSecret });

  router.post('/api/registration-get-past-team-name-list', registrationGetPastTeamNameList);
  router.post('/api/registration-checkout-session', registrationCheckoutSession);
  router.post('/api/registration-webhook', bodyParser.raw({ type: 'application/json' }), registrationWebhook);

  return router;
};


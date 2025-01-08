const express = require('express');
const bodyParser = require("body-parser");

module.exports = ({ clientUrl, serverUrl, stripe, webhookSecret, redisClient }) => {
  const router = express.Router();
  const { 
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
  } = require('../controllers/registrationControllers')({ clientUrl, serverUrl, stripe, webhookSecret, redisClient });

  router.post('/api/:year/registration_checkout_session', upload.fields([
    { name: 'sponsorLogo', maxCount: 1 }
  ]), registrationCheckoutSession);
  router.post('/api/registration_webhook', bodyParser.raw({ type: 'application/json' }), registrationWebhook);
  router.post(
    '/api/:year/registration_by_admin',
    upload.single('sponsorLogo'), // Handle single file upload for sponsorLogo
    registrationByAdmin
  );
  router.post('/api/:year/registration_get_past_team_name_list', registrationGetPastTeamNameList);
  router.post('/api/:year/registration_get_number_of_registered_sponsors', registrationGetNumberOfRegisteredSponsors);
  router.post('/api/:year/registration_get_total_sponsor_donations_collected', registrationGetTotalSponsorDonationsCollected);
  router.post('/api/:year/registration_get_number_of_registered_teams', registrationGetNumberOfRegisteredTeams);
  router.post('/api/:year/registration_get_number_of_checked_in_teams', registrationGetNumberOfCheckedInTeams);
  router.post('/api/:year/registration_get_total_registration_fees_collected', registrationGetTotalRegistrationFeesCollected);

  return router;
};


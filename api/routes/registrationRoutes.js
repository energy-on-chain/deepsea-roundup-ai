const express = require('express');
const { requireAdmin } = require('../middleware/auth');

module.exports = ({ stripe, webhookSecret }) => {
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
  } = require('../controllers/registrationControllers')({ stripe, webhookSecret });

  router.post('/api/:year/registration_checkout_session', upload.fields([
    { name: 'sponsorLogo', maxCount: 1 }
  ]), registrationCheckoutSession);
  router.post('/api/registration_webhook', registrationWebhook); // raw body captured globally in server.js
  router.post(
    '/api/:year/registration_by_admin',
    requireAdmin,
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


const express = require('express');
const bodyParser = require("body-parser");

module.exports = ({ redisClient }) => {
  const router = express.Router();
  const {
    adminGetDatabaseList,
    adminGetAnglerList,
    adminGetTeamList,
    adminGetOldTeamNameList,
    adminEditAngler,
    adminDeleteAngler,
    adminEditSponsor,
    adminDeleteSponsor,
    adminAddCatch,
    adminEditCatch,
    adminDeleteCatch,
    adminAddAnnouncement,
    adminEditAnnouncement,
    adminDeleteAnnouncement,
    adminAddPot,
    adminAddPotCheckForDuplicateEntries,
    adminEditPot,
    adminDeletePot,
    adminGetTotalCatchCount,
    adminGetTotalCatchCountByDivision,
    adminGetRegisteredAnglerDataForReport,
    upload
  } = require('../controllers/adminControllers')({ redisClient });

  router.post('/api/:year/admin_get_database_list', adminGetDatabaseList);
  router.post('/api/:year/admin_get_angler_list', adminGetAnglerList);
  router.post('/api/admin_get_old_team_name_list', adminGetOldTeamNameList);
  router.post('/api/:year/admin_edit_angler', adminEditAngler);
  router.post('/api/:year/admin_delete_angler', adminDeleteAngler);
  // router.post('/api/:year/admin_edit_sponsor', upload.any(), adminEditSponsor);
  router.post('/api/:year/admin_edit_sponsor', upload.fields([
    { name: 'logo', maxCount: 1 }
  ]), adminEditSponsor);
  router.post('/api/:year/admin_delete_sponsor', adminDeleteSponsor);
  router.post('/api/:year/admin_add_catch', upload.any(), adminAddCatch);
  router.post('/api/:year/admin_edit_catch', upload.any(), adminEditCatch);
  router.post('/api/:year/admin_delete_catch', adminDeleteCatch);
  router.post('/api/:year/admin_add_announcement', adminAddAnnouncement);
  router.post('/api/:year/admin_edit_announcement', adminEditAnnouncement);
  router.post('/api/:year/admin_delete_announcement', adminDeleteAnnouncement);
  router.post('/api/:year/admin_add_pot', adminAddPot);
  router.post('/api/:year/admin_add_pot_check_for_duplicate_entries', adminAddPotCheckForDuplicateEntries);
  router.post('/api/:year/admin_edit_pot', adminEditPot);
  router.post('/api/:year/admin_delete_pot', adminDeletePot);
  router.post('/api/:year/admin_get_total_catch_count', adminGetTotalCatchCount);
  router.post('/api/:year/admin_get_total_catch_count_by_division', adminGetTotalCatchCountByDivision);
  router.post('/api/:year/admin_get_registered_team_data_for_report', adminGetRegisteredAnglerDataForReport);

  return router;
};


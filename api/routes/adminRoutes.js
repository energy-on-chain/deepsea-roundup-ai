const express = require('express');
const { requireAdmin, optionalAdmin } = require('../middleware/auth');

const router = express.Router();
const {
  adminGetDatabaseList,
  adminGetAnglerList,
  adminGetOldTeamNameList,
  adminEditAngler,
  adminDeleteAngler,
  adminGetFuzzyBoatNameClusters,
  adminMergeBoatNames,
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
} = require('../controllers/adminControllers')();

// Read by public pages too (the Pots page reads the angler list).
// Non-admins get a filtered view; see readCollection in adminControllers.js.
router.post('/api/:year/admin_get_database_list', optionalAdmin, adminGetDatabaseList);
router.post('/api/admin_get_old_team_name_list', optionalAdmin, adminGetOldTeamNameList);
router.post('/api/:year/admin_get_total_catch_count', adminGetTotalCatchCount);
router.post('/api/:year/admin_get_total_catch_count_by_division', adminGetTotalCatchCountByDivision);

// Everything else changes data or exposes private details: signed-in admins only.
router.post('/api/:year/admin_get_angler_list', requireAdmin, adminGetAnglerList);
router.post('/api/:year/admin_get_registered_team_data_for_report', requireAdmin, adminGetRegisteredAnglerDataForReport);
router.post('/api/:year/admin_get_fuzzy_boat_name_clusters', requireAdmin, adminGetFuzzyBoatNameClusters);
router.post('/api/:year/admin_merge_boat_names', requireAdmin, adminMergeBoatNames);
router.post('/api/:year/admin_edit_angler', requireAdmin, adminEditAngler);
router.post('/api/:year/admin_delete_angler', requireAdmin, adminDeleteAngler);
router.post('/api/:year/admin_edit_sponsor', requireAdmin, upload.fields([
  { name: 'logo', maxCount: 1 }
]), adminEditSponsor);
router.post('/api/:year/admin_delete_sponsor', requireAdmin, adminDeleteSponsor);
router.post('/api/:year/admin_add_catch', requireAdmin, upload.any(), adminAddCatch);
router.post('/api/:year/admin_edit_catch', requireAdmin, upload.any(), adminEditCatch);
router.post('/api/:year/admin_delete_catch', requireAdmin, adminDeleteCatch);
router.post('/api/:year/admin_add_announcement', requireAdmin, adminAddAnnouncement);
router.post('/api/:year/admin_edit_announcement', requireAdmin, adminEditAnnouncement);
router.post('/api/:year/admin_delete_announcement', requireAdmin, adminDeleteAnnouncement);
router.post('/api/:year/admin_add_pot', requireAdmin, adminAddPot);
router.post('/api/:year/admin_add_pot_check_for_duplicate_entries', requireAdmin, adminAddPotCheckForDuplicateEntries);
router.post('/api/:year/admin_edit_pot', requireAdmin, adminEditPot);
router.post('/api/:year/admin_delete_pot', requireAdmin, adminDeletePot);

module.exports = router;

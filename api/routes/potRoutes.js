const express = require('express');
const router = express.Router();
const {
  getAllPotData,
  getTotalPotSizeData,
  getDeepseaRoundupCatchAndReleasePotWinner,
  getDeepseaRoundupOffshorePotWinner,
  getDeepseaRoundupBaySurfPotWinner,
} = require('../controllers/potControllers');

router.post('/api/:year/get_all_pot_data', getAllPotData);
router.post('/api/:year/get_total_pot_size_data', getTotalPotSizeData);
router.post('/api/:year/get_deepsea_roundup_catch_and_release_pot_winner', getDeepseaRoundupCatchAndReleasePotWinner);
router.post('/api/:year/get_deepsea_roundup_offshore_pot_winner', getDeepseaRoundupOffshorePotWinner);
router.post('/api/:year/get_deepsea_roundup_bay_surf_pot_winner', getDeepseaRoundupBaySurfPotWinner);

module.exports = router;


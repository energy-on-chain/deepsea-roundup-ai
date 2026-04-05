const express = require('express');
const router = express.Router();
const cache = require('../services/cache');
const {
  getAllPotData,
  getTotalPotSizeData,
  getDeepseaRoundupCatchAndReleasePotWinner,
  getDeepseaRoundupOffshorePotWinner,
  getDeepseaRoundupBaySurfPotWinner,
} = require('../controllers/potControllers');

const TTL = 60; // seconds

router.post('/api/:year/get_all_pot_data', cache.middleware(TTL), getAllPotData);
router.post('/api/:year/get_total_pot_size_data', cache.middleware(TTL), getTotalPotSizeData);
router.post('/api/:year/get_deepsea_roundup_catch_and_release_pot_winner', cache.middleware(TTL), getDeepseaRoundupCatchAndReleasePotWinner);
router.post('/api/:year/get_deepsea_roundup_offshore_pot_winner', cache.middleware(TTL), getDeepseaRoundupOffshorePotWinner);
router.post('/api/:year/get_deepsea_roundup_bay_surf_pot_winner', cache.middleware(TTL), getDeepseaRoundupBaySurfPotWinner);

module.exports = router;

const express = require('express');
const router = express.Router();
const cache = require('../services/cache');
const {
  getDeepseaRoundupOffshoreGrandChampion,
  getDeepseaRoundupBaySurfGrandChampion,
  getDeepseaRoundupBillfishReleaseChampion,
  getDeepseaRoundupTopWomanAngler,
  getDeepseaRoundupBillfishSpeciesWinner,
  getDeepseaRoundupMeatfishSpeciesWinner,
} = require('../controllers/leaderboardControllers');

const TTL = 60; // seconds

router.post('/api/:year/get_deepsea_roundup_offshore_grand_champion', cache.middleware(TTL), getDeepseaRoundupOffshoreGrandChampion);
router.post('/api/:year/get_deepsea_roundup_bay_surf_grand_champion', cache.middleware(TTL), getDeepseaRoundupBaySurfGrandChampion);
router.post('/api/:year/get_deepsea_roundup_billfish_release_champion', cache.middleware(TTL), getDeepseaRoundupBillfishReleaseChampion);
router.post('/api/:year/get_deepsea_roundup_top_woman_angler', cache.middleware(TTL), getDeepseaRoundupTopWomanAngler);
router.post('/api/:year/get_deepsea_roundup_billfish_species_winner', cache.middleware(TTL), getDeepseaRoundupBillfishSpeciesWinner);
router.post('/api/:year/get_deepsea_roundup_meatfish_species_winner', cache.middleware(TTL), getDeepseaRoundupMeatfishSpeciesWinner);

module.exports = router;

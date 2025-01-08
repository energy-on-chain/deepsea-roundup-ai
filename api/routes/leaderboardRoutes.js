const express = require('express');
const router = express.Router();
const {
  getDeepseaRoundupOffshoreGrandChampion,
  getDeepseaRoundupBaySurfGrandChampion,
  getDeepseaRoundupBillfishReleaseChampion,
  getDeepseaRoundupTopWomanAngler,
  getDeepseaRoundupBillfishSpeciesWinner,
  getDeepseaRoundupMeatfishSpeciesWinner,
} = require('../controllers/leaderboardControllers');

router.post('/api/:year/get_deepsea_roundup_offshore_grand_champion', getDeepseaRoundupOffshoreGrandChampion);
router.post('/api/:year/get_deepsea_roundup_bay_surf_grand_champion', getDeepseaRoundupBaySurfGrandChampion);
router.post('/api/:year/get_deepsea_roundup_billfish_release_champion', getDeepseaRoundupBillfishReleaseChampion);
router.post('/api/:year/get_deepsea_roundup_top_woman_angler', getDeepseaRoundupTopWomanAngler);
router.post('/api/:year/get_deepsea_roundup_billfish_species_winner', getDeepseaRoundupBillfishSpeciesWinner);
router.post('/api/:year/get_deepsea_roundup_meatfish_species_winner', getDeepseaRoundupMeatfishSpeciesWinner);

module.exports = router;


const express = require('express');
const router = express.Router();
const cache = require('../services/cache');
const {
  getTypeCountDataForNewsfeedTable,
  getDivisionCountDataForNewsfeedTable,
  getSpeciesCountDataForNewsfeedTable,
  getTeamCountDataForNewsfeedTable,
  getDateCountDataForNewsfeedTable,
  getEventDataForNewsfeedTable,
} = require('../controllers/newsfeedControllers');

const TTL = 60; // seconds

router.post('/api/:year/get_type_count_data_for_newsfeed_table', cache.middleware(TTL), getTypeCountDataForNewsfeedTable);
router.post('/api/:year/get_division_count_data_for_newsfeed_table', cache.middleware(TTL), getDivisionCountDataForNewsfeedTable);
router.post('/api/:year/get_species_count_data_for_newsfeed_table', cache.middleware(TTL), getSpeciesCountDataForNewsfeedTable);
router.post('/api/:year/get_team_count_data_for_newsfeed_table', cache.middleware(TTL), getTeamCountDataForNewsfeedTable);
router.post('/api/:year/get_date_count_data_for_newsfeed_table', cache.middleware(TTL), getDateCountDataForNewsfeedTable);
router.post('/api/:year/get_event_data_for_newsfeed_table', cache.middleware(TTL), getEventDataForNewsfeedTable);

module.exports = router;

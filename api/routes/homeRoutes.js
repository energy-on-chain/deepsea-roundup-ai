const express = require('express');
const router = express.Router();
const cache = require('../services/cache');
const {
  getRegistrantCountForHomepage,
  getCatchCountForHomepage,
} = require('../controllers/homeControllers');

const TTL = 60; // seconds

router.post('/api/:year/get_registrant_count_for_homepage', cache.middleware(TTL), getRegistrantCountForHomepage);
router.post('/api/:year/get_catch_count_for_homepage', cache.middleware(TTL), getCatchCountForHomepage);

module.exports = router;

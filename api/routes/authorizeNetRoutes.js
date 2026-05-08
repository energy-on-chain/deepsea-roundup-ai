const express = require('express');
const router = express.Router();
const { authorizeNetCharge } = require('../controllers/authorizeNetControllers');

router.post('/api/:year/authorize_net_charge', authorizeNetCharge);

module.exports = router;

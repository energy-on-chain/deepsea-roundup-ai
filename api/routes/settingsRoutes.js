const express = require('express');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();
const { getSpeciesRecords, setSpeciesRecords } = require('../controllers/settingsControllers');

router.get('/api/:year/get_species_records', getSpeciesRecords);
router.post('/api/:year/set_species_records', requireAdmin, setSpeciesRecords);

module.exports = router;

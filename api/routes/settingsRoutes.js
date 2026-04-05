const express = require('express');
const router = express.Router();
const { getSpeciesRecords, setSpeciesRecords } = require('../controllers/settingsControllers');

router.get('/api/:year/get_species_records', getSpeciesRecords);
router.post('/api/:year/set_species_records', setSpeciesRecords);

module.exports = router;

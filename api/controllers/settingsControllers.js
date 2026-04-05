const { getFirestore } = require("firebase-admin/firestore");

/**
 * GET /api/:year/get_species_records
 * Returns the DSR species record weights for the given tournament year.
 * Used for tiebreaker calculations in champion and Top Woman Angler standings.
 */
exports.getSpeciesRecords = async (req, res) => {
  try {
    const year = req.params.year;
    const db = getFirestore();
    const doc = await db.collection("speciesRecords").doc(year).get();
    res.status(200).json(doc.exists ? doc.data() : {});
  } catch (error) {
    console.error("Error fetching species records:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST /api/:year/set_species_records
 * Saves DSR species record weights for the given tournament year.
 * Body: { "Blue Marlin": 592, "Redfish": 14.4, ... }
 */
exports.setSpeciesRecords = async (req, res) => {
  try {
    const year = req.params.year;
    const db = getFirestore();
    const records = {};
    for (const [species, weight] of Object.entries(req.body)) {
      const w = parseFloat(weight);
      if (!isNaN(w) && w >= 0) records[species] = w;
    }
    await db.collection("speciesRecords").doc(year).set(records);
    res.status(200).json({ message: "Saved." });
  } catch (error) {
    console.error("Error saving species records:", error);
    res.status(500).json({ error: error.message });
  }
};

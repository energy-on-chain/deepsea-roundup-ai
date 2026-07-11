const { getFirestore } = require("firebase-admin/firestore");
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

// CALCULATIONS
exports.getDeepseaRoundupTopWomanAngler = async (req, res) => {
  console.log("Fetching deepsea roundup top woman angler...");
  try {
    const year = req.params.year;
    const db = getFirestore();

    // Parse `inputs` from the request body
    const catchYear = req.body.catchYear;
    const anglerYear = req.body.anglerYear;
    const billfishSpeciesList = req.body.billfishSpeciesList;
    const meatfishSpeciesList = req.body.meatfishSpeciesList;
    const numPlaces = req.body.numPlaces;

    // Load species records from Firebase (year-specific); fall back to config values in req.body
    const recordsDoc = await db.collection("speciesRecords").doc(year).get();
    const historicalRecordCatchData = recordsDoc.exists
      ? recordsDoc.data()
      : (req.body.historicalRecordCatchData || {});

    // Fetch all anglers and filter for women
    const anglersSnapshot = await db.collection(anglerYear).get();
    const anglers = anglersSnapshot.docs.reduce((acc, doc) => {
      acc[doc.id] = doc.data();
      return acc;
    }, {});

    const validAnglerIds = Object.keys(anglers).filter(
      (id) => anglers[id].gender === "Female" && anglers[id].ageBracket === "Adult"
    );

    if (validAnglerIds.length === 0) {
      return res.status(200).json({ result: [], message: "No valid anglers found." });
    }

    // Helper function: Fetch winners for a given species in a division
    const getDivisionSpeciesWinners = async (species, division) => {
      const catchesSnapshot = await db
        .collection(catchYear)
        .where("species", "==", species)
        .where("division", "==", division)
        .get();

      const catches = catchesSnapshot.docs
        .map((doc) => ({
          ...doc.data(),
          id: doc.id,
          points: parseFloat(doc.data().points || 0),
          weight: parseFloat(doc.data().weight || 0),
        }))
        .filter((catchItem) => validAnglerIds.includes(catchItem.anglerId) && catchItem.weight > 0)
        .sort((a, b) => b.weight - a.weight);

      // One angler cannot hold both 1st and 2nd place in the same species — keep best catch per angler
      const seen = new Set();
      return catches.filter((c) => {
        if (seen.has(c.anglerId)) return false;
        seen.add(c.anglerId);
        return true;
      });
    };

    // Meatfish species that are Bay/Surf only — all others in meatfishSpeciesList use Offshore
    const BAY_SURF_ONLY_SPECIES = new Set([
      'Black Drum', 'Flounder', 'Gafftop', 'Pompano', 'Redfish', 'Speckled Trout',
    ]);

    // Helper function: Calculate angler stats for a list of species
    // Pass division=null to auto-select per species (meatfish); pass a string to fix division (billfish)
    const calculateDivisionStats = async (speciesList, division) => {
      const winners = [];
      for (const species of speciesList) {
        const effectiveDivision = division !== null
          ? division
          : (BAY_SURF_ONLY_SPECIES.has(species) ? "Bay/Surf" : "Offshore");
        const speciesCatches = await getDivisionSpeciesWinners(species, effectiveDivision);

        winners.push(
          ...speciesCatches.slice(0, 2).map((catchItem, index) => ({
            anglerId: catchItem.anglerId,
            points: index === 0 ? 2 : 1, // 2 points for 1st place, 1 point for 2nd
            weight: catchItem.weight,
            species,
            recordWeight: historicalRecordCatchData[species] || 1,
          }))
        );
      }

      return winners;
    };

    // Billfish: always Offshore. Meatfish: per-species division (null = auto-select)
    const offshoreWinners = await calculateDivisionStats(billfishSpeciesList, "Offshore");
    const meatfishWinners = await calculateDivisionStats(meatfishSpeciesList, null);

    // Combine all winners and calculate angler stats
    const allWinners = [...offshoreWinners, ...meatfishWinners];
    const anglerScores = allWinners.reduce((acc, winner) => {
      if (!acc[winner.anglerId]) {
        acc[winner.anglerId] = { points: 0, trophies: [] };
      }

      acc[winner.anglerId].points += winner.points;
      acc[winner.anglerId].trophies.push({
        species: winner.species,
        trophyPlace: winner.points === 2 ? 1 : 2,
        weight: winner.weight,
        recordWeight: winner.recordWeight,
        // billfishSpeciesList is currently always [] for TWA (billfish have no weigh-in, so
        // they don't count per the rules), but this branch matches the Offshore Grand
        // Champion's tiebreaker exactly in case that ever changes -- release species use a
        // fixed 70%/55% contribution, never a weight/record ratio (they're never weighed).
        isBillfish: billfishSpeciesList.includes(winner.species),
      });

      return acc;
    }, {});

    // Calculate average weight percentage for tiebreakers
    // Formula per rules: sum of each trophy's weight/record % (fixed 70%/55% for release
    // species per the Offshore Division's rule), divided by trophy count.
    const anglerStats = Object.entries(anglerScores).map(([anglerId, stats]) => {
      const sumOfPcts = stats.trophies.reduce((sum, t) => {
        const contribution = t.isBillfish
          ? (t.trophyPlace === 1 ? 70 : 55)
          : (t.recordWeight > 0 ? (t.weight / t.recordWeight) * 100 : 0);
        return sum + contribution;
      }, 0);
      const avgWeightPercentage = stats.trophies.length > 0 ? sumOfPcts / stats.trophies.length : 0;

      // Build a readable trophy summary for display
      const trophySummary = stats.trophies
        .slice()
        .sort((a, b) => b.weight - a.weight)
        .map(t => {
          const placeStr = t.trophyPlace === 1 ? '1st' : '2nd';
          if (t.isBillfish) {
            const pct = t.trophyPlace === 1 ? '70.0' : '55.0';
            return `${placeStr} ${t.species} (release, ${pct}% rec)`;
          }
          const pct = t.recordWeight > 0 ? ((t.weight / t.recordWeight) * 100).toFixed(1) : '0.0';
          return `${placeStr} ${t.species} (${t.weight} lbs, ${pct}% rec)`;
        })
        .join(' | ');

      return {
        anglerId,
        points: stats.points,
        avgWeightPercentage,
        trophySummary,
      };
    });

    // Sort anglers by points, then by average weight percentage for ties
    const sortedAnglers = anglerStats.sort((a, b) => {
      if (b.points === a.points) {
        return b.avgWeightPercentage - a.avgWeightPercentage;
      }
      return b.points - a.points;
    });

    // Map results
    const result = sortedAnglers.slice(0, numPlaces).map((entry, index) => {
      const angler = anglers[entry.anglerId] || {};
      return {
        place: index + 1,
        angler: angler.anglerName || "Unknown",
        division: angler.division || "Unknown",
        ageBracket: angler.ageBracket || "Unknown",
        hometown: angler.hometown || "Unknown",
        trophySummary: entry.trophySummary,
        points: entry.points,
        avgWeightPct: `${entry.avgWeightPercentage.toFixed(2)}%`,
      };
    });

    // Return result
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching deepsea roundup top woman angler:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getDeepseaRoundupBillfishReleaseChampion = async (req, res) => {
  console.log("Fetching Billfish Release Champion...");
  try {
    const year = req.params.year;
    const db = getFirestore();

    // Parse `inputs` from the request body
    const catchYear = req.body.catchYear;
    const anglerYear = req.body.anglerYear;
    const speciesList = ["Blue Marlin", "White Marlin", "Sailfish"];
    const pointSystem = { "Blue Marlin": 400, "White Marlin": 100, "Sailfish": 70 };
    const numPlaces = req.body.numPlaces || 2;

    // Fetch all anglers to associate `boatName` with `anglerId`
    const anglersSnapshot = await db.collection(anglerYear).get();
    const anglers = anglersSnapshot.docs.reduce((acc, doc) => {
      acc[doc.id] = doc.data();
      return acc;
    }, {});

    // Helper function: Fetch catches and calculate points by boat (only for eligible billfish)
    const getBoatPoints = async () => {
      const catchesSnapshot = await db.collection(catchYear).get();
      const catches = catchesSnapshot.docs
        .map((doc) => doc.data())
        .filter((catchItem) => speciesList.includes(catchItem.species)); // Filter for billfish species only

      // Group catches by `boatName`
      const boatPoints = catches.reduce((acc, catchItem) => {
        const angler = anglers[catchItem.anglerId] || {};
        const boatName = angler.boatName || "Unknown";
        const species = catchItem.species;
        const points = pointSystem[species] || 0;

        if (!acc[boatName]) {
          acc[boatName] = {
            totalPoints: 0,
            speciesPoints: {},
            latestRelease: null,
          };
        }

        // Add points for this catch
        acc[boatName].totalPoints += points;
        acc[boatName].speciesPoints[species] =
          (acc[boatName].speciesPoints[species] || 0) + points;

        // Track the latest release time for tiebreakers (only billfish species)
        const releaseTime = catchItem.dateTime;
        if (!acc[boatName].latestRelease || dayjs(releaseTime).isAfter(dayjs(acc[boatName].latestRelease))) {
          acc[boatName].latestRelease = releaseTime;
        }

        return acc;
      }, {});

      return boatPoints;
    };

    // Calculate boat points and sort results
    const boatPoints = await getBoatPoints();

    // Sort boats by total points and latest release time (earliest wins in case of tie)
    const sortedBoats = Object.entries(boatPoints)
      .map(([boatName, stats]) => ({
        boatName,
        totalPoints: stats.totalPoints,
        speciesPoints: stats.speciesPoints,
        latestRelease: stats.latestRelease,
      }))
      .sort((a, b) => {
        if (b.totalPoints === a.totalPoints) {
          return dayjs(a.latestRelease).diff(dayjs(b.latestRelease)); // Earliest latest release wins
        }
        return b.totalPoints - a.totalPoints;
      });

    // Map results for output
    const result = sortedBoats.slice(0, numPlaces).map((entry, index) => ({
      place: index + 1,
      boatName: entry.boatName,
      totalPoints: entry.totalPoints,
      speciesPoints: entry.speciesPoints,
      latestRelease: entry.latestRelease ? dayjs(entry.latestRelease).format("YYYY-MM-DD HH:mm:ss") : "N/A",
    }));

    // Return result
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching Billfish Release Champion:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Tarpon Release Division -- a boat competition, entirely separate from the
 * Billfish Release Division and its scoring (per tournament rules). 1 point per
 * fish released; Junior-caught Tarpon count toward the boat's total.
 */
exports.getDeepseaRoundupTarponReleaseChampion = async (req, res) => {
  console.log("Fetching Tarpon Release Champion...");
  try {
    const year = req.params.year;
    const db = getFirestore();

    const catchYear = req.body.catchYear;
    const anglerYear = req.body.anglerYear;
    const speciesList = ["Tarpon"];
    const pointSystem = { "Tarpon": 1 };
    const numPlaces = req.body.numPlaces || 2;

    // Fetch all anglers to associate `boatName` with `anglerId`
    const anglersSnapshot = await db.collection(anglerYear).get();
    const anglers = anglersSnapshot.docs.reduce((acc, doc) => {
      acc[doc.id] = doc.data();
      return acc;
    }, {});

    // Helper function: Fetch catches and calculate points by boat (only for eligible tarpon)
    const getBoatPoints = async () => {
      const catchesSnapshot = await db.collection(catchYear).get();
      const catches = catchesSnapshot.docs
        .map((doc) => doc.data())
        .filter((catchItem) => speciesList.includes(catchItem.species)); // Filter for Tarpon only

      // Group catches by `boatName`
      const boatPoints = catches.reduce((acc, catchItem) => {
        const angler = anglers[catchItem.anglerId] || {};
        const boatName = angler.boatName || "Unknown";
        const species = catchItem.species;
        const points = pointSystem[species] || 0;

        if (!acc[boatName]) {
          acc[boatName] = {
            totalPoints: 0,
            speciesPoints: {},
            latestRelease: null,
          };
        }

        // Add points for this catch
        acc[boatName].totalPoints += points;
        acc[boatName].speciesPoints[species] =
          (acc[boatName].speciesPoints[species] || 0) + points;

        // Track the latest release time for tiebreakers
        const releaseTime = catchItem.dateTime;
        if (!acc[boatName].latestRelease || dayjs(releaseTime).isAfter(dayjs(acc[boatName].latestRelease))) {
          acc[boatName].latestRelease = releaseTime;
        }

        return acc;
      }, {});

      return boatPoints;
    };

    // Calculate boat points and sort results
    const boatPoints = await getBoatPoints();

    // Sort boats by total points and latest release time (earliest wins in case of tie)
    const sortedBoats = Object.entries(boatPoints)
      .map(([boatName, stats]) => ({
        boatName,
        totalPoints: stats.totalPoints,
        speciesPoints: stats.speciesPoints,
        latestRelease: stats.latestRelease,
      }))
      .sort((a, b) => {
        if (b.totalPoints === a.totalPoints) {
          return dayjs(a.latestRelease).diff(dayjs(b.latestRelease)); // Earliest latest release wins
        }
        return b.totalPoints - a.totalPoints;
      });

    // Map results for output
    const result = sortedBoats.slice(0, numPlaces).map((entry, index) => ({
      place: index + 1,
      boatName: entry.boatName,
      totalPoints: entry.totalPoints,
      speciesPoints: entry.speciesPoints,
      latestRelease: entry.latestRelease ? dayjs(entry.latestRelease).format("YYYY-MM-DD HH:mm:ss") : "N/A",
    }));

    // Return result
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching Tarpon Release Champion:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getDeepseaRoundupOffshoreGrandChampion = async (req, res) => {
  console.log("Fetching deepsea roundup offshore grand champion...");
  try {
    const year = req.params.year;
    const db = getFirestore();

    // Parse `inputs` from the request body
    const catchYear = req.body.catchYear;
    const anglerYear = req.body.anglerYear;
    const ageBracket = req.body.ageBracket;
    const billfishSpeciesList = req.body.billfishSpeciesList;
    const meatfishSpeciesList = req.body.meatfishSpeciesList;
    const numPlaces = req.body.numPlaces;
    const isReport = req.body.isReport;

    // Load species records from Firebase (year-specific); fall back to config values in req.body
    const recordsDoc = await db.collection("speciesRecords").doc(year).get();
    const historicalRecordCatchData = recordsDoc.exists
      ? recordsDoc.data()
      : (req.body.historicalRecordCatchData || {});

    // Fetch all anglers and filter by ageBracket
    const anglersSnapshot = await db.collection(anglerYear).get();
    const anglers = anglersSnapshot.docs.reduce((acc, doc) => {
      acc[doc.id] = doc.data();
      return acc;
    }, {});

    const validAnglerIds = Object.keys(anglers).filter(
      (id) => anglers[id].ageBracket === ageBracket && anglers[id].division === "Offshore"
    );    

    // Helper function: Fetch billfish winners for a given species
    const getBillfishSpeciesWinners = async (species) => {
      const catchesSnapshot = await db.collection(catchYear).where("species", "==", species).get();
      const catches = catchesSnapshot.docs
        .map((doc) => ({
          ...doc.data(),
          id: doc.id,
          points: parseFloat(doc.data().points),
        }))
        .filter((catchItem) => validAnglerIds.includes(catchItem.anglerId));

      const anglerStats = catches.reduce((acc, catchItem) => {
        if (!acc[catchItem.anglerId]) {
          acc[catchItem.anglerId] = {
            points: 0,
            lastCatch: catchItem.dateTime,
          };
        }
        acc[catchItem.anglerId].points += catchItem.points;
        if (dayjs(catchItem.dateTime).isAfter(dayjs(acc[catchItem.anglerId].lastCatch))) {
          acc[catchItem.anglerId].lastCatch = catchItem.dateTime;
        }
        return acc;
      }, {});

      const sortedAnglers = Object.entries(anglerStats)
        .map(([anglerId, stats]) => ({ anglerId, ...stats }))
        .sort((a, b) => {
          if (b.points === a.points) {
            return dayjs(a.lastCatch).diff(dayjs(b.lastCatch));
          }
          return b.points - a.points;
        });

      return sortedAnglers.slice(0, 2).map((entry) => ({
        anglerId: entry.anglerId,
        points: entry.points,
        species,
        place: sortedAnglers.indexOf(entry) + 1,
      }));
    };

    // Helper function: Fetch meatfish winners for a given species
    const getMeatfishSpeciesWinners = async (species) => {
      const catchesSnapshot = await db.collection(catchYear).where("species", "==", species).get();
      const catches = catchesSnapshot.docs
        .map((doc) => ({
          ...doc.data(),
          id: doc.id,
          weight: parseFloat(doc.data().weight),
        }))
        .filter((catchItem) => validAnglerIds.includes(catchItem.anglerId));

      const sortedCatches = catches
        .filter((catchItem) => catchItem.weight > 0)
        .sort((a, b) => b.weight - a.weight);

      return sortedCatches.slice(0, 2).map((catchItem, index) => ({
        anglerId: catchItem.anglerId,
        weight: catchItem.weight,
        species,
        place: index + 1,
      }));
    };

    // Fetch all winners
    const billfishWinners = [];
    for (const species of billfishSpeciesList) {
      const winners = await getBillfishSpeciesWinners(species);
      billfishWinners.push(...winners);
    }

    const meatfishWinners = [];
    for (const species of meatfishSpeciesList) {
      const winners = await getMeatfishSpeciesWinners(species);
      meatfishWinners.push(...winners);
    }

    // Combine all winners and calculate points
    const allWinners = [...billfishWinners, ...meatfishWinners];
    const anglerScores = allWinners.reduce((acc, winner) => {
      if (!acc[winner.anglerId]) {
        acc[winner.anglerId] = { points: 0, weights: [] };
      }

      // Add points based on place
      acc[winner.anglerId].points += winner.place === 1 ? 2 : 1;
      acc[winner.anglerId].weights.push({
        species: winner.species,
        weight: winner.weight || 0,
        recordWeight: historicalRecordCatchData[winner.species] || 1,
        isBillfish: billfishSpeciesList.includes(winner.species),
        place: winner.place,
      });

      return acc;
    }, {});

    // Calculate average weight percentage for tiebreakers, and keep each species' individual
    // contribution to that average so the report can show how a tie was actually broken --
    // same purpose as the Bay/Surf report's per-species weight columns.
    // Per rules: for release species (billfish), use fixed % (70% for 1st, 55% for 2nd).
    // For weight species: individual weight/record %, then average across all species.
    const anglerStats = Object.entries(anglerScores).map(([anglerId, stats]) => {
      const speciesContributions = {};
      const sumOfPcts = stats.weights.reduce((sum, item) => {
        const contribution = item.isBillfish
          ? (item.place === 1 ? 70 : 55)
          : (item.recordWeight > 0 ? (item.weight / item.recordWeight) * 100 : 0);
        // If an angler somehow places in the same species twice, keep the better contribution.
        if (!speciesContributions[item.species] || contribution > speciesContributions[item.species]) {
          speciesContributions[item.species] = contribution;
        }
        return sum + contribution;
      }, 0);
      const avgWeightPercentage = stats.weights.length > 0 ? sumOfPcts / stats.weights.length : 0;

      return {
        anglerId,
        points: stats.points,
        avgWeightPercentage,
        speciesContributions,
      };
    });

    // Sort anglers by points, then by average weight percentage for ties
    const sortedAnglers = anglerStats.sort((a, b) => {
      if (b.points === a.points) {
        return b.avgWeightPercentage - a.avgWeightPercentage;
      }
      return b.points - a.points;
    });

    // Map results
    const result = sortedAnglers.slice(0, numPlaces).map((entry, index) => {
      const angler = anglers[entry.anglerId] || {};
      // Readable species-contribution summary instead of one column per species -- mirrors
      // Top Woman Angler's "Trophies Won" column so ties stay explainable without needing
      // 17+ mostly-empty columns.
      const speciesContributionSummary = Object.entries(entry.speciesContributions)
        .sort((a, b) => b[1] - a[1])
        .map(([species, pct]) => `${species}: ${pct.toFixed(2)}%`)
        .join(' | ');
      return {
        place: index + 1,
        angler: angler.anglerName || "Unknown",
        boatName: angler.boatName || "",
        division: angler.division,
        ageBracket: angler.ageBracket,
        hometown: angler.hometown,
        points: entry.points,
        speciesContributionSummary,
        tiebreaker: `${entry.avgWeightPercentage.toFixed(2)}%`,
      };
    });

    // Return result
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching deepsea roundup offshore grand champion:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getDeepseaRoundupBaySurfGrandChampion = async (req, res) => {
  console.log("Fetching deepsea roundup bay/surf grand champion...");
  try {
    const year = req.params.year;
    const db = getFirestore();

    const catchYear = req.body.catchYear;
    const anglerYear = req.body.anglerYear;
    const ageBracket = req.body.ageBracket;
    const meatfishSpeciesList = req.body.meatfishSpeciesList;
    const numPlaces = req.body.numPlaces || 2;

    // Fetch all anglers; filter to Bay/Surf division + correct age bracket
    const anglersSnapshot = await db.collection(anglerYear).get();
    const anglers = anglersSnapshot.docs.reduce((acc, doc) => {
      acc[doc.id] = doc.data();
      return acc;
    }, {});
    const validAnglerIds = new Set(
      Object.keys(anglers).filter(
        (id) => anglers[id].ageBracket === ageBracket && anglers[id].division === "Bay/Surf"
      )
    );

    // anglerData[anglerId] = { speciesWeights: { species: bestWeight }, hasFirstPlaceFish: bool }
    const anglerData = {};

    for (const species of meatfishSpeciesList) {
      const snapshot = await db.collection(catchYear).where("species", "==", species).get();
      const catches = snapshot.docs
        .map((doc) => ({
          anglerId: doc.data().anglerId,
          weight: parseFloat(doc.data().weight || 0),
          length: parseFloat(doc.data().length || 0),
          girth: parseFloat(doc.data().girth || 0),
        }))
        .filter((c) => validAnglerIds.has(c.anglerId) && c.weight > 0);

      // Sort to find species 1st place (weight → length → girth tiebreakers)
      catches.sort((a, b) =>
        b.weight - a.weight || b.length - a.length || b.girth - a.girth
      );
      const firstPlaceAnglerId = catches.length > 0 ? catches[0].anglerId : null;

      // Track each angler's best (heaviest) catch of this species
      const bestByAngler = {};
      for (const c of catches) {
        if (!bestByAngler[c.anglerId] || c.weight > bestByAngler[c.anglerId]) {
          bestByAngler[c.anglerId] = c.weight;
        }
      }

      for (const [anglerId, weight] of Object.entries(bestByAngler)) {
        if (!anglerData[anglerId]) {
          anglerData[anglerId] = { speciesWeights: {}, hasFirstPlaceFish: false };
        }
        anglerData[anglerId].speciesWeights[species] = weight;
        if (anglerId === firstPlaceAnglerId) {
          anglerData[anglerId].hasFirstPlaceFish = true;
        }
      }
    }

    // Build flat result array sorted by total weight
    // Per rules, Champion and Runner-Up must each have the highest total weight of AT LEAST
    // FOUR of the eligible species -- anglers with fewer than 4 species can still show up
    // elsewhere on the leaderboard, but are not in contention for Grand Champion/Runner-Up.
    const MIN_ELIGIBLE_SPECIES_FOR_CHAMPION = 4;
    const byWeight = Object.entries(anglerData)
      .map(([anglerId, data]) => {
        const totalWeight = Object.values(data.speciesWeights).reduce((s, w) => s + w, 0);
        return { anglerId, totalWeight, hasFirstPlaceFish: data.hasFirstPlaceFish, speciesWeights: data.speciesWeights };
      })
      .filter((a) => Object.keys(a.speciesWeights).length >= MIN_ELIGIBLE_SPECIES_FOR_CHAMPION)
      .sort((a, b) => b.totalWeight - a.totalWeight);

    // Champion (1st place) MUST have a first place fish — pull the highest-weight such angler to the top.
    // All subsequent places (runner-up, etc.) are awarded purely by total weight with no restriction.
    const championIdx = byWeight.findIndex((a) => a.hasFirstPlaceFish);
    let ranked;
    if (championIdx <= 0) {
      // Either no one has a first place fish (championIdx === -1), or the heaviest angler already
      // has one (championIdx === 0) — no reordering needed.
      ranked = byWeight;
    } else {
      const champion = byWeight[championIdx];
      const rest = byWeight.filter((_, i) => i !== championIdx);
      ranked = [champion, ...rest];
    }

    const result = ranked.slice(0, numPlaces).map((entry, index) => {
      const angler = anglers[entry.anglerId] || {};
      // Spread individual species weights as top-level fields
      const speciesFields = {};
      for (const species of meatfishSpeciesList) {
        speciesFields[species] = entry.speciesWeights[species]
          ? parseFloat(entry.speciesWeights[species].toFixed(2))
          : 0;
      }
      return {
        place: index + 1,
        angler: angler.anglerName || "Unknown",
        division: angler.division,
        ageBracket: angler.ageBracket,
        hometown: angler.hometown,
        hasFirstPlaceFish: entry.hasFirstPlaceFish ? "Yes" : "No",
        ...speciesFields,
        totalWeight: parseFloat(entry.totalWeight.toFixed(2)),
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching deepsea roundup bay/surf grand champion:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getDeepseaRoundupBillfishSpeciesWinner = async (req, res, externalYear = null) => {
  console.log('Fetching deepsea roundup billfish species winner...');
  try {
    // Use externalYear if provided, otherwise fallback to req.params.year
    const year = externalYear || req.params.year;
    const db = getFirestore();
    const { catchYear, anglerYear, species, numPlaces, isReport } = req.body;

    // Fetch all catches with the specified species
    const catchesSnapshot = await db.collection(catchYear)
      .where("species", "==", species)
      .get();

    const catches = catchesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        points: parseFloat(data.points), // Convert points from string to float
      };
    });

    // Sum points for each angler and track their most recent catch time
    const anglerStats = catches.reduce((acc, catchItem) => {
      if (!acc[catchItem.anglerId]) {
        acc[catchItem.anglerId] = {
          points: 0,
          lastCatch: catchItem.dateTime,
        };
      }
      acc[catchItem.anglerId].points += catchItem.points;
      if (dayjs(catchItem.dateTime).isAfter(dayjs(acc[catchItem.anglerId].lastCatch))) {
        acc[catchItem.anglerId].lastCatch = catchItem.dateTime;
      }
      return acc;
    }, {});

    // Sort anglers by points, descending, and apply tiebreaker by most recent catch
    const sortedAnglers = Object.entries(anglerStats)
      .map(([anglerId, stats]) => ({ anglerId, ...stats }))
      .sort((a, b) => {
        if (b.points === a.points) {
          return dayjs(a.lastCatch).diff(dayjs(b.lastCatch));
        }
        return b.points - a.points;
      });

    // Fetch angler details
    const anglersSnapshot = await db.collection(anglerYear).get();
    const anglers = anglersSnapshot.docs.reduce((acc, doc) => {
      acc[doc.id] = doc.data();
      return acc;
    }, {});

    const result = sortedAnglers.slice(0, numPlaces).map((entry, index) => {
      const angler = anglers[entry.anglerId] || {};
      return {
        place: index + 1,
        species: species,
        angler: angler.anglerName || 'Unknown',
        hometown: angler.hometown,
        boat: angler.boatName || 'Unknown',
        points: entry.points,
        lastCatch: entry.lastCatch, // Include most recent catch time
      };
    });

    res.status(200).json(result);
  } catch (e) {
    console.log('Error fetching deepsea roundup billfish species winner:', e);
    res.status(500).json({ error: e.message });
  }
};

exports.getDeepseaRoundupMeatfishSpeciesWinner = async (req, res, externalYear = null) => {
  console.log('Fetching deepsea roundup meatfish species winner...');
  try {
    // Use externalYear if provided, otherwise fallback to req.params.year
    const year = externalYear || req.params.year;
    const db = getFirestore();
    const { catchYear, anglerYear, species, ageBracket, division, numPlaces, isReport } = req.body;

    // Fetch catches with specified species and division
    const catchesSnapshot = await db.collection(catchYear)
      .where("species", "==", species)
      .where("division", "==", division)
      .get();

    let catches = catchesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Fetch angler data
    const anglersSnapshot = await db.collection(anglerYear).get();
    const anglers = anglersSnapshot.docs.reduce((acc, doc) => {
      acc[doc.id] = doc.data();
      return acc;
    }, {});

    // Filter anglers by age bracket
    const validAnglerIds = Object.entries(anglers)
      .filter(([id, angler]) => angler.ageBracket === ageBracket)
      .map(([id]) => id);

    catches = catches.filter(catchItem => validAnglerIds.includes(catchItem.anglerId));

    // Sort catches by weight (descending), then length, then girth
    catches.sort((a, b) => b.weight - a.weight || b.length - a.length || b.girth - a.girth);

    const result = catches.slice(0, numPlaces).map((catchItem, index) => {
      const angler = anglers[catchItem.anglerId] || {};
      return {
        place: index + 1,
        species: species,
        angler: angler.anglerName,
        hometown: angler.hometown,
        weight: catchItem.weight,
        length: catchItem.length,
        girth: catchItem.girth,
      };
    });

    res.status(200).json(result);
  } catch (e) {
    console.log('Error fetching deepsea roundup meatfish species winner:', e);
    res.status(500).json({ error: e.message });
  }
};


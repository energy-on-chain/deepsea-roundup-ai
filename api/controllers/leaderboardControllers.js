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
    const historicalRecordCatchData = req.body.historicalRecordCatchData;
    const numPlaces = req.body.numPlaces;

    // Fetch all anglers and filter for women
    const anglersSnapshot = await db.collection(anglerYear).get();
    const anglers = anglersSnapshot.docs.reduce((acc, doc) => {
      acc[doc.id] = doc.data();
      return acc;
    }, {});

    const validAnglerIds = Object.keys(anglers).filter(
      (id) => anglers[id].gender === "Female"
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
        .filter((catchItem) => validAnglerIds.includes(catchItem.anglerId));

      return catches;
    };

    // Helper function: Calculate angler stats for a division
    const calculateDivisionStats = async (speciesList, division) => {
      const winners = [];
      for (const species of speciesList) {
        const speciesCatches = await getDivisionSpeciesWinners(species, division);
        const sortedCatches = speciesCatches
          .filter((catchItem) => catchItem.weight > 0)
          .sort((a, b) => b.weight - a.weight);

        winners.push(
          ...sortedCatches.slice(0, 2).map((catchItem, index) => ({
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

    // Fetch winners for Offshore and Bay/Surf divisions
    const offshoreWinners = await calculateDivisionStats(billfishSpeciesList, "Offshore");
    const baySurfWinners = await calculateDivisionStats(meatfishSpeciesList, "Bay/Surf");

    // Combine all winners and calculate angler stats
    const allWinners = [...offshoreWinners, ...baySurfWinners];
    const anglerScores = allWinners.reduce((acc, winner) => {
      if (!acc[winner.anglerId]) {
        acc[winner.anglerId] = { points: 0, weights: [] };
      }

      acc[winner.anglerId].points += winner.points;
      acc[winner.anglerId].weights.push({
        weight: winner.weight,
        recordWeight: winner.recordWeight,
      });

      return acc;
    }, {});

    // Calculate average weight percentage for tiebreakers
    const anglerStats = Object.entries(anglerScores).map(([anglerId, stats]) => {
      const totalWeight = stats.weights.reduce((sum, item) => sum + item.weight, 0);
      const totalRecordWeight = stats.weights.reduce((sum, item) => sum + item.recordWeight, 0);
      const avgWeightPercentage = totalRecordWeight > 0 ? (totalWeight / totalRecordWeight) * 100 : 0;

      return {
        anglerId,
        points: stats.points,
        avgWeightPercentage: avgWeightPercentage.toFixed(2),
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
        gender: angler.gender || "Unknown",
        division: angler.division || "Unknown",
        ageBracket: angler.ageBracket || "Unknown",
        hometown: angler.hometown || "Unknown",
        points: entry.points,
        tiebreaker: `${entry.avgWeightPercentage}%`,
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
    const historicalRecordCatchData = req.body.historicalRecordCatchData;
    const numPlaces = req.body.numPlaces;
    const isReport = req.body.isReport;

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
        weight: winner.weight || 0,
        recordWeight: historicalRecordCatchData[winner.species] || 1,
      });

      return acc;
    }, {});

     // Calculate average weight percentage for tiebreakers (only meatfish species)
     const anglerStats = Object.entries(anglerScores).map(([anglerId, stats]) => {
      const totalWeight = stats.weights.reduce((sum, item) => sum + item.weight, 0);
      const totalRecordWeight = stats.weights.reduce((sum, item) => sum + item.recordWeight, 0);
      const avgWeightPercentage = totalRecordWeight > 0 ? (totalWeight / totalRecordWeight) * 100 : 0;

      return {
        anglerId,
        points: stats.points,
        avgWeightPercentage: avgWeightPercentage.toFixed(2), // Format as percentage with two decimals
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
        division: angler.division,
        ageBracket: angler.ageBracket,
        hometown: angler.hometown,
        points: entry.points,
        tiebreaker: `${entry.avgWeightPercentage}%`, // Add formatted tiebreaker value
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

    // Parse `inputs` from the request body
    const catchYear = req.body.catchYear;
    const anglerYear = req.body.anglerYear;
    const ageBracket = req.body.ageBracket;
    const meatfishSpeciesList = req.body.meatfishSpeciesList;
    const numPlaces = req.body.numPlaces || 2;

    // Fetch all anglers and filter by ageBracket
    const anglersSnapshot = await db.collection(anglerYear).get();
    const anglers = anglersSnapshot.docs.reduce((acc, doc) => {
      acc[doc.id] = doc.data();
      return acc;
    }, {});

    const validAnglerIds = Object.keys(anglers).filter(
      (id) => anglers[id].ageBracket === ageBracket && anglers[id].division === "Bay/Surf"
    );

    // Helper function: Fetch catches for a given species and determine first-place winners
    const getSpeciesFirstPlace = async (species) => {
      const catchesSnapshot = await db.collection(catchYear).where("species", "==", species).get();
      const catches = catchesSnapshot.docs
        .map((doc) => ({
          ...doc.data(),
          id: doc.id,
          weight: parseFloat(doc.data().weight),
          length: parseFloat(doc.data().length || 0),
          girth: parseFloat(doc.data().girth || 0),
        }))
        .filter((catchItem) => validAnglerIds.includes(catchItem.anglerId) && catchItem.weight > 0);

      // Sort catches by weight, length, and girth for tiebreakers
      const sortedCatches = catches.sort((a, b) =>
        b.weight - a.weight || b.length - a.length || b.girth - a.girth
      );

      if (sortedCatches.length > 0) {
        sortedCatches[0].place = 1; // Assign first place to the top catch
      }

      return sortedCatches;
    };

    // Calculate total weight and first-place species for each angler
    const anglerWeights = {};
    for (const species of meatfishSpeciesList) {
      const catches = await getSpeciesFirstPlace(species);
      for (const catchItem of catches) {
        if (!anglerWeights[catchItem.anglerId]) {
          anglerWeights[catchItem.anglerId] = {
            totalWeight: 0,
            uniqueSpecies: new Set(), // Track unique species
            firstPlaceCount: 0,
          };
        }

        anglerWeights[catchItem.anglerId].totalWeight += catchItem.weight;

        // Add species to the unique species set
        anglerWeights[catchItem.anglerId].uniqueSpecies.add(species);

        // Track first-place species
        if (catchItem.place === 1) {
          anglerWeights[catchItem.anglerId].firstPlaceCount++;
        }
      }
    }

    // Filter anglers who meet the criteria
    let minSpeciesRequirement = 4;
    let qualifiedAnglers = [];

    while (qualifiedAnglers.length < numPlaces && minSpeciesRequirement > 0) {
      qualifiedAnglers = Object.entries(anglerWeights)
        .filter(([anglerId, stats]) =>
          stats.firstPlaceCount >= 1 && stats.uniqueSpecies.size >= minSpeciesRequirement
        )
        .map(([anglerId, stats]) => ({
          anglerId,
          totalWeight: stats.totalWeight,
          speciesCount: stats.uniqueSpecies.size, // Use the size of the unique species set
          firstPlaceCount: stats.firstPlaceCount,
        }))
        .sort((a, b) => b.totalWeight - a.totalWeight); // Sort by total weight (descending)
      minSpeciesRequirement--;
    }

    // Fetch angler details and map results
    const result = qualifiedAnglers.slice(0, numPlaces).map((entry, index) => {
      const angler = anglers[entry.anglerId] || {};
      return {
        place: index + 1,
        angler: angler.anglerName || "Unknown",
        division: angler.division,
        ageBracket: angler.ageBracket,
        hometown: angler.hometown,
        totalWeight: entry.totalWeight,
        speciesCount: entry.speciesCount,
        firstPlaceCount: entry.firstPlaceCount,
      };
    });

    // Return result
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


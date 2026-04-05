const { getFirestore } = require("firebase-admin/firestore");
const admin = require('firebase-admin');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

// Normalize names for matching — trim whitespace, collapse internal spaces, lowercase
const normalizeName = (name) =>
  (name || '').toString().trim().replace(/\s+/g, ' ').toLowerCase();

/**
 * Parse boardSelections — stored as JSON string or already parsed array.
 */
const parseBoardSelections = (raw) => {
  if (!raw) return [];
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return []; }
  }
  return Array.isArray(raw) ? raw : [];
};

/**
 * Calculate payout for a given place (1-indexed) using the payoutStructure map.
 * payoutStructure: { 1: 1.0, 2: 0.0, ... }
 */
const calculatePayout = (place, payoutStructure, netPotAmount) => {
  const fraction = payoutStructure?.[place] ?? 0;
  return Math.round(netPotAmount * fraction * 100) / 100;
};

exports.getAllPotData = async (req, res) => {
  console.log('Fetching all pot data...');
  const year = req.params.year;
  const db = getFirestore();

  try {
    const potCollectionRef = db.collection(`pots${year}`);
    const snapshot = await potCollectionRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'No pots found for this year.' });
    }

    const potData = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      potData.push({
        id: doc.id,
        ...data,
      });
    });

    res.status(200).json({ data: potData });

  } catch (error) {
    console.error('Error fetching pot data:', error);
    res.status(500).json({ error: 'Failed to fetch pot data. Please try again later.' });
  }
};

exports.getTotalPotSizeData = async (req, res) => {
  console.log('Fetching total pot size data...');
  const year = req.params.year;
  const db = getFirestore();
  const { boardNames } = req.body;

  try {
    const potCollectionRef = db.collection(`pots${year}`);
    const snapshot = await potCollectionRef.get();

    if (!snapshot || snapshot.empty) {
      const totalPotSize = 0;
      const boardTotals = {};
      boardNames.forEach(board => { boardTotals[board] = 0; });
      return res.status(200).json({ totalPotSize, boardTotals });
    }

    let totalPotSize = 0;
    const boardTotals = {};
    boardNames.forEach(board => { boardTotals[board] = 0; });

    snapshot.forEach(doc => {
      const data = doc.data();
      totalPotSize += parseFloat(data.totalPotFee || 0);

      boardNames.forEach(board => {
        let boardKey;
        if (board === "Bay/Surf") {
          boardKey = "BaySurf";
        } else if (board === "Catch & Release") {
          boardKey = "Catch&Release";
        } else {
          boardKey = board.replace(/[^a-zA-Z0-9]/g, '');
        }
        const boardFeeKey = `total${boardKey}Fee`;
        boardTotals[board] += parseFloat(data[boardFeeKey] || 0);
      });
    });

    return res.status(200).json({ totalPotSize, boardTotals });

  } catch (error) {
    console.error('Error fetching total pot size data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * C&R pot winner — team-based (scored by total release points from all anglers on the boat).
 * Entrant = boat name. Any angler on the boat contributes release points.
 */
exports.getDeepseaRoundupCatchAndReleasePotWinner = async (req, res) => {
  try {
    const year = req.params.year;
    if (!year) throw new Error('Year parameter is required');

    const db = getFirestore();
    const { species, numPlaces, potName, entryAmount, tournamentCut, payoutStructure } = req.body;

    // --- Collect entrant boat names for this specific pot ---
    const potSnapshot = await db.collection(`pots${year}`).get();
    const entrantBoatNames = new Set(); // normalized boat names
    const entrantBoatNamesRaw = {}; // normalized → original (for display)

    potSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const boardSelections = parseBoardSelections(data.boardSelections);

      const entered = boardSelections.some(board =>
        board.board === "Catch & Release" &&
        Array.isArray(board.potList) &&
        board.potList.some(p => normalizeName(p) === normalizeName(potName))
      );

      if (entered) {
        const key = normalizeName(data.name);
        entrantBoatNames.add(key);
        if (!entrantBoatNamesRaw[key]) entrantBoatNamesRaw[key] = data.name;
      }
    });

    if (entrantBoatNames.size === 0) {
      return res.status(200).json([]);
    }

    // --- Build anglerId → normalized boat name map ---
    const anglersSnapshot = await db.collection(`anglers${year}`).get();
    const anglerBoatMap = {}; // anglerId → normalized boat name
    anglersSnapshot.docs.forEach(doc => {
      const boatKey = normalizeName(doc.data().boatName);
      anglerBoatMap[doc.id] = boatKey;
    });

    // --- Tally release points by team ---
    const catchesSnapshot = await db.collection(`catches${year}`)
      .where("species", "==", species)
      .get();

    const teamStats = {};
    catchesSnapshot.docs.forEach(doc => {
      const catchData = doc.data();
      const boatKey = anglerBoatMap[catchData.anglerId];
      if (!boatKey || !entrantBoatNames.has(boatKey)) return;

      const points = parseFloat(catchData.points || 0);
      if (!teamStats[boatKey]) {
        teamStats[boatKey] = {
          team: entrantBoatNamesRaw[boatKey] || boatKey,
          points: 0,
          lastCatch: catchData.dateTime,
        };
      }
      teamStats[boatKey].points += points;
      if (catchData.dateTime && dayjs(catchData.dateTime).isAfter(dayjs(teamStats[boatKey].lastCatch))) {
        teamStats[boatKey].lastCatch = catchData.dateTime;
      }
    });

    const sortedTeams = Object.values(teamStats)
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        return dayjs(a.lastCatch).diff(dayjs(b.lastCatch)); // earlier last catch wins on tie
      });

    const potAmount = (entryAmount || 0) * entrantBoatNames.size;
    const netPotAmount = potAmount * (1 - (tournamentCut || 0));

    const result = sortedTeams.slice(0, numPlaces).map((team, index) => ({
      place: index + 1,
      team: team.team,
      points: team.points,
      lastCatch: team.lastCatch,
      payout: calculatePayout(index + 1, payoutStructure, netPotAmount),
      entrantCount: entrantBoatNames.size,
    }));

    res.status(200).json(result);
  } catch (e) {
    console.error('Error fetching catch & release pot winner:', e);
    res.status(500).json({ error: e.message });
  }
};

/**
 * Offshore meatfish pot winner — individual-level (heaviest single fish per angler).
 * Entrant = boat. Eligible anglers must be on an entrant boat, matching division and ageBracket.
 */
exports.getDeepseaRoundupOffshorePotWinner = async (req, res) => {
  try {
    const year = req.params.year;
    if (!year) throw new Error('Year parameter is required');

    const db = getFirestore();
    const { species, division, ageBracket, numPlaces, potName, entryAmount, tournamentCut, payoutStructure } = req.body;

    // --- Collect entrant boat names ---
    const potSnapshot = await db.collection(`pots${year}`).get();
    const entrantBoatNames = new Set();

    potSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const boardSelections = parseBoardSelections(data.boardSelections);

      const entered = boardSelections.some(board =>
        board.board === "Offshore" &&
        Array.isArray(board.potList) &&
        board.potList.some(p => normalizeName(p) === normalizeName(potName))
      );

      if (entered) {
        entrantBoatNames.add(normalizeName(data.name));
      }
    });

    if (entrantBoatNames.size === 0) {
      return res.status(200).json([]);
    }

    // --- Find valid anglers: on entrant boat, matching division + ageBracket ---
    const anglersSnapshot = await db.collection(`anglers${year}`).get();
    const validAnglerIds = new Set();
    const anglerDetails = {};

    anglersSnapshot.docs.forEach(doc => {
      const angler = doc.data();
      const boatKey = normalizeName(angler.boatName);

      const divisionMatch = !division || angler.division === division;
      const ageBracketMatch = !ageBracket || angler.ageBracket === ageBracket;

      if (divisionMatch && ageBracketMatch && entrantBoatNames.has(boatKey)) {
        validAnglerIds.add(doc.id);
        anglerDetails[doc.id] = angler;
      }
    });

    if (validAnglerIds.size === 0) {
      return res.status(200).json([]);
    }

    // --- Get catches: one winner per angler, heaviest fish ---
    const catchesSnapshot = await db.collection(`catches${year}`)
      .where("species", "==", species)
      .get();

    // Best catch per angler
    const bestCatchByAngler = {};
    catchesSnapshot.docs.forEach(doc => {
      const c = doc.data();
      if (!validAnglerIds.has(c.anglerId)) return;
      const weight = parseFloat(c.weight || 0);
      const length = parseFloat(c.length || 0);
      if (weight <= 0) return;
      const existing = bestCatchByAngler[c.anglerId];
      if (!existing || weight > existing.weight || (weight === existing.weight && length > existing.length)) {
        bestCatchByAngler[c.anglerId] = { ...c, weight, length };
      }
    });

    const catches = Object.values(bestCatchByAngler)
      .sort((a, b) => b.weight - a.weight || b.length - a.length);

    const potAmount = (entryAmount || 0) * entrantBoatNames.size;
    const netPotAmount = potAmount * (1 - (tournamentCut || 0));

    const result = catches.slice(0, numPlaces).map((catchItem, index) => {
      const angler = anglerDetails[catchItem.anglerId] || {};
      return {
        place: index + 1,
        angler: angler.anglerName || 'Unknown',
        team: angler.boatName || '',
        weight: catchItem.weight,
        length: catchItem.length,
        payout: calculatePayout(index + 1, payoutStructure, netPotAmount),
        entrantCount: entrantBoatNames.size,
      };
    });

    res.status(200).json(result);
  } catch (e) {
    console.error('Error fetching offshore pot winner:', e);
    res.status(500).json({ error: e.message });
  }
};

const BAY_SURF_ELIGIBLE_DIVISIONS = ["Bay/Surf", "Kayak", "Flyfishing"];

/**
 * Bay/Surf pot winner — individual-level (heaviest single fish per angler).
 * Entrant = individual angler by name. Kayak and Flyfishing eligible for bay/surf pots.
 */
exports.getDeepseaRoundupBaySurfPotWinner = async (req, res) => {
  try {
    const year = req.params.year;
    if (!year) throw new Error('Year parameter is required');

    const db = getFirestore();
    const { species, ageBracket, numPlaces, potName, entryAmount, tournamentCut, payoutStructure } = req.body;

    // --- Collect entrant angler names ---
    const potSnapshot = await db.collection(`pots${year}`).get();
    const entrantAnglerNames = new Set(); // normalized angler names
    const entrantAnglerNamesRaw = {}; // normalized → original

    potSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const boardSelections = parseBoardSelections(data.boardSelections);

      const entered = boardSelections.some(board =>
        board.board === "Bay/Surf" &&
        Array.isArray(board.potList) &&
        board.potList.some(p => normalizeName(p) === normalizeName(potName))
      );

      if (entered) {
        const key = normalizeName(data.name);
        entrantAnglerNames.add(key);
        if (!entrantAnglerNamesRaw[key]) entrantAnglerNamesRaw[key] = data.name;
      }
    });

    if (entrantAnglerNames.size === 0) {
      return res.status(200).json([]);
    }

    // --- Find valid anglers ---
    const anglersSnapshot = await db.collection(`anglers${year}`).get();
    const validAnglerIds = new Set();
    const anglerDetails = {};

    anglersSnapshot.docs.forEach(doc => {
      const angler = doc.data();
      const nameKey = normalizeName(angler.anglerName);
      const ageBracketMatch = !ageBracket || angler.ageBracket === ageBracket;

      if (
        BAY_SURF_ELIGIBLE_DIVISIONS.includes(angler.division) &&
        ageBracketMatch &&
        entrantAnglerNames.has(nameKey)
      ) {
        validAnglerIds.add(doc.id);
        anglerDetails[doc.id] = angler;
      }
    });

    if (validAnglerIds.size === 0) {
      return res.status(200).json([]);
    }

    // --- Get catches: one winner per angler, heaviest fish ---
    const catchesSnapshot = await db.collection(`catches${year}`)
      .where("species", "==", species)
      .get();

    const bestCatchByAngler = {};
    catchesSnapshot.docs.forEach(doc => {
      const c = doc.data();
      if (!validAnglerIds.has(c.anglerId)) return;
      if (!BAY_SURF_ELIGIBLE_DIVISIONS.includes(c.division)) return;
      const weight = parseFloat(c.weight || 0);
      const length = parseFloat(c.length || 0);
      if (weight <= 0) return;
      const existing = bestCatchByAngler[c.anglerId];
      if (!existing || weight > existing.weight || (weight === existing.weight && length > existing.length)) {
        bestCatchByAngler[c.anglerId] = { ...c, weight, length };
      }
    });

    const catches = Object.values(bestCatchByAngler)
      .sort((a, b) => b.weight - a.weight || b.length - a.length);

    const potAmount = (entryAmount || 0) * entrantAnglerNames.size;
    const netPotAmount = potAmount * (1 - (tournamentCut || 0));

    const result = catches.slice(0, numPlaces).map((catchItem, index) => {
      const angler = anglerDetails[catchItem.anglerId] || {};
      return {
        place: index + 1,
        angler: angler.anglerName || entrantAnglerNamesRaw[normalizeName(angler.anglerName)] || 'Unknown',
        weight: catchItem.weight,
        length: catchItem.length,
        payout: calculatePayout(index + 1, payoutStructure, netPotAmount),
        entrantCount: entrantAnglerNames.size,
      };
    });

    res.status(200).json(result);
  } catch (e) {
    console.error('Error fetching bay surf pot winner:', e);
    res.status(500).json({ error: e.message });
  }
};

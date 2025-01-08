const { getFirestore } = require("firebase-admin/firestore");
const admin = require('firebase-admin');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

exports.getAllPotData = async (req, res) => {
  console.log('Fetching all pot data...');
  const year = req.params.year;
  const db = getFirestore();
  const { potYear } = req.body;

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
  const { potYear, boardNames } = req.body;

  try {
    const potCollectionRef = db.collection(`pots${year}`);
    const snapshot = await potCollectionRef.get();
    
    if (!snapshot || snapshot.empty) {
      const totalPotSize = 0;
      const boardTotals = {};
      boardNames.forEach(board => {
        boardTotals[board] = 0;
      });
      return res.status(200).json({ totalPotSize, boardTotals });
    }

    let totalPotSize = 0;
    const boardTotals = {};
    boardNames.forEach(board => {
      boardTotals[board] = 0;
    });

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
        console.log('boardFeeKey:', boardFeeKey);
        boardTotals[board] += parseFloat(data[boardFeeKey] || 0);
      });
    });

    return res.status(200).json({
      totalPotSize,
      boardTotals
    });

  } catch (error) {
    console.error('Error fetching total pot size data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getDeepseaRoundupCatchAndReleasePotWinner = async (req, res) => {
  try {
    const year = req.params.year;
    if (!year) throw new Error('Year parameter is required');

    const db = getFirestore();
    const { species, numPlaces } = req.body;
    
    // Get pot entrants
    const potSnapshot = await db.collection(`pots${year}`).get();
    const entrantTeams = new Set();
    
    potSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const boardSelections = typeof data.boardSelections === 'string' 
        ? JSON.parse(data.boardSelections)
        : data.boardSelections;
      
      if (boardSelections?.some(board => 
        board.board === "Catch & Release" && 
        board.potList.includes(req.body.potName)
      )) {
        entrantTeams.add(data.name);
      }
    });

    if (entrantTeams.size === 0) return res.status(200).json([]);

    // Get angler data to map anglerId -> boatName
    const anglersSnapshot = await db.collection(`anglers${year}`).get();
    const anglerBoatMap = {};
    anglersSnapshot.docs.forEach(doc => {
      anglerBoatMap[doc.id] = doc.data().boatName;
    });

    // Get and process catches
    const catchesSnapshot = await db.collection(`catches${year}`)
      .where("species", "==", species)
      .get();

    const teamStats = {};
    catchesSnapshot.docs.forEach(doc => {
      const catchData = doc.data();
      const team = anglerBoatMap[catchData.anglerId];
      
      if (!team || !entrantTeams.has(team)) return;
      
      const points = parseFloat(catchData.points || 0);
      
      if (!teamStats[team]) {
        teamStats[team] = {
          team,
          points: 0,
          lastCatch: catchData.dateTime
        };
      }
      
      teamStats[team].points += points;
      if (dayjs(catchData.dateTime).isAfter(dayjs(teamStats[team].lastCatch))) {
        teamStats[team].lastCatch = catchData.dateTime;
      }
    });

    const sortedTeams = Object.values(teamStats)
      .sort((a, b) => {
        if (b.points === a.points) {
          return dayjs(a.lastCatch).diff(dayjs(b.lastCatch));
        }
        return b.points - a.points;
      });

    const potAmount = req.body.entryAmount * entrantTeams.size;
    const netPotAmount = potAmount * (1 - req.body.tournamentCut);

    const result = sortedTeams.slice(0, numPlaces).map((team, index) => ({
      place: index + 1,
      team: team.team,
      points: team.points,
      lastCatch: team.lastCatch,
      payout: index === 0 ? netPotAmount : 0
    }));

    res.status(200).json(result);
  } catch (e) {
    console.error('Error fetching catch & release pot winner:', e);
    res.status(500).json({ error: e.message });
  }
};

exports.getDeepseaRoundupOffshorePotWinner = async (req, res) => {
  try {
    const year = req.params.year;
    if (!year) {
      throw new Error('Year parameter is required');
    }

    const db = getFirestore();
    const { species, division, ageBracket, numPlaces } = req.body;

    const potSnapshot = await db.collection(`pots${year}`).get();
    const entrantTeams = new Set();
    
    potSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const boardSelections = typeof data.boardSelections === 'string' 
        ? JSON.parse(data.boardSelections)
        : data.boardSelections;
      
      if (boardSelections?.some(board => 
        board.board === "Offshore" && 
        board.potList.includes(req.body.potName)
      )) {
        entrantTeams.add(data.name);
      }
    });

    if (entrantTeams.size === 0) {
      return res.status(200).json([]);
    }

    const anglersSnapshot = await db.collection(`anglers${year}`).get();
    const validAnglerIds = new Set();
    const anglerDetails = {};

    anglersSnapshot.docs.forEach(doc => {
      const angler = doc.data();
      if (angler.ageBracket === ageBracket && 
          angler.division === division &&
          entrantTeams.has(angler.boatName)) {
        validAnglerIds.add(doc.id);
        anglerDetails[doc.id] = angler;
      }
    });

    if (validAnglerIds.size === 0) {
      return res.status(200).json([]);
    }

    const catchesSnapshot = await db.collection(`catches${year}`)
      .where("species", "==", species)
      .where("division", "==", division)
      .get();

    let catches = catchesSnapshot.docs
      .map(doc => ({
        ...doc.data(),
        weight: parseFloat(doc.data().weight || 0),
        length: parseFloat(doc.data().length || 0)
      }))
      .filter(item => validAnglerIds.has(item.anglerId) && item.weight > 0)
      .sort((a, b) => b.weight - a.weight || b.length - a.length);

    const potAmount = req.body.entryAmount * entrantTeams.size;
    const netPotAmount = potAmount * (1 - req.body.tournamentCut);

    const result = catches.slice(0, numPlaces).map((catchItem, index) => {
      const angler = anglerDetails[catchItem.anglerId] || {};
      return {
        place: index + 1,
        angler: angler.anglerName,
        weight: catchItem.weight,
        length: catchItem.length,
        payout: index === 0 ? netPotAmount : 0
      };
    });

    res.status(200).json(result);
  } catch (e) {
    console.error('Error fetching offshore pot winner:', e);
    res.status(500).json({ error: e.message });
  }
};

exports.getDeepseaRoundupBaySurfPotWinner = async (req, res) => {
  try {
    const year = req.params.year;
    if (!year) {
      throw new Error('Year parameter is required');
    }

    const db = getFirestore();
    const { species, division, ageBracket, numPlaces } = req.body;

    const potSnapshot = await db.collection(`pots${year}`).get();
    const entrantAnglers = new Set();
    
    potSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const boardSelections = typeof data.boardSelections === 'string' 
        ? JSON.parse(data.boardSelections)
        : data.boardSelections;
      
      if (boardSelections?.some(board => 
        board.board === "Bay/Surf" && 
        board.potList.includes(req.body.potName)
      )) {
        entrantAnglers.add(data.name);
      }
    });

    if (entrantAnglers.size === 0) {
      return res.status(200).json([]);
    }

    const anglersSnapshot = await db.collection(`anglers${year}`).get();
    const validAnglerIds = new Set();
    const anglerDetails = {};

    anglersSnapshot.docs.forEach(doc => {
      const angler = doc.data();
      if (angler.ageBracket === ageBracket && 
          angler.division === division &&
          entrantAnglers.has(angler.anglerName)) {
        validAnglerIds.add(doc.id);
        anglerDetails[doc.id] = angler;
      }
    });

    if (validAnglerIds.size === 0) {
      return res.status(200).json([]);
    }

    const catchesSnapshot = await db.collection(`catches${year}`)
      .where("species", "==", species)
      .where("division", "==", division)
      .get();

    let catches = catchesSnapshot.docs
      .map(doc => ({
        ...doc.data(),
        weight: parseFloat(doc.data().weight || 0),
        length: parseFloat(doc.data().length || 0)
      }))
      .filter(item => validAnglerIds.has(item.anglerId) && item.weight > 0)
      .sort((a, b) => b.weight - a.weight || b.length - a.length);

    const potAmount = req.body.entryAmount * entrantAnglers.size;
    const netPotAmount = potAmount * (1 - req.body.tournamentCut);

    const result = catches.slice(0, numPlaces).map((catchItem, index) => {
      const angler = anglerDetails[catchItem.anglerId] || {};
      return {
        place: index + 1,
        angler: angler.anglerName,
        weight: catchItem.weight,
        length: catchItem.length,
        payout: index === 0 ? netPotAmount : 0
      };
    });

    res.status(200).json(result);
  } catch (e) {
    console.error('Error fetching bay surf pot winner:', e);
    res.status(500).json({ error: e.message });
  }
};


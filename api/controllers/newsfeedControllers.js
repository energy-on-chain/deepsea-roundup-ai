const { getFirestore } = require("firebase-admin/firestore");
const dayjs = require('dayjs');
const advancedFormat = require('dayjs/plugin/advancedFormat');
const utc = require('dayjs/plugin/utc');  // To handle UTC timezones, if necessary

dayjs.extend(advancedFormat); // Extend dayjs with advancedFormat for ordinal dates
dayjs.extend(utc);

// Centralized timestamp formatting function
const formatTimestamp = (timestamp) => {
  return dayjs(timestamp).format('hh:mm A, MMM Do YYYY');
};

exports.getTypeCountDataForNewsfeedTable = async (req, res) => {
  console.log('In api/get_type_count_data_for_newsfeed_table...');
  const year = req.params.year;
  const db = getFirestore();
  const catchYear = req.body.catchYear;

  try {
    const snapshot = await db.collection(`catches${year}`).get();
    const typeCount = {};

    snapshot.forEach(doc => {
      const data = doc.data();
      const type = data.type;
      if (typeCount[type]) {
        typeCount[type] += 1;
      } else {
        typeCount[type] = 1;
      }
    });

    // Adding total count
    const totalCount = Object.values(typeCount).reduce((a, b) => a + b, 0);
    typeCount['Total Count'] = totalCount;

    // Convert to array and sort by count (descending), placing "Total Count" at the end
    const sortedTypeCount = Object.entries(typeCount)
      .filter(([key]) => key !== 'Total Count')
      .sort(([, a], [, b]) => b - a);

    sortedTypeCount.push(['Total Count', totalCount]); // Ensure "Total Count" is last

    return res.status(200).json(sortedTypeCount.map(([key, value]) => ({ category: key, count: value })));
  } catch (e) {
    console.error('Error fetching Type Count Data:', e);
    return res.status(500).json({ error: 'Error fetching Type Count Data' });
  }
};

exports.getDivisionCountDataForNewsfeedTable = async (req, res) => {
  console.log('In api/get_division_count_data_for_newsfeed_table...');
  const year = req.params.year;
  const db = getFirestore();
  const catchYear = req.body.catchYear;

  try {
    const snapshot = await db.collection(`catches${year}`).get();
    const divisionCount = {};

    snapshot.forEach(doc => {
      const data = doc.data();
      const division = data.division;
      if (divisionCount[division]) {
        divisionCount[division] += 1;
      } else {
        divisionCount[division] = 1;
      }
    });

    // Adding total count
    const totalCount = Object.values(divisionCount).reduce((a, b) => a + b, 0);
    divisionCount['Total Count'] = totalCount;

    // Convert to array and sort by count (descending), placing "Total Count" at the end
    const sortedDivisionCount = Object.entries(divisionCount)
      .filter(([key]) => key !== 'Total Count')
      .sort(([, a], [, b]) => b - a);

    sortedDivisionCount.push(['Total Count', totalCount]); // Ensure "Total Count" is last

    return res.status(200).json(sortedDivisionCount.map(([key, value]) => ({ category: key, count: value })));
  } catch (e) {
    console.error('Error fetching Type Count Data:', e);
    return res.status(500).json({ error: 'Error fetching Type Count Data' });
  }
};

exports.getSpeciesCountDataForNewsfeedTable = async (req, res) => {
  console.log('In api/get_species_count_data_for_newsfeed_table...');
  const year = req.params.year;
  const db = getFirestore();
  const catchYear = req.body.catchYear;

  try {
    const snapshot = await db.collection(`catches${year}`).get();
    const speciesCount = {};

    snapshot.forEach(doc => {
      const data = doc.data();
      const species = data.species;
      if (speciesCount[species]) {
        speciesCount[species] += 1;
      } else {
        speciesCount[species] = 1;
      }
    });

    // Calculate total count separately
    const totalCount = Object.values(speciesCount).reduce((a, b) => a + b, 0);

    // Convert the species count object to an array of [species, count] pairs
    let sortedSpeciesCount = Object.entries(speciesCount)
      .sort(([, a], [, b]) => b - a);  // Sort by count in descending order

    // Append "Total Count" as the last item
    sortedSpeciesCount.push(['Total Count', totalCount]);

    // Return the sorted list as JSON
    return res.status(200).json(sortedSpeciesCount.map(([key, value]) => ({
      category: key,
      count: value
    })));
  } catch (e) {
    console.error('Error fetching Species Count Data:', e);
    return res.status(500).json({ error: 'Error fetching Species Count Data' });
  }
};

exports.getTeamCountDataForNewsfeedTable = async (req, res) => {
  console.log('In api/get_team_count_data_for_newsfeed_table...');
  const year = req.params.year;
  const db = getFirestore();
  const catchYear = req.body.catchYear;

  try {
    const snapshot = await db.collection(`catches${year}`).get();
    const anglerCount = {};

    snapshot.forEach(doc => {
      const data = doc.data();
      const anglerName = data.anglerName;
      if (anglerCount[anglerName]) {
        anglerCount[anglerName] += 1;
      } else {
        anglerCount[anglerName] = 1;
      }
    });

    // Adding total count
    const totalCount = Object.values(anglerCount).reduce((a, b) => a + b, 0);
    anglerCount['Total Count'] = totalCount;

    // Convert to array and sort by count (descending), placing "Total Count" at the end
    const sortedAnglerCount = Object.entries(anglerCount)
      .filter(([key]) => key !== 'Total Count')
      .sort(([, a], [, b]) => b - a);

    sortedAnglerCount.push(['Total Count', totalCount]); // Ensure "Total Count" is last

    return res.status(200).json(sortedAnglerCount.map(([key, value]) => ({ category: key, count: value })));
  } catch (e) {
    console.error('Error fetching Angler Count Data:', e);
    return res.status(500).json({ error: 'Error fetching Angler Count Data' });
  }
};

exports.getDateCountDataForNewsfeedTable = async (req, res) => {
  console.log('In api/get_date_count_data_for_newsfeed_table...');
  const year = req.params.year;
  const db = getFirestore();
  const catchYear = req.body.catchYear;

  try {
    const snapshot = await db.collection(`catches${year}`).get();
    const dateCount = {};

    snapshot.forEach(doc => {
      const data = doc.data();
      const formattedDate = dayjs(data.dateTime).format('MMMM Do, YYYY'); // Format date as "September 9th, 2024"
      const dateKey = dayjs(data.dateTime); // Keep track of original date for sorting
      if (dateCount[formattedDate]) {
        dateCount[formattedDate].count += 1;
      } else {
        dateCount[formattedDate] = { count: 1, dateKey }; // Store both formatted date and dateKey for sorting
      }
    });

    // Adding total count
    const totalCount = Object.values(dateCount).reduce((a, b) => a + b.count, 0);
    dateCount['Total Count'] = { count: totalCount };

    // Convert to array, sort by date (descending), and place "Total Count" at the end
    const sortedDateCount = Object.entries(dateCount)
      .filter(([key]) => key !== 'Total Count')
      .sort(([, a], [, b]) => b.dateKey - a.dateKey); // Sort by original dateKey in descending order

    sortedDateCount.push(['Total Count', { count: totalCount }]); // Ensure "Total Count" is last

    return res.status(200).json(sortedDateCount.map(([key, value]) => ({
      category: key,
      count: value.count
    })));
  } catch (e) {
    console.error('Error fetching Date Count Data:', e);
    return res.status(500).json({ error: 'Error fetching Date Count Data' });
  }
};

exports.getEventDataForNewsfeedTable = async (req, res) => {
  console.log('In api/get_event_data_for_newsfeed_table...');
  const year = req.params.year;
  const db = getFirestore();
  const catchYear = req.body.catchYear;
  const teamYear = req.body.teamsYear;
  const announcementYear = req.body.announcementsYear;

  try {
    const eventArray = [];

    // Fetch Catch data
    const catchSnapshot = await db.collection(`catches${year}`).get();
    catchSnapshot.forEach(doc => {
      const data = doc.data();
      eventArray.push({
        type: 'Catch',
        title: data.anglerName,
        subtitle: `${data.anglerName} caught a ${data.species}!`,
        timestamp: data.dateTime ? new Date(data.dateTime).toISOString() : null,  // Format timestamp to ISO
        points: data.points
      });
    });

    // Fetch Team registration data
    const teamSnapshot = await db.collection(`anglers${year}`).get();
    teamSnapshot.forEach(doc => {
      const data = doc.data();
      eventArray.push({
        type: 'Register',
        title: data.anglerName,
        subtitle: `${data.anglerName} registered for the event!`,
        timestamp: data.registrationTimestamp ? new Date(data.registrationTimestamp).toISOString() : null,  // Format timestamp to ISO
        points: "-"
      });
    });

    // Fetch Announcement data
    const announcementSnapshot = await db.collection(`announcements${year}`).get();
    announcementSnapshot.forEach(doc => {
      const data = doc.data();
      
      // Check if the announcement has a hyperlink
      let subtitle = data.subtitle;
      if (data.hyperlink) {
        subtitle = `${data.subtitle} (Link: ${data.hyperlink})`;
      }

      eventArray.push({
        type: 'Announcement',
        title: data.title,
        subtitle: subtitle,
        timestamp: data.timestamp ? new Date(data.timestamp).toISOString() : null,  // Format timestamp to ISO
        points: data.points || "-"
      });
    });

    // Sort events by timestamp (most recent first)
    eventArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return res.status(200).json(eventArray);
  } catch (e) {
    console.error('Error fetching event data:', e);
    return res.status(500).json({ error: 'Error fetching event data' });
  }
};


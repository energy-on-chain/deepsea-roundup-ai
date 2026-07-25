const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");

// Helpers
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

const flattenObjectWithPrefix = (obj, prefix = '') => {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      Object.assign(acc, flattenObjectWithPrefix(obj[k], pre + k));
    } else {
      acc[pre + k] = String(obj[k]); // Convert both keys and values to strings
    }
    return acc;
  }, {});
};

module.exports = ({redisClient}) => {

  // General
  const adminGetDatabaseList = async (req, res) => {
    console.log('In api/admin_get_database_list...');
  
    try {

      const { year } = req.params;
      let tableName = req.body.tableName;

      const db = getFirestore();
      const documentObject = {};
      const snapshot = await db.collection(tableName).get();
      snapshot.forEach(document => {
        documentObject[document.id] = document.data();
      });
      res.send(documentObject);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  };

  const adminGetAnglerList = async (req, res) => {
    console.log('In api/admin_get_angler_list...');
  
    try {

      const { year } = req.params;

      const db = getFirestore();
      const documentObject = {};
      const snapshot = await db.collection(`anglers${year}`).get();
      snapshot.forEach(document => {
        documentObject[document.id] = document.data();
      });
      res.send(documentObject);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  };
  
  const adminGetOldTeamNameList = async (req, res) => {
    console.log('In api/admin_get_old_team_name_list...');
  
    try {

      let tableName = req.body.tableName;

      const db = getFirestore();
      const documentObject = {};
      const snapshot = await db.collection(tableName).get();
      snapshot.forEach(document => {
        documentObject[document.id] = document.data();
      });
      res.send(documentObject);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  };
  
  // Anglers
  const adminEditAngler = async (req, res) => {
    try {
      const { year } = req.params;
      const db = getFirestore();
  
      const formData = { ...req.body };
      formData.hasCheckedIn = formData.hasCheckedIn === true || formData.hasCheckedIn === 'true';

      const { anglerId } = formData;
      delete formData.anglerId;

      // speciesConfigList (species/division pairs from CONFIG_CATCHES_SPECIES_LIST) is sent
      // along by the frontend purely to validate a division change against this angler's
      // existing catches below -- it's never persisted onto the angler document itself.
      const speciesConfigList = Array.isArray(formData.speciesConfigList) ? formData.speciesConfigList : [];
      delete formData.speciesConfigList;

      // editedBy (the logged-in admin's email) is sent along purely for the change log below --
      // never persisted onto the angler document itself.
      const editedBy = formData.editedBy || 'Unknown';
      delete formData.editedBy;

      const anglerDocRef = db.collection(`anglers${year}`).doc(anglerId);
      const anglerDoc = await anglerDocRef.get();

      if (!anglerDoc.exists) {
        return res.status(404).json({ error: 'Angler not found' });
      }

      const existingAnglerData = anglerDoc.data();
      const updatedFields = Object.keys(formData).reduce((acc, key) => {
        if (existingAnglerData[key] !== formData[key]) {
          acc[key] = formData[key];
        }
        return acc;
      }, {});

      // Fetch this angler's existing catches once -- used both to validate a division change
      // (immediately below) and to cascade any changed fields onto them (further below).
      const catchesRef = db.collection(`catches${year}`);
      const catchesSnapshot = await catchesRef.where('anglerId', '==', anglerId).get();

      // Changing division would otherwise silently mislabel any existing catch whose species
      // doesn't exist in the new division -- this is exactly how the Joey Jaggers cross-division
      // display bug happened. Block the whole edit instead of writing bad data; the admin has to
      // resolve those catches (edit species, reassign angler, or delete) before the division can change.
      if (updatedFields.division) {
        const validSpeciesForNewDivision = new Set(
          speciesConfigList
            .filter((s) => s.division === updatedFields.division)
            .map((s) => s.species)
        );
        const incompatibleSpecies = [...new Set(
          catchesSnapshot.docs
            .map((doc) => doc.data().species)
            .filter((species) => !validSpeciesForNewDivision.has(species))
        )];

        if (incompatibleSpecies.length > 0) {
          return res.status(400).json({
            error: `Cannot change division to "${updatedFields.division}" -- this angler has existing catches (${incompatibleSpecies.join(', ')}) that aren't valid in that division. Resolve those catches first (edit species, reassign angler, or delete), then change the division.`,
          });
        }
      }

      // Update angler document
      await anglerDocRef.update(formData);

      // Update catches if there are changes in relevant fields
      if (Object.keys(updatedFields).length > 0) {
        const updatePromises = [];
        catchesSnapshot.forEach(doc => {
          const catchData = doc.data();
          const catchUpdate = {};
          Object.keys(updatedFields).forEach(key => {
            if (catchData.hasOwnProperty(key)) {
              catchUpdate[key] = updatedFields[key];
            }
          });

          if (Object.keys(catchUpdate).length > 0) {
            updatePromises.push(doc.ref.update(catchUpdate));
          }
        });

        await Promise.all(updatePromises);

        // Audit log entry -- records exactly what changed, who changed it, and (crucially)
        // both the name before and after this edit, so a search for an angler's ORIGINAL name
        // still surfaces this entry even after a later rename. This is the paper trail for
        // "you asked us to change it to this name on this date" if a participant later claims
        // their registration was lost rather than intentionally renamed.
        const changes = {};
        Object.keys(updatedFields).forEach((key) => {
          changes[key] = { from: existingAnglerData[key] ?? null, to: updatedFields[key] };
        });

        await db.collection(`anglerChangeLog${year}`).add({
          anglerId,
          timestamp: new Date().toISOString(),
          editedBy,
          anglerNameBefore: existingAnglerData.anglerName || 'Unknown',
          anglerNameAfter: formData.anglerName || existingAnglerData.anglerName || 'Unknown',
          changes,
        });
      }

      // Handle pot records updates
      const potsRef = db.collection(`pots${year}`);
      
      // Update pot names if angler or boat name changed
      if (updatedFields.anglerName || updatedFields.boatName) {
        const oldName = existingAnglerData.anglerName || existingAnglerData.boatName;
        const newName = formData.anglerName || formData.boatName;
        
        const potSnapshot = await potsRef.where('name', '==', oldName).get();
        const potUpdatePromises = potSnapshot.docs.map(doc => 
          doc.ref.update({ name: newName })
        );
        await Promise.all(potUpdatePromises);
      }
  
      // Delete pot records if eligibility changed
      if (formData.ageBracket === 'Junior' || updatedFields.division) {
        const anglerName = formData.anglerName || existingAnglerData.anglerName;
        const potSnapshot = await potsRef.where('name', '==', anglerName).get();
        
        const potDeletePromises = potSnapshot.docs.map(async doc => {
          const potData = doc.data();
          if (potData.totalOffshoreFishPotsFee > 0 || potData.totalBaySurfFishPotsFee > 0) {
            return doc.ref.delete();
          }
        });
        await Promise.all(potDeletePromises);
      }
  
      res.sendStatus(200);
    } catch (error) {
      console.error('Error updating angler:', error);
      res.status(500).json({ error: error.message });
    }
  };
  
  const adminDeleteAngler = async (req, res) => {
    try {
      const { year } = req.params;
      const db = getFirestore();
      const { anglerId, tableName } = req.body;
  
      const anglerDocRef = db.collection(tableName).doc(anglerId);
      const anglerDoc = await anglerDocRef.get();
  
      if (!anglerDoc.exists) {
        return res.status(404).json({ error: 'Angler not found' });
      }
  
      const anglerData = anglerDoc.data();
  
      // Handle team pot records if angler has a boat name
      if (anglerData.boatName) {
        const anglersSnapshot = await db.collection(tableName)
          .where('boatName', '==', anglerData.boatName)
          .get();
        
        // If this is the last angler with this boat name
        if (anglersSnapshot.size <= 1) {
          const teamPotsSnapshot = await db.collection(`pots${year}`)
            .where('name', '==', anglerData.boatName)
            .get();
          const teamPotDeletePromises = teamPotsSnapshot.docs.map(doc => doc.ref.delete());
          await Promise.all(teamPotDeletePromises);
        }
      }
  
      // Delete angler's individual pot records
      const potsRef = db.collection(`pots${year}`);
      const potSnapshot = await potsRef.where('name', '==', anglerData.anglerName).get();
      const potDeletePromises = potSnapshot.docs.map(doc => doc.ref.delete());
  
      // Delete angler's catches
      const catchesRef = db.collection(`catches${year}`);
      const catchSnapshot = await catchesRef.where('anglerId', '==', anglerId).get();
      const catchDeletePromises = catchSnapshot.docs.map(doc => doc.ref.delete());
  
      // Delete all records
      await Promise.all([
        anglerDocRef.delete(),
        ...potDeletePromises,
        ...catchDeletePromises
      ]);
  
      res.sendStatus(200);
    } catch (e) {
      console.log('There was an error while deleting an angler...', e);
      res.status(500).json({ error: e.message });
    }
  };

  // Boat name cleanup -- surfaces likely duplicate spellings of the same boat
  // ("Reel Deal" / "The Reel Deal" / "Reel Deel") for an admin to review and merge.
  // Nothing merges automatically; every cluster requires an explicit approve.

  // Lowercase, drop a leading "the", strip punctuation, collapse whitespace.
  const normalizeBoatName = (name) => {
    return (name || '')
      .toLowerCase()
      .replace(/^the\s+/, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Plain Levenshtein edit distance -- strings here are short (boat names), no dependency needed.
  const levenshteinDistance = (a, b) => {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[m][n];
  };

  // 0..1 similarity ratio (1 = identical after normalization).
  const boatNameSimilarity = (a, b) => {
    const normA = normalizeBoatName(a);
    const normB = normalizeBoatName(b);
    if (!normA || !normB) return 0;
    if (normA === normB) return 1;
    const maxLen = Math.max(normA.length, normB.length);
    return 1 - levenshteinDistance(normA, normB) / maxLen;
  };

  // Conservative default -- catches obvious typos/variants (e.g. "Reel Deal" vs "Reel Deel")
  // without being so loose it flags genuinely different boats as likely dupes too often.
  const BOAT_NAME_SIMILARITY_THRESHOLD = 0.8;

  const adminGetFuzzyBoatNameClusters = async (req, res) => {
    try {
      const { year } = req.params;
      const db = getFirestore();

      const anglersSnapshot = await db.collection(`anglers${year}`).get();

      // Group anglers by exact (trimmed) boat name spelling
      const bySpelling = {};
      anglersSnapshot.docs.forEach((doc) => {
        const angler = doc.data();
        const name = (angler.boatName || '').trim();
        if (!name) return;
        if (!bySpelling[name]) bySpelling[name] = [];
        bySpelling[name].push({ anglerId: doc.id, anglerName: angler.anglerName || 'Unknown' });
      });

      const distinctNames = Object.keys(bySpelling);

      // Union-find: cluster any pair of spellings whose similarity clears the threshold.
      const parent = {};
      distinctNames.forEach((n) => { parent[n] = n; });
      const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
      const union = (x, y) => {
        const rx = find(x), ry = find(y);
        if (rx !== ry) parent[rx] = ry;
      };

      for (let i = 0; i < distinctNames.length; i++) {
        for (let j = i + 1; j < distinctNames.length; j++) {
          if (boatNameSimilarity(distinctNames[i], distinctNames[j]) >= BOAT_NAME_SIMILARITY_THRESHOLD) {
            union(distinctNames[i], distinctNames[j]);
          }
        }
      }

      const groups = {};
      distinctNames.forEach((n) => {
        const root = find(n);
        if (!groups[root]) groups[root] = [];
        groups[root].push(n);
      });

      const clusters = Object.values(groups)
        .filter((names) => names.length > 1)
        .map((names) => {
          const spellings = names
            .map((name) => ({
              name,
              count: bySpelling[name].length,
              anglerIds: bySpelling[name].map((a) => a.anglerId),
            }))
            .sort((a, b) => b.count - a.count);
          return {
            suggestedName: spellings[0].name, // most common spelling in the cluster
            spellings,
            totalAnglers: spellings.reduce((sum, s) => sum + s.count, 0),
          };
        })
        .sort((a, b) => b.totalAnglers - a.totalAnglers);

      res.status(200).json(clusters);
    } catch (e) {
      console.error('Error scanning for fuzzy boat name matches:', e);
      res.status(500).json({ error: e.message });
    }
  };

  const adminMergeBoatNames = async (req, res) => {
    try {
      const { year } = req.params;
      const db = getFirestore();
      const { canonicalName, oldNames, editedBy } = req.body;

      if (!canonicalName || !Array.isArray(oldNames) || oldNames.length === 0) {
        return res.status(400).json({ error: 'canonicalName and oldNames are required.' });
      }

      const namesToMerge = oldNames.filter((n) => n !== canonicalName);
      if (namesToMerge.length === 0) {
        return res.status(200).json({ message: 'Nothing to merge.', updatedCount: 0 });
      }

      const anglersSnapshot = await db.collection(`anglers${year}`).get();
      const affectedAnglerDocs = anglersSnapshot.docs.filter((doc) =>
        namesToMerge.includes(doc.data().boatName)
      );

      const writes = [];
      affectedAnglerDocs.forEach((doc) => {
        const angler = doc.data();
        writes.push(doc.ref.update({ boatName: canonicalName }));
        // Audit trail -- same collection/shape as angler-edit changes, so a boat-name merge
        // shows up in the Change Log alongside any other edit to that angler's record.
        writes.push(
          db.collection(`anglerChangeLog${year}`).add({
            anglerId: doc.id,
            timestamp: new Date().toISOString(),
            editedBy: editedBy || 'Unknown',
            anglerNameBefore: angler.anglerName || 'Unknown',
            anglerNameAfter: angler.anglerName || 'Unknown',
            changes: { boatName: { from: angler.boatName, to: canonicalName } },
          })
        );
      });

      // Cascade to pot entries, which are keyed by boat name rather than angler ID.
      const potsRef = db.collection(`pots${year}`);
      for (const oldName of namesToMerge) {
        const potSnapshot = await potsRef.where('name', '==', oldName).get();
        potSnapshot.docs.forEach((doc) => {
          writes.push(doc.ref.update({ name: canonicalName }));
        });
      }

      await Promise.all(writes);

      res.status(200).json({ message: 'Merged.', updatedCount: affectedAnglerDocs.length });
    } catch (e) {
      console.error('Error merging boat names:', e);
      res.status(500).json({ error: e.message });
    }
  };

  const adminGetRegisteredAnglerDataForReport = async (req, res) => {
    console.log('In api/admin_get_registered_team_data_for_report...');
  
    try {
      const year = req.params.year;
      const db = getFirestore();
      const teamCollection = db.collection(`anglers${year}`);  // Assuming the team year is passed in the request body
      const snapshot = await teamCollection.get();
      
      const teams = {};
      snapshot.forEach(doc => {
        teams[doc.id] = doc.data();  // Collect all team data
      });
  
      res.json(teams);  // Return the team data as JSON
    } catch (error) {
      console.error("Error fetching registered teams:", error);
      res.status(500).json({ error: "Failed to fetch registered team data" });
    }
  };

  // Sponsors
  const adminEditSponsor = async (req, res) => {
    console.log('In api/admin_edit_sponsor...');
    try {
      const { year } = req.params;
  
      const db = getFirestore();
      const bucket = getStorage().bucket();
      let { sponsorId, logoUrl: newLogoUrl } = req.body; // Get existing logoUrl from body if provided
  
      // Handle cases where sponsorId is an array
      if (Array.isArray(sponsorId)) {
        sponsorId = sponsorId[0]; // Use the first value
      }
  
      // Validate sponsorId
      if (!sponsorId || typeof sponsorId !== 'string') {
        console.log('Invalid or missing sponsorId:', sponsorId);
        return res.status(400).json({ error: 'Invalid or missing sponsorId.' });
      }
  
      // Fetch sponsor document
      const sponsorDocRef = db.collection(`sponsors${year}`).doc(sponsorId);
      const sponsorDoc = await sponsorDocRef.get();
  
      if (!sponsorDoc.exists) {
        console.log('Sponsor not found.');
        return res.status(404).json({ error: 'Sponsor not found.' });
      }
  
      const sponsorData = sponsorDoc.data();
  
      // Extract updated fields from the request body
      const updatedFields = { ...req.body };
      delete updatedFields.sponsorId;
  
      // Handle logo file upload, if provided
      if (req.files?.logo && req.files.logo.length > 0) {
        const logoFile = req.files.logo[0];
        const filename = `${uuidv4()}-${logoFile.originalname.replace(/\s+/g, '-')}`;
        const fileUpload = bucket.file(filename);
  
        // Delete the old logo from Firebase Storage if it exists
        if (sponsorData.logoUrl) {
          try {
            const oldFilePath = decodeURIComponent(
              sponsorData.logoUrl.split('/').slice(4).join('/') // Extract file path from the URL
            );
            await bucket.file(oldFilePath).delete();
            console.log(`Deleted old logo: ${oldFilePath}`);
          } catch (error) {
            console.error(`Error deleting old logo: ${sponsorData.logoUrl}`, error);
          }
        }
  
        // Upload the new logo to Firebase Storage
        await fileUpload.save(logoFile.buffer, {
          metadata: { contentType: logoFile.mimetype },
        });
  
        // Generate the public URL for the uploaded file
        const logoUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
        updatedFields.logoUrl = logoUrl;
  
        console.log(`Logo uploaded successfully: ${logoUrl}`);
      } else {
        console.log('No new logo file provided.');
        if (!newLogoUrl && sponsorData.logoUrl) {
          try {
            // If no new logo is provided and the current logoUrl exists, delete it
            const oldFilePath = decodeURIComponent(
              sponsorData.logoUrl.split('/').slice(4).join('/') // Extract file path from the URL
            );
            await bucket.file(oldFilePath).delete();
            console.log(`Deleted old logo from storage: ${oldFilePath}`);
            updatedFields.logoUrl = ''; // Clear the logoUrl field
          } catch (error) {
            console.error(`Error deleting old logo: ${sponsorData.logoUrl}`, error);
          }
        }
      }
  
      // Update the sponsor document
      await sponsorDocRef.update(updatedFields);
  
      console.log(`Sponsor ${sponsorId} updated successfully.`);
      res.status(200).json({ message: 'Sponsor updated successfully.' });
    } catch (error) {
      console.error('Error updating sponsor:', error);
      res.status(500).json({ error: error.message });
    }
  };  

  const adminDeleteSponsor = async (req, res) => {
    console.log('In api/admin_delete_sponsor...');
  
    try {
      const year = req.params.year;
      const db = getFirestore();
      const bucket = getStorage().bucket();
      const sponsorId = req.body.sponsorId;
      const tableName = req.body.tableName;
      const sponsorYear = req.body.sponsorYear;

      // Get the team document
      const sponsorDocRef = db.collection(tableName).doc(sponsorId);
      const sponsorDoc = await sponsorDocRef.get();
  
      if (!sponsorDoc.exists) {
        return res.status(404).json({ error: 'Angler not found' });
      }
  
      const sponsorData = sponsorDoc.data();
  
      // Delete all sponsor images from firebase storage
      const imageFields = Object.values(sponsorData).filter(value => typeof value === 'string' && value.startsWith('https://storage.googleapis.com/'));
      const deletePromises = imageFields.map(async (imageUrl) => {
        try {
          // Extract the file path from the URL (remove the "https://storage.googleapis.com/[bucket_name]/")
          const filePath = decodeURIComponent(imageUrl.split('/').slice(4).join('/')); // Decoding the path to handle any URL encoding
          const file = bucket.file(filePath);
          await file.delete();
          console.log(`Deleted image: ${filePath}`);
        } catch (error) {
          console.error(`Error deleting image ${imageUrl}:`, error);
        }
      });
      await Promise.all(deletePromises);    // Wait for all image deletions to complete
  
      // Delete the angler document
      await sponsorDocRef.delete();
      console.log(`Sponsor ${sponsorId} deleted successfully from ${tableName} collection`);
  
      res.sendStatus(200);
    } catch (e) {
      console.log("There was an error while deleting a sponsor...");
      console.log(e);
      res.status(500).json({ error: e.message });
    }
  }; 
  
  // Catches
  const adminAddCatch = async (req, res) => {
    console.log('In api/admin_add_catch...');
    
    try {
      const year = req.params.year;
      const db = getFirestore();
      const bucket = getStorage().bucket();
  
      // Check if catchData is a string and needs parsing
      let catchData = req.body.catchData;
      if (typeof catchData === 'string') {
        catchData = JSON.parse(catchData);
      }
  
      // Loop through each catch entry and handle both data and files
      const catchPromises = catchData.map(async (item, index) => {
        // If there's an uploaded file, handle it
        let catchPhotoUrl = null;
        
        // Loop through req.files to find the matching file based on fieldname
        const file = req.files.find(file => file.fieldname === `catchPhoto_${index}`);

        if (file) {
          const filename = `${uuidv4()}-${file.originalname}`;  // Generate unique filename
          const fileUpload = bucket.file(filename);

          // Upload the file to Firebase Storage
          await fileUpload.save(file.buffer, {
            metadata: { contentType: file.mimetype },
          });

          // Get the public URL for the uploaded image
          catchPhotoUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
        }
  
        // Save catch data to Firestore, including the catch photo URL if applicable
        const catchDocRef = await db.collection(`catches${year}`).add({
          anglerId: item.anglerId,
          anglerName: item.anglerName,
          species: item.species,
          division: item.division,
          type: item.type,
          dateTime: item.dateTime,
          length: item.length,
          girth: item.girth,
          weight: item.weight,
          points: item.points,
          catchPhoto: catchPhotoUrl,  // Save the image URL here
        });
  
        // Update the document with its unique ID
        await catchDocRef.update({ catchId: catchDocRef.id });
      });
  
      // Wait for all catch documents to be saved
      await Promise.all(catchPromises);
  
      res.sendStatus(200);
    } catch (e) {
      console.error('Error in adminAddCatch:', e);
      res.status(500).json({ error: e.message });
    }
  };
  
  const adminEditCatch = async (req, res) => {
    console.log('In api/admin_edit_catch...');
  
    try {
      const year = req.params.year;
      const db = getFirestore();
      const bucket = getStorage().bucket();
  
      // Get the current catch document
      const catchDocRef = db.collection(`catches${year}`).doc(req.body.catchId);
      const catchDoc = await catchDocRef.get();
  
      if (!catchDoc.exists) {
        return res.status(404).json({ error: 'Catch not found' });
      }
  
      const catchData = catchDoc.data();
      let catchPhotoUrl = catchData.catchPhoto; // Keep the current photo URL
  
      // Handle image replacement if a new file is provided
      if (req.files && req.files.length > 0) {
        // Get the file from the request (assuming one image per catch)
        const file = req.files[0];
  
        if (file) {
          console.log('Replacing existing catch photo with new file:', file.originalname);
  
          // Delete the old image from Firebase Storage
          if (catchPhotoUrl) {
            try {
              const filePath = decodeURIComponent(catchPhotoUrl.split('/').slice(4).join('/'));
              await bucket.file(filePath).delete();
              console.log(`Deleted old catch photo: ${filePath}`);
            } catch (error) {
              console.error(`Error deleting old catch photo: ${catchPhotoUrl}`, error);
            }
          }
  
          // Upload the new image to Firebase Storage
          const filename = `${uuidv4()}-${file.originalname}`;
          const fileUpload = bucket.file(filename);
          await fileUpload.save(file.buffer, {
            metadata: { contentType: file.mimetype },
          });
  
          // Update the `catchPhotoUrl` with the new file's public URL
          catchPhotoUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
          console.log(`Uploaded new catch photo: ${catchPhotoUrl}`);
        }
      }
  
      // Update the catch document in Firestore with the new data and image URL
      await catchDocRef.update({
        dateTime: req.body.dateTime,
        length: req.body.length,
        girth: req.body.girth,
        weight: req.body.weight,
        points: req.body.points,
        catchPhoto: catchPhotoUrl,  // Update the catchPhoto URL
      });
  
      console.log('Catch ' + req.body.catchId + ' was successfully updated with new data!');
      res.sendStatus(200);
    } catch (e) {
      console.log("There was an error in edit_catch...");
      console.log(e);
      res.status(500).json({ error: e.message });
    }
  };
  
  const adminDeleteCatch = async (req, res) => {
    console.log('In api/admin_delete_catch...');
  
    try {
      const year = req.params.year;
      const db = getFirestore();
      const bucket = getStorage().bucket();
      const catchId = req.body.catchId;
      const catchYear = req.body.catchYear;
  
      // Get the team document
      const catchDocRef = db.collection(`catches${year}`).doc(catchId);
      const catchDoc = await catchDocRef.get();

      if (!catchDoc.exists) {
        return res.status(404).json({ error: 'Team not found' });
      }
  
      const catchData = catchDoc.data();
  
      // Find all image URLs in the team data
      const imageFields = Object.values(catchData).filter(value => typeof value === 'string' && value.startsWith('https://storage.googleapis.com/'));
  
      // Delete each image from Firebase Storage
      const deletePromises = imageFields.map(async (imageUrl) => {
        try {
          // Extract the file path from the URL (remove the "https://storage.googleapis.com/[bucket_name]/")
          const filePath = decodeURIComponent(imageUrl.split('/').slice(4).join('/')); // Decoding the path to handle any URL encoding
          const file = bucket.file(filePath);
          await file.delete();
          console.log(`Deleted image: ${filePath}`);
        } catch (error) {
          console.error(`Error deleting image ${imageUrl}:`, error);
        }
      });
  
      // Wait for all image deletions to complete
      await Promise.all(deletePromises);
  
      // Now delete the catch from the database
      await catchDocRef.delete();
  
      console.log('Catch ' + req.body.catchId + ' was successfully deleted!');
      res.sendStatus(200);
    } catch (e) {
      console.log("There was an error in delete_catch...");
      console.log(e);
      res.status(500).json({ error: e.message });
    }
  };

  const adminGetTotalCatchCount = async (req, res) => {
    console.log('In api/admin_get_total_catch_count...');
    
    try {
      const year = req.params.year;
      const db = getFirestore();
      const catchYear = req.body.catchYear;
      
      // Get all documents in the collection
      const snapshot = await db.collection(`catches${year}`).get();
      
      const totalFishCount = snapshot.size;  // Total number of documents
      res.status(200).json({ totalFishCount });
      
    } catch (error) {
      console.error("Error getting total fish count:", error);
      res.status(500).json({ error: "Failed to get total fish count" });
    }
  };

  const adminGetTotalCatchCountByDivision = async (req, res) => {
    console.log('In api/admin_get_total_catch_count_by_division...');
    
    try {
      const year = req.params.year;
      const db = getFirestore();
      const catchYear = req.body.catchYear;
      const division = req.body.division;  // Pass the species type
  
      // Query to get documents where the division matches
      const snapshot = await db.collection(`catches${year}`).where("division", "==", division).get();
      
      const divisionCount = snapshot.size;  // Number of matching documents
      res.status(200).json({ divisionCount });
      
    } catch (error) {
      console.error("Error getting fish count by division:", error);
      res.status(500).json({ error: "Failed to get fish count by division" });
    }
  };

  // Announcements
  const adminAddAnnouncement = async (req, res) => {
    try {
      const year = req.params.year;
      const db = getFirestore();
      const { newAnnouncement, announcementYear } = req.body;
  
      const announcementRef = await db.collection(`announcements${year}`).add(newAnnouncement);
      await announcementRef.update({ announcementId: announcementRef.id });
  
      res.status(200).json({ message: 'Announcement added successfully' });
    } catch (error) {
      console.error('Error adding announcement:', error);
      res.status(500).json({ error: 'Error adding announcement' });
    }
  };
  
  const adminEditAnnouncement = async (req, res) => {
    try {
      const year = req.params.year;
      const db = getFirestore();
      const { updatedAnnouncement, announcementYear } = req.body;
      const { announcementId } = updatedAnnouncement;
  
      if (!announcementId) {
        return res.status(400).json({ error: 'Announcement ID is missing' });
      }
  
      const announcementRef = db.collection(`announcements${year}`).doc(announcementId);
      await announcementRef.update(updatedAnnouncement);
  
      res.status(200).json({ message: 'Announcement updated successfully' });
    } catch (error) {
      console.error('Error updating announcement:', error);
      res.status(500).json({ error: 'Error updating announcement' });
    }
  };
  
  const adminDeleteAnnouncement = async (req, res) => {
    try {
      const year = req.params.year;
      const db = getFirestore();
      const { announcementId, announcementYear } = req.body;
  
      const announcementRef = db.collection(`announcements${year}`).doc(announcementId);
      await announcementRef.delete();
  
      res.status(200).json({ message: 'Announcement deleted successfully' });
    } catch (error) {
      console.error('Error deleting announcement:', error);
      res.status(500).json({ error: 'Error deleting announcement' });
    }
  };  

  // Pots
  const adminAddPot = async (req, res) => {
    try {
      const year = req.params.year;
      const db = getFirestore();
      const { potYear, name, boardType, boardSelections } = req.body;

      // Validate required fields
      if (!potYear || !name || !boardType || !boardSelections) {
        return res.status(400).json({ error: 'Missing required fields.' });
      }

      // Initialize board fees with zero values using exact property names
      const boardFees = {
        totalBillfishPotsFee: 0,
        totalOffshoreFishPotsFee: 0,
        totalBaySurfFishPotsFee: 0,
        totalNewlyAddedPotsFee: 0,
      };

      // Calculate total fees and set individual board fees
      let totalPotFee = 0;
      boardSelections.forEach(selection => {
        const boardKey = (selection.board || '').replace(/[^a-zA-Z0-9]/g, '');
        const boardFeeKey = `total${boardKey}Fee`;
        boardFees[boardFeeKey] = selection.totalFee;
        totalPotFee += selection.totalFee;
      });

      // Create unique potId
      const potId = `pot_${year}_${Date.now()}`;

      // Prepare pot data matching table properties
      const potData = {
        potId,          // unique identifier
        name,           // boat name or angler name
        board: boardType,
        ...boardFees,   // individual board fees (with zeros for unused boards)
        totalPotFee,    // total of all board fees
        boardSelections: JSON.stringify(boardSelections), // store full selection data
        timestamp: new Date().toISOString(),
      };

      // Add pot data to Firestore
      const potDocRef = await db.collection(`pots${year}`).doc(potId);
      await potDocRef.set(potData);

      res.status(200).json({ message: 'Pot entry added successfully' });
    } catch (error) {
      console.error('Error adding pot entry:', error);
      res.status(500).json({ error: 'Failed to add pot entry.' });
    }
  };

  const adminAddPotCheckForDuplicateEntries = async (req, res) => {
    console.log('In admin_add_pot_check_for_duplicate_entries...')
    const { potYear, participantId, boardType } = req.body;
    try {
      const year = req.params.year;
      const db = getFirestore();
  
      const snapshot = await db.collection(`pots${year}`)
        .where('name', '==', participantId)
        .get();

  
      const exists = snapshot.docs.some(doc => {
        const data = doc.data();
        console.log('req.body', req.body)
        console.log('data returned', data)
        if (!boardType) return false;
        const boardKey = boardType.replace(/[^a-zA-Z0-9]/g, '');
        return data[`total${boardKey}Fee`] > 0;
      });
  
      return res.status(200).json({ exists });
    } catch (error) {
      console.error('Error checking for duplicate entry:', error);
      return res.status(500).json({ error: 'Failed to check for duplicate entry' });
    }
  };
  
  const adminEditPot = async (req, res) => {
    try {
      const year = req.params.year;
      const db = getFirestore();
      const { potId, name, potYear, boardSelections } = req.body;
  
      if (!potId) {
        return res.status(400).json({ error: 'Missing pot ID.' });
      }
  
      // Initialize board fees with zero values
      const boardFees = {
        totalBillfishPotsFee: 0,
        totalOffshoreFishPotsFee: 0,
        totalBaySurfFishPotsFee: 0,
        totalNewlyAddedPotsFee: 0,
      };

      // Parse boardSelections if it's a string
      const parsedBoardSelections = typeof boardSelections === 'string'
        ? JSON.parse(boardSelections)
        : boardSelections;

      // Calculate total fees and set individual board fees
      let totalPotFee = 0;
      parsedBoardSelections.forEach(selection => {
        const boardKey = (selection.board || '').replace(/[^a-zA-Z0-9]/g, '');
        const boardFeeKey = `total${boardKey}Fee`;
        boardFees[boardFeeKey] = selection.totalFee;
        totalPotFee += selection.totalFee;
      });
  
      // Update the document
      const updateData = {
        name,
        ...boardFees,
        totalPotFee,
        boardSelections: JSON.stringify(parsedBoardSelections),
        timestamp: new Date().toISOString(),
      };
  
      await db.collection(`pots${year}`).doc(potId).update(updateData);
  
      res.status(200).json({ message: 'Pot entry updated successfully' });
    } catch (error) {
      console.error('Error updating pot entry:', error);
      res.status(500).json({ error: error.message });
    }
  };
  
  const adminDeletePot = async (req, res) => {
    try {
      const year = req.params.year;
      const db = getFirestore();
      const { potId, potYear } = req.body;
  
      // Remove the document
      await db.collection(`pots${year}`).doc(potId).delete();
  
      res.status(200).json({ message: 'Pot entry deleted successfully' });
    } catch (error) {
      console.error('Error deleting pot entry:', error);
      res.status(500).json({ error: 'Failed to delete pot entry.' });
    }
  }; 

  return {
    adminGetDatabaseList,
    adminGetAnglerList,
    adminGetOldTeamNameList,
    adminEditAngler,
    adminDeleteAngler,
    adminGetFuzzyBoatNameClusters,
    adminMergeBoatNames,
    adminEditSponsor,
    adminDeleteSponsor,
    adminAddCatch,
    adminEditCatch,
    adminDeleteCatch,
    adminAddAnnouncement,
    adminEditAnnouncement,
    adminDeleteAnnouncement,
    adminAddPot,
    adminAddPotCheckForDuplicateEntries,
    adminEditPot,
    adminDeletePot,
    adminGetTotalCatchCount,
    adminGetTotalCatchCountByDivision,
    adminGetRegisteredAnglerDataForReport,
    upload
  };

};


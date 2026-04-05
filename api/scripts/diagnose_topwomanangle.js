/**
 * Diagnostic: Top Woman Angler 2025
 * Run: source ~/.nvm/nvm.sh && nvm use 21.6.0 && node scripts/diagnose_topwomanangle.js
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_TYPE_STAGING,
    project_id: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_PROJECT_ID_STAGING,
    private_key_id: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID_STAGING,
    private_key: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_STAGING.replace(/\\n/g, '\n'),
    client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL_STAGING,
    client_id: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_CLIENT_ID_STAGING,
    auth_uri: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_AUTH_URI_STAGING,
    token_uri: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_TOKEN_URI_STAGING,
    auth_provider_x509_cert_url: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL_STAGING,
    client_x509_cert_url: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL_STAGING,
    universe_domain: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_UNIVERSE_DOMAIN_STAGING,
  }),
});

const db = admin.firestore();

const BILLFISH = ['Blue Marlin', 'White Marlin', 'Sailfish', 'Tarpon'];
const MEATFISH = [
  'Barracuda', 'Blackfin Tuna', 'Bonito (Little Tunny)', 'Dolphin (Dorado Mahi)',
  'Jack Crevalle (Jackfish)', 'King Mackerel (Kingfish)', 'Ling (Cobia)',
  'Blacktip/Spinner Shark', 'Wahoo', 'Spanish Mackerel', 'Yellowfin Tuna', 'Red Snapper',
  'Black Drum', 'Flounder', 'Gafftop', 'Pompano', 'Redfish', 'Speckled Trout',
];
const RECORD = {
  'Blue Marlin': 592, 'Sailfish': 95, 'Tarpon': 88, 'White Marlin': 85.3,
  'Barracuda': 41.3, 'Blackfin Tuna': 39.5, 'Bonito (Little Tunny)': 16,
  'Dolphin (Dorado Mahi)': 65.6, 'Jack Crevalle (Jackfish)': 36, 'King Mackerel (Kingfish)': 56.8,
  'Ling (Cobia)': 80.1, 'Blacktip/Spinner Shark': 667.4, 'Wahoo': 92,
  'Spanish Mackerel': 7, 'Yellowfin Tuna': 137.6, 'Red Snapper': 25.9,
  'Black Drum': 11.6, 'Flounder': 5.4, 'Gafftop': 5.9, 'Pompano': 4.1,
  'Redfish': 14.4, 'Speckled Trout': 8.3,
};

async function runForFilter(anglers, label) {
  const validIds = new Set(Object.keys(anglers).filter(id => anglers[id].gender === 'Female'));

  const anglerScores = {};

  const processSpecies = async (species, division) => {
    const snap = await db.collection('catches2025')
      .where('species', '==', species)
      .where('division', '==', division)
      .get();
    const catches = snap.docs
      .map(doc => ({ anglerId: doc.data().anglerId, weight: parseFloat(doc.data().weight || 0) }))
      .filter(c => validIds.has(c.anglerId) && c.weight > 0)
      .sort((a, b) => b.weight - a.weight);

    if (catches.length === 0) return;
    const top2 = catches.slice(0, 2);
    top2.forEach((c, i) => {
      if (!anglerScores[c.anglerId]) anglerScores[c.anglerId] = { points: 0, weights: [] };
      anglerScores[c.anglerId].points += i === 0 ? 2 : 1;
      anglerScores[c.anglerId].weights.push({ weight: c.weight, record: RECORD[species] || 1 });
      const name = anglers[c.anglerId] ? anglers[c.anglerId].anglerName : c.anglerId;
      const age = anglers[c.anglerId] ? anglers[c.anglerId].ageBracket : '?';
      const div = anglers[c.anglerId] ? anglers[c.anglerId].division : '?';
      console.log('  ' + (i === 0 ? '1st' : '2nd') + ' ' + species + ' (' + division + '): ' + name + ' (' + age + '/' + div + ') ' + c.weight + ' lbs → ' + (i === 0 ? 2 : 1) + ' pts');
    });
  };

  for (const s of BILLFISH) await processSpecies(s, 'Offshore');
  for (const s of MEATFISH) {
    const div = ['Black Drum','Flounder','Gafftop','Pompano','Redfish','Speckled Trout'].includes(s) ? 'Bay/Surf' : 'Offshore';
    await processSpecies(s, div);
  }

  const ranked = Object.entries(anglerScores).map(([anglerId, stats]) => {
    const tw = stats.weights.reduce((s, w) => s + w.weight, 0);
    const tr = stats.weights.reduce((s, w) => s + w.record, 0);
    return { anglerId, points: stats.points, avgPct: tr > 0 ? (tw / tr * 100).toFixed(2) : '0.00' };
  }).sort((a, b) => b.points - a.points || b.avgPct - a.avgPct);

  console.log('\n=== ' + label + ' FINAL RANKING ===');
  ranked.forEach((r, i) => {
    const a = anglers[r.anglerId];
    const name = a ? a.anglerName : r.anglerId;
    const age = a ? a.ageBracket : '?';
    const div = a ? a.division : '?';
    console.log('  ' + (i + 1) + '. ' + name + ' (' + age + '/' + div + ') — ' + r.points + ' pts, ' + r.avgPct + '% avg');
  });
}

async function main() {
  const anglersSnap = await db.collection('anglers2025').get();
  const anglers = {};
  anglersSnap.forEach(doc => { anglers[doc.id] = doc.data(); });

  // Count female anglers by bracket
  const females = Object.values(anglers).filter(a => a.gender === 'Female');
  console.log('\nAll female anglers (' + females.length + ' total):');
  females.forEach(a => console.log('  ' + a.anglerName + ' — ' + a.ageBracket + ' / ' + a.division));

  // Run with all females (current behaviour)
  await runForFilter(anglers, 'CURRENT (all females, any age)');

  // Run with Adult females only
  const adultAnglers = {};
  Object.keys(anglers).forEach(id => {
    if (anglers[id].ageBracket === 'Adult') adultAnglers[id] = anglers[id];
  });
  await runForFilter(adultAnglers, 'ADULT-ONLY females');

  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });

/**
 * migrate-to-new-projects.js
 *
 * Migrates all Firestore tournament data from the old Firebase projects
 * (deepsea-roundup-v3-staging / deepsea-roundup-v3-prod) to the new projects
 * (deepsea-roundup--ai-dev / deepsea-roundup-ai-prod).
 *
 * Usage:
 *   # Dry run (no writes)
 *   node scripts/migrate-to-new-projects.js --dry-run
 *
 *   # Live migration
 *   node scripts/migrate-to-new-projects.js
 *
 * Prerequisites:
 *   1. Place service account JSON key files in scripts/keys/:
 *      - scripts/keys/old-staging.json     (deepsea-roundup-v3-staging)
 *      - scripts/keys/new-staging.json     (deepsea-roundup--ai-dev)
 *      - scripts/keys/old-production.json  (deepsea-roundup-v3-prod)
 *      - scripts/keys/new-production.json  (deepsea-roundup-ai-prod)
 *   2. Run: npm install firebase-admin (in root or scripts/)
 *
 * The script migrates all collections for all years found in the source projects.
 * Collections migrated: anglers*, catches*, pots*, sponsors*, announcements*, auction*
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const DRY_RUN = process.argv.includes('--dry-run');
const KEYS_DIR = path.join(__dirname, 'keys');

// Collections to migrate (wildcard prefix matching)
const COLLECTION_PREFIXES = ['anglers', 'catches', 'pots', 'sponsors', 'announcements', 'auction'];

// Migration pairs: { sourceName, sourceKey, destName, destKey }
const MIGRATION_PAIRS = [
  {
    sourceName: 'deepsea-roundup-v3-staging',
    sourceKey: path.join(KEYS_DIR, 'old-staging.json'),
    destName: 'deepsea-roundup-ai-dev',
    destKey: path.join(KEYS_DIR, 'new-staging.json'),
  },
  {
    sourceName: 'deepsea-roundup-v3-prod',
    sourceKey: path.join(KEYS_DIR, 'old-production.json'),
    destName: 'deepsea-roundup-ai-prod',
    destKey: path.join(KEYS_DIR, 'new-production.json'),
  },
];

function initApp(name, keyPath) {
  if (!fs.existsSync(keyPath)) {
    throw new Error(`Service account key not found: ${keyPath}`);
  }
  const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  return admin.initializeApp(
    { credential: admin.credential.cert(serviceAccount) },
    name
  );
}

async function getCollections(db) {
  const collections = await db.listCollections();
  return collections
    .map(col => col.id)
    .filter(id => COLLECTION_PREFIXES.some(prefix => id.startsWith(prefix)));
}

async function migrateCollection(sourceDb, destDb, collectionId) {
  const sourceColl = sourceDb.collection(collectionId);
  const snapshot = await sourceColl.get();

  if (snapshot.empty) {
    console.log(`  [SKIP] ${collectionId} — empty`);
    return;
  }

  console.log(`  [MIGRATE] ${collectionId} — ${snapshot.size} documents`);

  if (DRY_RUN) {
    console.log(`    (dry run) Would write ${snapshot.size} docs to ${collectionId}`);
    return;
  }

  const destColl = destDb.collection(collectionId);
  const BATCH_SIZE = 400; // Firestore batch limit is 500
  let batch = destDb.batch();
  let count = 0;

  for (const doc of snapshot.docs) {
    batch.set(destColl.doc(doc.id), doc.data());
    count++;
    if (count % BATCH_SIZE === 0) {
      await batch.commit();
      console.log(`    Committed ${count}/${snapshot.size}...`);
      batch = destDb.batch();
    }
  }

  if (count % BATCH_SIZE !== 0) {
    await batch.commit();
  }
  console.log(`    Done — ${count} docs written to ${collectionId}`);
}

async function migratePair(pair) {
  console.log(`\n=== Migrating: ${pair.sourceName} → ${pair.destName} ===`);

  const sourceApp = initApp(`source-${pair.sourceName}`, pair.sourceKey);
  const destApp = initApp(`dest-${pair.destName}`, pair.destKey);

  const sourceDb = admin.app(`source-${pair.sourceName}`).firestore();
  const destDb = admin.app(`dest-${pair.destName}`).firestore();

  const collections = await getCollections(sourceDb);
  console.log(`Collections to migrate: ${collections.join(', ')}`);

  for (const collectionId of collections) {
    await migrateCollection(sourceDb, destDb, collectionId);
  }

  await sourceApp.delete();
  await destApp.delete();
  console.log(`=== Complete: ${pair.sourceName} → ${pair.destName} ===`);
}

async function main() {
  if (DRY_RUN) {
    console.log('*** DRY RUN — no data will be written ***\n');
  }

  for (const pair of MIGRATION_PAIRS) {
    try {
      await migratePair(pair);
    } catch (err) {
      console.error(`Error migrating ${pair.sourceName} → ${pair.destName}:`, err.message);
      process.exit(1);
    }
  }

  console.log('\nMigration complete.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

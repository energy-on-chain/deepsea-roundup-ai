/**
 * sync-staging-from-prod.js
 *
 * Re-syncs the staging Firestore project (deepsea-roundup-ai-dev) with the
 * production project (deepsea-roundup-ai-prod), so staging reflects real,
 * current tournament data instead of stale test fixtures.
 *
 * Direction is one-way and hardcoded: production -> staging. Production is
 * only ever read from; every write in this script targets staging, gated by
 * an explicit project_id check before any write occurs.
 *
 * For each matched collection, staging's existing documents are backed up
 * to a local timestamped JSON file, then deleted, then replaced with a copy
 * of production's current documents -- a full mirror, not a merge.
 *
 * Usage:
 *   # Dry run (no writes, no deletes -- just reports what would happen)
 *   node scripts/sync-staging-from-prod.js --dry-run
 *
 *   # Live sync
 *   node scripts/sync-staging-from-prod.js
 *
 * Prerequisites:
 *   - scripts/keys/new-production.json (deepsea-roundup-ai-prod, read-only)
 *   - scripts/keys/new-staging.json    (deepsea-roundup-ai-dev, write target)
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const DRY_RUN = process.argv.includes('--dry-run');
const KEYS_DIR = path.join(__dirname, 'keys');
const BACKUP_DIR = path.join(__dirname, 'backups', `staging-presync-${Date.now()}`);

const PROD_KEY = path.join(KEYS_DIR, 'new-production.json');
const STAGING_KEY = path.join(KEYS_DIR, 'new-staging.json');

const EXPECTED_PROD_PROJECT_ID = 'deepsea-roundup-ai-prod';
const EXPECTED_STAGING_PROJECT_ID = 'deepsea-roundup-ai-dev';

// Collections to sync (wildcard prefix matching), same set migrate-to-new-projects.js uses
const COLLECTION_PREFIXES = ['anglers', 'catches', 'pots', 'sponsors', 'announcements', 'auction'];

const BATCH_SIZE = 400; // Firestore batch limit is 500

function loadServiceAccount(keyPath) {
  if (!fs.existsSync(keyPath)) {
    throw new Error(`Service account key not found: ${keyPath}`);
  }
  return JSON.parse(fs.readFileSync(keyPath, 'utf8'));
}

async function getCollections(db) {
  const collections = await db.listCollections();
  return collections
    .map((col) => col.id)
    .filter((id) => COLLECTION_PREFIXES.some((prefix) => id.startsWith(prefix)));
}

async function backupCollection(destDb, collectionId) {
  const snapshot = await destDb.collection(collectionId).get();
  if (snapshot.empty) {
    console.log(`    [BACKUP] ${collectionId} — empty, nothing to back up`);
    return;
  }
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const data = {};
  snapshot.docs.forEach((doc) => {
    data[doc.id] = doc.data();
  });
  const backupPath = path.join(BACKUP_DIR, `${collectionId}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
  console.log(`    [BACKUP] ${collectionId} — ${snapshot.size} docs -> ${backupPath}`);
}

async function deleteAllDocs(destDb, collectionId) {
  const snapshot = await destDb.collection(collectionId).get();
  if (snapshot.empty) return;

  let batch = destDb.batch();
  let count = 0;
  for (const doc of snapshot.docs) {
    batch.delete(doc.ref);
    count++;
    if (count % BATCH_SIZE === 0) {
      await batch.commit();
      batch = destDb.batch();
    }
  }
  if (count % BATCH_SIZE !== 0) {
    await batch.commit();
  }
  console.log(`    [CLEAR] ${collectionId} — deleted ${count} existing staging docs`);
}

async function copyCollection(sourceDb, destDb, collectionId) {
  const snapshot = await sourceDb.collection(collectionId).get();

  if (snapshot.empty) {
    console.log(`  [SKIP] ${collectionId} — empty in production`);
    return;
  }

  console.log(`  [SYNC] ${collectionId} — ${snapshot.size} documents in production`);

  if (DRY_RUN) {
    console.log(`    (dry run) Would back up, clear, and replace ${snapshot.size} docs in staging`);
    return;
  }

  await backupCollection(destDb, collectionId);
  await deleteAllDocs(destDb, collectionId);

  const destColl = destDb.collection(collectionId);
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
  console.log(`    Done — ${count} docs written to staging ${collectionId}`);
}

async function main() {
  if (DRY_RUN) {
    console.log('*** DRY RUN — no data will be written or deleted ***\n');
  }

  const prodServiceAccount = loadServiceAccount(PROD_KEY);
  const stagingServiceAccount = loadServiceAccount(STAGING_KEY);

  // Hard gate: refuse to run at all if the key files don't point at the projects we expect.
  // This direction is production (read-only) -> staging (write target), never the reverse.
  if (prodServiceAccount.project_id !== EXPECTED_PROD_PROJECT_ID) {
    throw new Error(
      `Refusing to run: new-production.json project_id is "${prodServiceAccount.project_id}", expected "${EXPECTED_PROD_PROJECT_ID}"`
    );
  }
  if (stagingServiceAccount.project_id !== EXPECTED_STAGING_PROJECT_ID) {
    throw new Error(
      `Refusing to run: new-staging.json project_id is "${stagingServiceAccount.project_id}", expected "${EXPECTED_STAGING_PROJECT_ID}"`
    );
  }

  const prodApp = admin.initializeApp({ credential: admin.credential.cert(prodServiceAccount) }, 'prod-readonly');
  const stagingApp = admin.initializeApp({ credential: admin.credential.cert(stagingServiceAccount) }, 'staging-target');

  const prodDb = prodApp.firestore();
  const stagingDb = stagingApp.firestore();

  console.log(`Source (read-only): ${EXPECTED_PROD_PROJECT_ID}`);
  console.log(`Target: ${EXPECTED_STAGING_PROJECT_ID}\n`);

  const collections = await getCollections(prodDb);
  console.log(`Collections to sync: ${collections.join(', ')}\n`);

  for (const collectionId of collections) {
    await copyCollection(prodDb, stagingDb, collectionId);
  }

  await prodApp.delete();
  await stagingApp.delete();

  if (!DRY_RUN) {
    console.log(`\nPre-sync staging backup saved to: ${BACKUP_DIR}`);
  }
  console.log('\nSync complete.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

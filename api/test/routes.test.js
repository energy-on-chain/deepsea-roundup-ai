// Checks that admin-only routes refuse unsigned requests and that public routes
// refuse collection names they shouldn't read. No Firestore access is needed: every
// request here is rejected before a controller runs.
const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const express = require('express');
const admin = require('firebase-admin');

admin.initializeApp({ projectId: 'test-project' });

const { checkCollectionParams } = require('../middleware/collections');
const adminRoutes = require('../routes/adminRoutes');
const settingsRoutes = require('../routes/settingsRoutes');
const registrationRoutes = require('../routes/registrationRoutes');

const app = express();
app.use(express.json());
app.use('/api', checkCollectionParams);
app.use('/', adminRoutes);
app.use('/', settingsRoutes);
app.use('/', registrationRoutes({ stripe: {}, webhookSecret: 'whsec_test' }));
app.post('/api/:year/public_probe', (req, res) => res.json({ ok: true }));

let server;
let base;
test.before(() => new Promise((resolve) => {
  server = http.createServer(app).listen(0, () => {
    base = `http://127.0.0.1:${server.address().port}`;
    resolve();
  });
}));
test.after(() => server.close());

const post = (path, body = {}, headers = {}) => fetch(`${base}${path}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', ...headers },
  body: JSON.stringify(body),
});

const ADMIN_ONLY = [
  '/api/2026/registration_by_admin',
  '/api/2026/set_species_records',
  '/api/2026/admin_get_angler_list',
  '/api/2026/admin_get_registered_team_data_for_report',
  '/api/2026/admin_get_fuzzy_boat_name_clusters',
  '/api/2026/admin_merge_boat_names',
  '/api/2026/admin_edit_angler',
  '/api/2026/admin_delete_angler',
  '/api/2026/admin_edit_sponsor',
  '/api/2026/admin_delete_sponsor',
  '/api/2026/admin_add_catch',
  '/api/2026/admin_edit_catch',
  '/api/2026/admin_delete_catch',
  '/api/2026/admin_add_announcement',
  '/api/2026/admin_edit_announcement',
  '/api/2026/admin_delete_announcement',
  '/api/2026/admin_add_pot',
  '/api/2026/admin_add_pot_check_for_duplicate_entries',
  '/api/2026/admin_edit_pot',
  '/api/2026/admin_delete_pot',
];

for (const path of ADMIN_ONLY) {
  test(`${path} requires an admin token`, async () => {
    assert.strictEqual((await post(path)).status, 401);
    assert.strictEqual((await post(path, {}, { Authorization: 'Bearer not-a-real-token' })).status, 401);
  });
}

test('signed-out reads of private collections are refused', async () => {
  for (const tableName of ['sponsors2026', 'pendingRegistrations', 'anglerChangeLog2026', 'speciesRecords']) {
    const res = await post('/api/2026/admin_get_database_list', { tableName });
    assert.strictEqual(res.status, 403, tableName);
  }
  assert.strictEqual((await post('/api/admin_get_old_team_name_list', { tableName: 'sponsors2025' })).status, 403);
});

test('public routes refuse collection names of the wrong kind', async () => {
  const bad = [
    { catchYear: 'anglers2026' },
    { catchYear: 'pendingRegistrations' },
    { anglerYear: 'sponsors2026' },
    { teamTableName: 'catches2026' },
    { potYear: 'anglers2026' },
    { catchesTableName: ['catches2026'] },
  ];
  for (const body of bad) assert.strictEqual((await post('/api/2026/public_probe', body)).status, 400, JSON.stringify(body));
  const good = { catchYear: 'catches2026', anglerYear: 'anglers2026', potYear: 'pots2026', teamTableName: 'anglers2026' };
  assert.strictEqual((await post('/api/2026/public_probe', good)).status, 200);
});

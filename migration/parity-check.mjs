#!/usr/bin/env node
/**
 * Parity check: sends the same public read requests the site makes to two hosts
 * (e.g. Heroku staging vs. the new Firebase/Cloud Run staging) and reports any
 * response that differs. Both hosts should read the same Firestore project.
 *
 *   node migration/parity-check.mjs <oldBaseUrl> <newBaseUrl> [years...]
 *   node migration/parity-check.mjs https://deepsea-roundup-v3-staging-980ad25bef47.herokuapp.com https://deepsea-roundup-ai-dev.web.app 2024 2025 2026
 *
 * The angler list is compared with contact/payment fields removed, because the new
 * server deliberately hides those from signed-out visitors.
 */
import { readFileSync, writeFileSync, mkdtempSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const [oldBase, newBase, ...yearArgs] = process.argv.slice(2);
if (!oldBase || !newBase) {
  console.error('Usage: node migration/parity-check.mjs <oldBaseUrl> <newBaseUrl> [years...]');
  process.exit(1);
}
const years = yearArgs.length ? yearArgs : ['2024', '2025', '2026'];
const here = dirname(fileURLToPath(import.meta.url));
const configRoot = join(here, '..', 'client', 'src', 'config');
const tmp = mkdtempSync(join(tmpdir(), 'parity-'));

async function loadConfig(year, name) {
  const src = join(configRoot, `config${year}`, `${name}.js`);
  if (!existsSync(src)) return null;
  const copy = join(tmp, `${year}-${name}.mjs`);
  writeFileSync(copy, readFileSync(src, 'utf8'));
  return (await import(pathToFileURL(copy).href)).default;
}

const PRIVATE_FIELD = /email|phone|cardholder|address|paymentstatus|stripe/i;
const stripPrivate = (obj) => Object.fromEntries(Object.entries(obj).map(([id, doc]) =>
  [id, Object.fromEntries(Object.entries(doc).filter(([k]) => !PRIVATE_FIELD.test(k)))]));

const canonical = (v) => {
  if (Array.isArray(v)) return v.map(canonical);
  if (v && typeof v === 'object') return Object.fromEntries(Object.keys(v).sort().map((k) => [k, canonical(v[k])]));
  return v;
};

async function call(base, path, body, method = 'POST') {
  const res = await fetch(`${base.replace(/\/$/, '')}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Origin: base.replace(/\/$/, '') },
    ...(method === 'POST' ? { body: JSON.stringify(body) } : {}),
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = text; }
  return { status: res.status, json };
}

const merge = (inputs) => (inputs || []).reduce((acc, input) => ({ ...acc, ...input }), {});

const cases = [];
for (const year of years) {
  const general = await loadConfig(year, 'generalConfig');
  if (!general) continue;
  const catches = general.CONFIG_GENERAL_FIREBASE_CATCHES_TABLE_NAME;
  const anglers = general.CONFIG_GENERAL_FIREBASE_TEAMS_TABLE_NAME;
  const pots = general.CONFIG_GENERAL_FIREBASE_POTS_TABLE_NAME;
  const announcements = general.CONFIG_GENERAL_FIREBASE_ANNOUNCEMENTS_TABLE_NAME;
  const home = await loadConfig(year, 'homeConfig');
  const potsConfig = await loadConfig(year, 'potsConfig');
  const boardNames = (potsConfig?.CONFIG_POTS_BOARD_LIST || []).map((b) => Object.keys(b)[0]);

  // Home page
  cases.push({ name: `${year} home registrant count`, path: `/api/${year}/get_registrant_count_for_homepage`, body: { teamTableName: anglers } });
  cases.push({ name: `${year} home catch count`, path: `/api/${year}/get_catch_count_for_homepage`, body: { catchesTableName: catches, speciesTypeList: home?.CONFIG_HOME_SPECIES_TYPE_LIST_FOR_CATCH_COUNT } });
  cases.push({ name: `${year} home total pot size`, path: `/api/${year}/get_total_pot_size_data`, body: { potYear: pots, boardNames } });

  // Newsfeed
  for (const ep of ['type', 'division', 'species', 'team', 'date']) {
    cases.push({ name: `${year} newsfeed ${ep} counts`, path: `/api/${year}/get_${ep}_count_data_for_newsfeed_table`, body: { catchYear: catches } });
  }
  cases.push({ name: `${year} newsfeed events`, path: `/api/${year}/get_event_data_for_newsfeed_table`, body: { catchYear: catches, teamsYear: anglers, announcementsYear: announcements } });

  // Pots page
  cases.push({ name: `${year} pots: all pot data`, path: `/api/${year}/get_all_pot_data`, body: { potYear: pots } });
  cases.push({ name: `${year} angler list (private fields removed)`, path: `/api/${year}/admin_get_database_list`, body: { tableName: anglers }, strip: true });

  // Historical records
  cases.push({ name: `${year} species records`, path: `/api/${year}/get_species_records`, method: 'GET' });

  // Admin dashboard counts (public on both)
  for (const ep of ['registration_get_number_of_registered_teams', 'registration_get_number_of_checked_in_teams', 'registration_get_total_registration_fees_collected',
    'registration_get_number_of_registered_sponsors', 'registration_get_total_sponsor_donations_collected']) {
    cases.push({ name: `${year} ${ep}`, path: `/api/${year}/${ep}`, body: {} });
  }

  // Leaderboard (as LeaderboardPage builds it)
  const lb = await loadConfig(year, 'leaderboardConfig');
  for (const item of lb?.CONFIG_LEADERBOARD_CATEGORIES || []) {
    const body = { catchYear: catches, anglerYear: anglers, numPlaces: item.numPlaces, isReport: false, ...merge(item.inputs) };
    cases.push({ name: `${year} leaderboard: ${item.title}`, path: `/api/${year}/${item.url}`, body });
  }

  // Pot winners (as the pot report builds them)
  for (const item of potsConfig?.CONFIG_POTS_CATEGORIES || []) {
    const body = {
      catchYear: catches, anglerYear: anglers, numPlaces: 10, isReport: true,
      potName: item.potName, entryAmount: item.entryAmount, tournamentCut: item.tournamentCut, payoutStructure: item.payoutStructure,
      ...merge(item.inputs),
    };
    cases.push({ name: `${year} pot winners: ${item.title}`, path: `/api/${year}/${item.url}`, body });
  }
}
rmSync(tmp, { recursive: true, force: true });

let same = 0;
const diffs = [];
for (const c of cases) {
  const [a, b] = await Promise.all([call(oldBase, c.path, c.body, c.method), call(newBase, c.path, c.body, c.method)]);
  let aj = a.json, bj = b.json;
  if (c.strip && aj && typeof aj === 'object') aj = stripPrivate(aj);
  if (c.strip && bj && typeof bj === 'object') bj = stripPrivate(bj);
  const equal = a.status === b.status && JSON.stringify(canonical(aj)) === JSON.stringify(canonical(bj));
  if (equal) same++;
  else diffs.push(`${c.name}: old ${a.status} vs new ${b.status}${a.status === b.status ? ' (bodies differ)' : ''}`);
  process.stdout.write(equal ? '.' : 'x');
}
console.log(`\n\n${same}/${cases.length} responses identical.`);
if (diffs.length) {
  console.log('Differences:');
  diffs.forEach((d) => console.log(`  - ${d}`));
  process.exitCode = 1;
}

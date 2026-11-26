#!/usr/bin/env node
/**
 * Scaffolds next year's tournament config from this year's, safely closed.
 *
 *   node scripts/new-year.mjs 2026 2027 --past-result "411 anglers / 381 catches / $66,100 total pot"
 *
 * What it does:
 *  - copies client/src/config/config<from>/ to config<to>/
 *  - renames the year in collection names, links and CONFIG_GENERAL_YEAR, and bumps the
 *    tournament number ("90th edition" -> "91st edition")
 *  - shifts every timestamp and ISO date by 52 weeks (364 days), so weekdays line up,
 *    and tags each with a "TODO(<to>): confirm" comment; fees and sponsorships are tagged too
 *  - sets CONFIG_REGISTRATION_PRICES_PENDING_CONFIRMATION: true (registration shows
 *    "Coming Soon" and the API refuses checkout) and CONFIG_HOME_DATES_CONFIRMED: false
 *    (home page shows "Dates to be announced" and hides the countdown)
 *  - adds <from> to the home page's past results (newest first)
 *  - moves <from> to the dashboard's past tournaments and adds <to> as upcoming
 *  - copies the newest dashboard logo so it can simply be replaced with new artwork
 *  - rebuilds api/generated/registration-pricing.json
 *
 * Nothing goes live until someone confirms dates and prices and flips the two flags.
 * See docs/NEW_YEAR.md for the go-live checklist.
 */
import { cpSync, existsSync, readdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const [from, to] = process.argv.slice(2, 4);
const pastIdx = process.argv.indexOf('--past-result');
const pastResult = pastIdx > -1 ? process.argv[pastIdx + 1] : 'TODO anglers / TODO catches / $TODO total pot';
if (!/^\d{4}$/.test(from || '') || !/^\d{4}$/.test(to || '') || Number(to) !== Number(from) + 1) {
  console.error('Usage: node scripts/new-year.mjs <fromYear> <toYear> [--past-result "N anglers / N catches / $N total pot"]');
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const configDir = join(root, 'client', 'src', 'config');
const src = join(configDir, `config${from}`);
const dest = join(configDir, `config${to}`);
if (!existsSync(src)) throw new Error(`Missing ${src}`);
if (existsSync(dest)) throw new Error(`${dest} already exists; delete it first if you want to regenerate.`);

const WEEKS_52 = 364 * 24 * 60 * 60 * 1000;
const TODO = `// TODO(${to}): confirm`;
const fmtCentral = (ms) => new Date(ms).toLocaleString('en-US', {
  timeZone: 'America/Chicago', weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
});
const shiftIso = (iso) => new Date(Date.parse(`${iso}T12:00:00Z`) + WEEKS_52).toISOString().slice(0, 10);
const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const general = readFileSync(join(src, 'generalConfig.js'), 'utf8');
const oldNumber = Number((general.match(/CONFIG_GENERAL_TOURNAMENT_NUMBER:\s*(\d+)/) || [])[1]);
const bumpEdition = (text) => (oldNumber ? text.split(ordinal(oldNumber)).join(ordinal(oldNumber + 1)) : text);

function transform(text, file) {
  const lines = text.split('\n').map((line) => {
    // Past results keep their own years.
    if (/^\s*"\d{4} Tournament:/.test(line)) return line;

    let out = line;
    let dated = false;
    // Epoch-millisecond timestamps (13 digits, quoted).
    out = out.replace(/"(\d{13})"/g, (m, ms) => { dated = true; return `"${Number(ms) + WEEKS_52}"`; });
    // ISO dates of the source year.
    out = out.replace(new RegExp(`"(${from}-\\d{2}-\\d{2})"`, 'g'), (m, iso) => { dated = true; return `"${shiftIso(iso)}"`; });
    // Everything else that names the year: collections, links, CONFIG_GENERAL_YEAR, text.
    out = out.split(from).join(to);
    out = bumpEdition(out);

    if (dated) {
      const ms = out.match(/"(\d{13})"/);
      const note = ms ? `${TODO} (tentative: ${fmtCentral(Number(ms[1]))} CT)` : `${TODO} (tentative)`;
      out = out.replace(/\s*\/\/.*$/, '') + `    ${note}`;
    }
    return out;
  });
  let result = lines.join('\n');

  if (file === 'generalConfig.js' && oldNumber) {
    result = result.replace(/CONFIG_GENERAL_TOURNAMENT_NUMBER:\s*\d+/, `CONFIG_GENERAL_TOURNAMENT_NUMBER: ${oldNumber + 1}`);
  }

  if (file === 'registrationConfig.js') {
    result = result.replace(/CONFIG_REGISTRATION_PRICES_PENDING_CONFIRMATION:\s*(true|false),?[^\n]*/,
      'CONFIG_REGISTRATION_PRICES_PENDING_CONFIRMATION: true,    // flip to false to open registration');
    result = result.replace(/(CONFIG_REGISTRATION_EARLYBIRD_DATE_STRING:)\s*"[^"]*",?[^\n]*/,
      `$1\n    "Pre-registration (deadline to be announced):",    ${TODO}`);
    result = result.replace(/(CONFIG_REGISTRATION_NORMAL_DATE_STRING:)\s*"[^"]*",?[^\n]*/,
      `$1\n    "Normal registration:",`);
    for (const key of ['EARLYBIRD_ADULT', 'EARLYBIRD_JUNIOR', 'NORMAL_ADULT', 'NORMAL_JUNIOR']) {
      result = result.replace(new RegExp(`(CONFIG_REGISTRATION_${key}_FEE:\\s*\\d+,)[^\\n]*`), `$1    ${TODO} price (copied from ${from})`);
    }
    // The commented autocomplete example points at last year's anglers.
    result = result.replace(`// "anglers${Number(from) - 1}"`, `// "anglers${from}"`);
    result = result.replace(/^(\s*)(CONFIG_SPONSOR_REGISTRATION_TIERS:)/m,
      `$1${TODO} sponsorship tiers, additional sponsorships and prices (copied from ${from})\n$1$2`);
  }

  if (file === 'homeConfig.js') {
    result = result.replace(/^(\s*)CONFIG_HOME_TOURNAMENT_DATE_STRING:\s*"[^"]*",[^\n]*/m,
      `$1CONFIG_HOME_TOURNAMENT_DATE_STRING: "Dates to be announced",    ${TODO} (e.g. "July 8th - 11th, ${to}")`);
    if (!/CONFIG_HOME_DATES_CONFIRMED/.test(result)) {
      result = result.replace(/^(\s*)(CONFIG_HOME_TOURNAMENT_DATE_STRING:[^\n]*\n)/m,
        `$1// false: home page shows the date string above and hides the countdown. Set true once dates are final.\n$1CONFIG_HOME_DATES_CONFIRMED: false,\n$1$2`);
    }
    // Newest result first, as on the existing home pages.
    result = result.replace(/(CONFIG_HOME_PAST_TOURNAMENT_RESULT_STRINGS:\s*\[)/,
      (m) => (result.includes(`"${from} Tournament:`) ? m : `${m}\n    "${from} Tournament: ${pastResult}",`));
  }
  return result;
}

cpSync(src, dest, { recursive: true });
for (const file of readdirSync(dest).filter((f) => f.endsWith('.js'))) {
  const p = join(dest, file);
  writeFileSync(p, transform(readFileSync(p, 'utf8'), file));
}
console.log(`Created ${dest}`);

// Dashboard: move the current upcoming card to past, add the new year as upcoming.
const dashPath = join(configDir, 'dashboardConfig.js');
let dash = readFileSync(dashPath, 'utf8');
const upRe = /(CONFIG_DASHBOARD_UPCOMING_AND_ACTIVE_TOURNAMENT_DATA:\s*\[\s*)(\{[\s\S]*?\n\s*\},?)(\s*\],)/;
const up = dash.match(upRe);
if (up && up[2].includes(`/${from}/`)) {
  const oldCard = up[2].replace(/,\s*$/, '');
  const newCard = bumpEdition(oldCard.split(from).join(to))
    .replace(/dates:\s*"[^"]*"/, `dates: "Dates to be announced"`);
  dash = dash.replace(upRe, `$1${newCard},$3`);
  dash = dash.replace(/(CONFIG_DASHBOARD_PAST_TOURNAMENT_DATA:\s*\[\s*)/, `$1${oldCard.trim()},\n    `);
  writeFileSync(dashPath, dash);
  console.log(`Updated dashboardConfig.js (${to} upcoming, ${from} moved to past)`);
}

// Logo placeholder: copy the newest logo so the new artwork is a drop-in replacement.
const logoDir = join(root, 'client', 'src', 'components', 'dashboard');
const logos = readdirSync(logoDir).filter((n) => /\d{4}\.(png|jpe?g|svg)$/i.test(n)).sort();
const newest = logos[logos.length - 1];
if (newest) {
  const target = newest.replace(/\d{4}(\.\w+)$/, `${to}$1`);
  if (!existsSync(join(logoDir, target))) {
    copyFileSync(join(logoDir, newest), join(logoDir, target));
    console.log(`Copied logo ${newest} -> ${target} (replace with new artwork)`);
  }
}

execFileSync(process.execPath, [join(root, 'api', 'scripts', 'build-pricing.mjs')], { stdio: 'inherit' });
console.log(`\nNext: search for "TODO(${to})" and follow docs/NEW_YEAR.md.`);

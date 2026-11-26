#!/usr/bin/env node
/**
 * Builds api/generated/registration-pricing.json from the per-year client configs
 * (client/src/config/configYYYY/registrationConfig.js), so the API charges exactly
 * what the registration page shows. Run automatically by `npm run dev` and by the
 * deploy script; commit the result.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const configRoot = join(here, '..', '..', 'client', 'src', 'config');
const outFile = join(here, '..', 'generated', 'registration-pricing.json');

const tmp = mkdtempSync(join(tmpdir(), 'pricing-'));
const pricing = {};
const num = (v) => Number(v) || 0;

try {
  for (const dir of readdirSync(configRoot).filter((d) => /^config\d{4}$/.test(d)).sort()) {
    const year = dir.slice(-4);
    const src = join(configRoot, dir, 'registrationConfig.js');
    if (!existsSync(src)) continue;
    // The client files are ES modules in a CommonJS package; copy to .mjs to import them.
    const copy = join(tmp, `${year}.mjs`);
    writeFileSync(copy, readFileSync(src, 'utf8'));
    const { default: c } = await import(pathToFileURL(copy).href);

    pricing[year] = {
      hasEarlybird: Boolean(c.CONFIG_REGISTRATION_HAS_EARLYBIRD_REGISTRATION),
      earlybirdCutoffMs: num(c.CONFIG_REGISTRATION_EARLYBIRD_CUTOFF_IN_LOCAL_TIME_IN_MS),
      anglerCutoffMs: num(c.CONFIG_ANGLER_REGISTRATION_CUTOFF_IN_LOCAL_TIME_IN_MS),
      sponsorCutoffMs: num(c.CONFIG_SPONSOR_REGISTRATION_CUTOFF_IN_LOCAL_TIME_IN_MS),
      pricesPendingConfirmation: Boolean(c.CONFIG_REGISTRATION_PRICES_PENDING_CONFIRMATION),
      fees: {
        earlybird: { Adult: num(c.CONFIG_REGISTRATION_EARLYBIRD_ADULT_FEE), Junior: num(c.CONFIG_REGISTRATION_EARLYBIRD_JUNIOR_FEE) },
        normal: { Adult: num(c.CONFIG_REGISTRATION_NORMAL_ADULT_FEE), Junior: num(c.CONFIG_REGISTRATION_NORMAL_JUNIOR_FEE) },
      },
      sponsorTiers: c.CONFIG_SPONSOR_REGISTRATION_TIERS || {},
      sponsorAddOns: c.CONFIG_SPONSOR_REGISTRATION_ADDITIONAL_SPONSORSHIPS || {},
    };
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(pricing, null, 2) + '\n');
console.log(`Wrote ${outFile} (${Object.keys(pricing).join(', ')})`);

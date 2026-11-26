/**
 * pricing.js — computes what a registration costs, on the server.
 *
 * The browser used to send adultFee / juniorFee (anglers) and totalFee plus the fee
 * tables (sponsors), so a tampered request could pay $1. Now the server works the
 * total out from the year's config (api/generated/registration-pricing.json, built
 * from the client configs) and ignores any prices the browser sends.
 *
 * Time rules match the registration page: earlybird while now <= the earlybird
 * cutoff; closed once now > the angler (or sponsor) cutoff.
 */

const pricingByYear = require('../generated/registration-pricing.json');

class PricingError extends Error {}

const MAX_ANGLERS = 10; // the registration form offers 1-10
const AGE_BRACKETS = ['Adult', 'Junior'];

function yearPricing(year, cutoffKey, now, { ignoreCutoff = false, ignorePending = false } = {}) {
  const p = pricingByYear[String(year)];
  if (!p) throw new PricingError(`Registration is not set up for ${year}.`);
  if (!ignorePending && p.pricesPendingConfirmation) throw new PricingError('Registration is not open yet.');
  if (!ignoreCutoff && p[cutoffKey] && now > p[cutoffKey]) throw new PricingError('Registration is closed.');
  return p;
}

/**
 * Anglers: one line per angler at the adult or junior fee.
 * Returns { isEarlybird, adultFee, juniorFee, lineItems, total }.
 */
function quoteAnglers(year, anglerDetails, now = Date.now(), options = {}) {
  const p = yearPricing(year, 'anglerCutoffMs', now, options);
  if (!Array.isArray(anglerDetails) || anglerDetails.length < 1 || anglerDetails.length > MAX_ANGLERS) {
    throw new PricingError(`Register between 1 and ${MAX_ANGLERS} anglers.`);
  }

  const isEarlybird = p.hasEarlybird && now <= p.earlybirdCutoffMs;
  const fees = isEarlybird ? p.fees.earlybird : p.fees.normal;

  const lineItems = anglerDetails.map((angler) => {
    if (!angler || !AGE_BRACKETS.includes(angler.ageBracket)) {
      throw new PricingError('Each angler needs an age bracket of Adult or Junior.');
    }
    if (!String(angler.anglerName || '').trim()) throw new PricingError('Each angler needs a name.');
    return {
      name: `${angler.anglerName} (${angler.ageBracket})`,
      description: angler.division ? `Division: ${angler.division}` : undefined,
      unitAmount: fees[angler.ageBracket],
      quantity: 1,
    };
  });

  return {
    isEarlybird,
    adultFee: fees.Adult,
    juniorFee: fees.Junior,
    lineItems,
    total: lineItems.reduce((sum, li) => sum + li.unitAmount, 0),
  };
}

/**
 * Sponsors: an optional tier ("None" = no tier) plus any number of additional
 * sponsorships, each priced from the config. Returns { selectedTier,
 * selectedSponsorships, lineItems, total }.
 */
function quoteSponsor(year, selectedTier, selectedSponsorships, now = Date.now(), options = {}) {
  const p = yearPricing(year, 'sponsorCutoffMs', now, options);
  const tier = selectedTier || 'None';
  const extras = selectedSponsorships ?? [];
  if (!Array.isArray(extras)) throw new PricingError('Invalid sponsorship selection.');

  const lineItems = [];
  if (tier !== 'None') {
    if (!Object.prototype.hasOwnProperty.call(p.sponsorTiers, tier)) throw new PricingError(`Unknown sponsorship tier: ${tier}`);
    lineItems.push({ name: `Sponsorship Tier: ${tier}`, unitAmount: Number(p.sponsorTiers[tier]), quantity: 1 });
  }
  if (new Set(extras).size !== extras.length) throw new PricingError('Each sponsorship can only be selected once.');
  for (const name of extras) {
    if (!Object.prototype.hasOwnProperty.call(p.sponsorAddOns, name)) throw new PricingError(`Unknown sponsorship: ${name}`);
    lineItems.push({ name: `Additional Sponsorship: ${name}`, unitAmount: Number(p.sponsorAddOns[name]), quantity: 1 });
  }

  const total = lineItems.reduce((sum, li) => sum + li.unitAmount, 0);
  if (total <= 0) throw new PricingError('Select at least one sponsorship tier or additional sponsorship.');

  return { selectedTier: tier, selectedSponsorships: extras, lineItems: lineItems.filter((li) => li.unitAmount > 0), total };
}

module.exports = { quoteAnglers, quoteSponsor, PricingError, MAX_ANGLERS };

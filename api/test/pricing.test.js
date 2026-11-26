const test = require('node:test');
const assert = require('node:assert');
const { quoteAnglers, quoteSponsor, PricingError } = require('../services/pricing');
const pricing = require('../generated/registration-pricing.json');

const p26 = pricing['2026'];
const beforeEarlybird = p26.earlybirdCutoffMs - 1000;
const afterEarlybird = p26.earlybirdCutoffMs + 1000;
const afterAnglerCutoff = p26.anglerCutoffMs + 1000;
const afterSponsorCutoff = p26.sponsorCutoffMs + 1000;

const angler = (name, ageBracket) => ({ anglerName: name, ageBracket, division: 'Offshore', hometown: 'Freeport' });

test('anglers: earlybird adult and junior fees before the earlybird cutoff', () => {
  const q = quoteAnglers(2026, [angler('A', 'Adult'), angler('B', 'Junior')], beforeEarlybird);
  assert.strictEqual(q.isEarlybird, true);
  assert.strictEqual(q.adultFee, p26.fees.earlybird.Adult);
  assert.strictEqual(q.juniorFee, p26.fees.earlybird.Junior);
  assert.strictEqual(q.total, p26.fees.earlybird.Adult + p26.fees.earlybird.Junior);
  assert.strictEqual(q.lineItems.length, 2);
});

test('anglers: earlybird still applies exactly at the cutoff (matches the registration page)', () => {
  assert.strictEqual(quoteAnglers(2026, [angler('A', 'Adult')], p26.earlybirdCutoffMs).isEarlybird, true);
});

test('anglers: normal fees after the earlybird cutoff', () => {
  const q = quoteAnglers(2026, [angler('A', 'Adult'), angler('B', 'Adult'), angler('C', 'Junior')], afterEarlybird);
  assert.strictEqual(q.isEarlybird, false);
  assert.strictEqual(q.total, 2 * p26.fees.normal.Adult + p26.fees.normal.Junior);
});

test('anglers: prices sent by the browser are ignored', () => {
  const tampered = [{ ...angler('A', 'Adult'), registrationFee: 1, adultFee: 1 }];
  assert.strictEqual(quoteAnglers(2026, tampered, afterEarlybird).total, p26.fees.normal.Adult);
});

test('anglers: rejects bad age brackets, missing names and bad counts', () => {
  assert.throws(() => quoteAnglers(2026, [angler('A', 'Toddler')], afterEarlybird), PricingError);
  assert.throws(() => quoteAnglers(2026, [angler('', 'Adult')], afterEarlybird), PricingError);
  assert.throws(() => quoteAnglers(2026, [], afterEarlybird), PricingError);
  assert.throws(() => quoteAnglers(2026, Array.from({ length: 11 }, (_, i) => angler(`A${i}`, 'Adult')), afterEarlybird), PricingError);
  assert.throws(() => quoteAnglers(2026, 'not a list', afterEarlybird), PricingError);
});

test('anglers: closed after the angler cutoff unless the cutoff is ignored', () => {
  assert.throws(() => quoteAnglers(2026, [angler('A', 'Adult')], afterAnglerCutoff), PricingError);
  const q = quoteAnglers(2026, [angler('A', 'Adult')], afterAnglerCutoff, { ignoreCutoff: true });
  assert.strictEqual(q.total, p26.fees.normal.Adult);
});

test('rejects years with no config', () => {
  assert.throws(() => quoteAnglers(2099, [angler('A', 'Adult')], afterEarlybird), PricingError);
  assert.throws(() => quoteSponsor(2099, 'None', ['Piggy Perch'], afterEarlybird), PricingError);
});

test('sponsors: tier plus additional sponsorships priced from the config', () => {
  const extras = ['Piggy Perch', 'Junior Boatmen Raffle'];
  const q = quoteSponsor(2026, 'Gold Tier', extras, afterEarlybird);
  assert.strictEqual(q.total, p26.sponsorTiers['Gold Tier'] + p26.sponsorAddOns['Piggy Perch'] + p26.sponsorAddOns['Junior Boatmen Raffle']);
  assert.strictEqual(q.lineItems.length, 3);
});

test('sponsors: "None" tier with only additional sponsorships', () => {
  const q = quoteSponsor(2026, 'None', ['Piggy Perch'], afterEarlybird);
  assert.strictEqual(q.total, p26.sponsorAddOns['Piggy Perch']);
  assert.strictEqual(q.selectedTier, 'None');
});

test('sponsors: rejects unknown tiers, unknown or repeated sponsorships, and $0 totals', () => {
  assert.throws(() => quoteSponsor(2026, 'Diamond Tier', [], afterEarlybird), PricingError);
  assert.throws(() => quoteSponsor(2026, 'None', ['Free Boat'], afterEarlybird), PricingError);
  assert.throws(() => quoteSponsor(2026, 'None', ['Piggy Perch', 'Piggy Perch'], afterEarlybird), PricingError);
  assert.throws(() => quoteSponsor(2026, 'None', [], afterEarlybird), PricingError);
  assert.throws(() => quoteSponsor(2026, 'None', 'Piggy Perch', afterEarlybird), PricingError);
  assert.throws(() => quoteSponsor(2026, 'toString', [], afterEarlybird), PricingError);
});

test('sponsors: closed after the sponsor cutoff unless the cutoff is ignored', () => {
  assert.throws(() => quoteSponsor(2026, 'Gold Tier', [], afterSponsorCutoff), PricingError);
  assert.strictEqual(quoteSponsor(2026, 'Gold Tier', [], afterSponsorCutoff, { ignoreCutoff: true }).total, p26.sponsorTiers['Gold Tier']);
});

test('a year with prices pending refuses public checkout but admins can still register', () => {
  const pendingYear = Object.keys(pricing).find((y) => pricing[y].pricesPendingConfirmation);
  if (!pendingYear) return; // nothing pending right now
  const p = pricing[pendingYear];
  assert.throws(() => quoteAnglers(pendingYear, [angler('A', 'Adult')], p.earlybirdCutoffMs - 1000), PricingError);
  assert.throws(() => quoteSponsor(pendingYear, 'None', [Object.keys(p.sponsorAddOns)[0]], p.earlybirdCutoffMs - 1000), PricingError);
  const q = quoteAnglers(pendingYear, [angler('A', 'Adult')], p.earlybirdCutoffMs - 1000, { ignorePending: true });
  assert.strictEqual(q.total, p.fees.earlybird.Adult);
});

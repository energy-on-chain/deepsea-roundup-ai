# New tournament year: go-live checklist

The year's config is generated closed: registration shows **Coming Soon**, the API refuses
checkout, and the home page says **Dates to be announced** with no countdown. Nothing goes
live until the steps below are done.

To scaffold a future year (e.g. 2028), run from the repo root:

```bash
node scripts/new-year.mjs 2027 2028 --past-result "N anglers / N catches / $N total pot"
```

Get the past-result numbers from production: the anglers and catches counts are on the home
page of the year just finished, and the total pot is on its Pots page.

2027 is already scaffolded (91st edition). Its placeholder dates are 2026's plus 52 weeks, so weekdays line up:
- Tournament: Thu Jul 8 – Sun Jul 11, 2027
- Earlybird price ends: Wed Jun 30, 00:00
- Angler and sponsor registration close: Wed Jul 14, 00:00 (end of Tue Jul 13)
- "Preliminary results" notice ends: Tue Jul 20, 00:00 (end of Mon Jul 19)
- Fees and sponsorships: 2026's (adult $150 earlybird / $200 normal, junior $110 / $130)

## 1. Get the details from Cody

- [ ] Tournament dates
- [ ] Earlybird deadline and registration close for anglers and sponsors (date and time, Central)
- [ ] Adult and junior fees (earlybird and normal)
- [ ] Sponsorship tiers, additional sponsorships and their prices
- [ ] Changes to pots, divisions, species, records or scoring rules
- [ ] New logo artwork, if any

## 2. Fill in the config

Every value to confirm is marked `TODO(2027)`. Find them all with:

```bash
grep -rn "TODO(2027)" client/src/config/config2027
```

| File | What to set |
| --- | --- |
| `homeConfig.js` | `CONFIG_HOME_TOURNAMENT_DATE_STRING` (e.g. "July 8th - 11th, 2027"), `CONFIG_HOME_TOURNAMENT_START_IN_LOCAL_TIME_IN_MS`, then `CONFIG_HOME_DATES_CONFIRMED: true` |
| `registrationConfig.js` | Earlybird, angler and sponsor cutoff timestamps, both date strings, the four fees, `CONFIG_SPONSOR_REGISTRATION_TIERS`, `CONFIG_SPONSOR_REGISTRATION_ADDITIONAL_SPONSORSHIPS` |
| `adminConfig.js` | Tournament start/end dates (`YYYY-MM-DD`) |
| `leaderboardConfig.js`, `potsConfig.js` | Preliminary-results cutoff |
| `catchConfig.js`, `potsConfig.js`, `leaderboardConfig.js` | Only if species, pots, divisions or scoring change |
| `../dashboardConfig.js` | The 2027 card's `dates` text |

Timestamps are milliseconds at midnight Central. July is daylight time (`-05:00`). A cutoff of
"end of July 13" is midnight starting July 14:

```bash
node -e 'console.log(new Date("2027-07-14T00:00:00-05:00").getTime())'
```

- [ ] Replace `client/src/components/dashboard/DeepseaRoundupLogo2027.jpg` with the new artwork. It's currently a copy of 2025's. Also replace the home page logos in `client/src/images/` if they change.
- [ ] Species records for tiebreakers: set them in the Admin page (Records). They're stored in Firestore under `speciesRecords/2027`.

## 3. Stripe (needs Cody's Stripe login)

- [ ] **Live mode:** the webhook endpoint must be `https://deepsearoundup.customtournamentsolutions.com/api/registration_webhook`, with event `checkout.session.completed`. If it still points at a `herokuapp.com` address, edit its URL. The signing secret stays the same, and production already has it. If Stripe shows a different secret, store it:

```bash
read -rs -p 'Paste production webhook signing secret: ' K && printf %s "$K" | CLOUDSDK_ACTIVE_CONFIG_NAME=arrowhead gcloud secrets versions add STRIPE_WEBHOOK_SECRET --project deepsea-roundup-ai-prod --data-file=- && unset K
```

- [ ] **Test mode:** add an endpoint `https://deepsea-roundup-ai-dev.web.app/api/registration_webhook` (`checkout.session.completed`). Store its signing secret in staging (it is a `whsec_placeholder` until then):

```bash
read -rs -p 'Paste staging webhook signing secret: ' K && printf %s "$K" | CLOUDSDK_ACTIVE_CONFIG_NAME=arrowhead gcloud secrets versions add STRIPE_WEBHOOK_SECRET --project deepsea-roundup-ai-dev --data-file=- && unset K
```

- [ ] A new secret version is only picked up on the next deploy, so redeploy after adding one.
- [ ] If the live Stripe key ever changes, add it with `gcloud secrets versions add STRIPE_SECRET_KEY --project deepsea-roundup-ai-prod ...` the same way.

## 4. Test on staging

- [ ] Set `CONFIG_REGISTRATION_PRICES_PENDING_CONFIRMATION: false` in `config2027/registrationConfig.js`, then deploy staging (staging accepts checkout even outside the registration dates):

```bash
scripts/deploy.sh staging
```

- [ ] On https://deepsea-roundup-ai-dev.web.app/2027/register, register two test anglers (one adult, one junior) with card `4242 4242 4242 4242`.
- [ ] Register a test sponsor with a tier, one additional sponsorship and a logo.
- [ ] Confirm both appear in Admin with the right fees and logo, that Stripe shows the payments, and that the sponsor notification email arrived.
- [ ] Delete the test anglers and sponsor in Admin.

## 5. Go live

- [ ] Merge to `main`, then deploy production:

```bash
scripts/deploy.sh production
```

- [ ] Open https://deepsearoundup.customtournamentsolutions.com/2027/home. Check the dates, the countdown, prices, and that **Register** works.

## 6. Event week

- [ ] Keep one server warm so nobody waits on a cold start. Set `MIN_INSTANCES=1` in `deploy/production.env` and run `scripts/deploy.sh production`. After the event, set it back to `0` and deploy again.

###############################################################################
# PROJECT: Fishing Tournament Template (V3)
# IMPLEMENTED FOR: Deepsea Roundup (90th Annual)
# DATE STARTED: 2-December-2024
# DESCRIPTION: Full-stack tournament management app for the Deepsea Roundup
#   annual fishing tournament. Built on the v3 angler tourney template.
#   React (Vite) + Express.js + Firebase (Hosting, Firestore, Storage, Auth)
#   + Cloud Run + Stripe + Resend.
###############################################################################

###############################################################################
# CHANGELOG
###############################################################################

# v3.2.0  (November 2026) — moved off Heroku
# - Firebase Hosting serves the site; /api/** is routed to a Cloud Run service ("api")
#   running the Express app. Deploy with scripts/deploy.sh staging|production.
# - Redis and express-session removed: pending checkouts live in Firestore
#   (pendingRegistrations, 7-day TTL); the response cache is in-memory.
# - Stripe webhook saves each registration exactly once (transaction) and returns 500
#   on failure so Stripe retries. Authorize.net removed; Stripe only.
# - Angler and sponsor prices are computed server-side from the year's registrationConfig
#   (api/generated/registration-pricing.json). Tests: cd api && npm test.
# - Admin routes require a Firebase ID token from an ADMIN_EMAILS user; public reads drop
#   contact/payment fields and only read the expected collections.

# v3.1.0  (April 2026)
# - Migrated front-end build from Create React App (react-scripts) to Vite
#     · Replaced REACT_APP_ env var prefix with VITE_ across all client code
#     · Added client/vite.config.js, client/index.html
#     · vite and @vitejs/plugin-react moved to dependencies (not devDependencies)
#       so Heroku can install them during the production build
# - Added 2026 season config (client/src/config/config2026/)
#     · 90th Deepsea Roundup, July 9-12 2026
#     · New Firebase projects: deepsea-roundup--ai-dev (staging), deepsea-roundup-ai-prod (prod)
# - Back-end architecture refresh
#     · Redis cache middleware (api/services/cache.js) — 60-second TTL on leaderboard/pot routes
#     · Centralized async error handler (api/middleware/errorHandler.js)
#     · Morgan HTTP request logging added to api/server.js
#     · Firestore migration script (scripts/migrate-to-new-projects.js)
# - Pot winners overhaul
#     · Rewrote all three pot controllers (C&R, Offshore, Bay/Surf) with normalizeName matching
#       and multi-place payouts via payoutStructure config
#     · Admin Pot Winners tab: financial summary cards + board/category breakdowns
#       using raw pot documents for true entrant counts (includes pots with no catches)
#     · Pot Winners PDF report: financial summary first page, compact multi-category layout
# - Added press report and announcer report PDF generators
# - Historical Records page scaffolded
# - 2025 pot config: corrected entry amounts to match actual Firebase data

# v3.0.0  (December 2024)
# Initial commit. Firebase projects: deepsea-roundup-v3-staging, deepsea-roundup-v3-prod

###############################################################################
# DEPLOYMENT (Firebase Hosting + Cloud Run)
###############################################################################

# Environments (same Firebase projects every year)
#   Staging:    deepsea-roundup-ai-dev   https://deepsea-roundup-ai-dev.web.app
#   Production: deepsea-roundup-ai-prod  https://deepsearoundup.customtournamentsolutions.com
#                                        (www. redirects to it; also deepsea-roundup-ai-prod.web.app)

# Deploy (needs gcloud configuration "arrowhead" and firebase-tools on Node 22)
#   scripts/deploy.sh staging
#   scripts/deploy.sh production      (asks to confirm when not on main)
#   Builds pricing + the site, deploys the API to Cloud Run, deploys Hosting, then
#   smoke-tests /api/health.

# Settings
#   deploy/staging.env, deploy/production.env   non-secret settings (committed)
#   .env.staging, .env.production               public Firebase web config for the Vite build
#                                               (vite reads env files from the repo root)
#   Secret Manager (per project): STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY
#   The API runs as firebase-adminsdk-fbsvc@<project>.iam.gserviceaccount.com; no key files.

# Event week: set MIN_INSTANCES=1 in deploy/production.env and redeploy; back to 0 after.

# Stripe webhook URLs (event: checkout.session.completed)
#   Staging:    https://deepsea-roundup-ai-dev.web.app/api/registration_webhook
#   Production: https://deepsearoundup.customtournamentsolutions.com/api/registration_webhook

# Parity check against another host reading the same Firestore project:
#   node migration/parity-check.mjs <oldBaseUrl> <newBaseUrl> 2024 2025 2026

###############################################################################
# LOCAL DEVELOPMENT
###############################################################################

# Prerequisites: Node 22, Stripe CLI (for registration testing)

# Terminal 1 — API server:   cd api && npm run dev
# Terminal 2 — Vite:         cd client && npm start   (proxies /api to localhost:8000)
# Terminal 3 — Stripe:       stripe listen --forward-to localhost:8000/api/registration_webhook

# Local .env (repo root, gitignored): the legacy REACT_APP_*_STAGING service-account vars,
# REACT_APP_STRIPE_PRIVATE_KEY_TESTING / _WEBHOOK_SECRET_KEY_TESTING, plus VITE_* web config.
# See api/config.js for the full list.

###############################################################################
# FIREBASE SETUP (per new year / new project)
###############################################################################

# 1. Create two new Firebase projects in Firebase console
#      Staging:    deepsea-roundup--ai-dev   (note: double dash)
#      Production: deepsea-roundup-ai-prod
# 2. Enable in each project:
#      - Authentication (add admin email accounts)
#      - Firestore Database
#      - Storage
# 3. Enable Google Cloud billing on each project's Storage bucket
# 4. In Google Cloud console for each project:
#      - Enable Cloud Storage API
#      - Go to Storage bucket Settings → Permissions → Add member:
#          Principal: allUsers, Role: Storage Object Viewer
# 5. Create a service account JSON key for each project and add to scripts/keys/ (gitignored)
# 6. Set Firebase Storage Rules:
#      rules_version = '2';
#      service firebase.storage {
#        match /b/{bucket}/o {
#          match /{allPaths=**} {
#            allow read: if true;
#            allow write: if request.auth != null;
#          }
#        }
#      }
# 7. Run migration script (dry run first):
#      node scripts/migrate-to-new-projects.js --dry-run
#      node scripts/migrate-to-new-projects.js

###############################################################################
# ADDING A NEW TOURNAMENT YEAR
###############################################################################

# 1. Copy client/src/config/configYYYY/ to configYYYY+1/
# 2. Update all values in each config file for the new year
# 3. Update client/src/config/masterConfig.js to route the new year
# 4. Update client/src/config/dashboardConfig.js with the new Firebase project IDs
# 5. Update client/src/App.js if a new year route is needed
# 6. Keep the same Firebase projects (staging/production are reused every year)
# 7. cd api && npm run build:pricing && npm test   (regenerates server-side prices)
# 8. Deploy staging, test, then deploy production (see Deployment above)
# 9. Set CONFIG_REGISTRATION_PRICES_PENDING_CONFIRMATION: true in registrationConfig.js
#    while prices are being confirmed — flip to false when ready to open registration

###############################################################################
# REPO & LINKS
###############################################################################

# GitHub:   https://github.com/energy-on-chain/deepsea-roundup-ai
# Template: https://github.com/energy-on-chain/fishing-tournament-app-template-v3

# Historical catch records reference:
#   https://roundup.portasouthjetty.com/wp-content/uploads/images/2023-06-22/15p1.jpg

###############################################################################
# DEV HOURS
###############################################################################
# 0  (as of 2-December-2024, initial setup)
# ~  (v3.1.0 overhaul: April 2026)

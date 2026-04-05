###############################################################################
# PROJECT: Fishing Tournament Template (V3)
# IMPLEMENTED FOR: Deepsea Roundup (90th Annual)
# DATE STARTED: 2-December-2024
# DESCRIPTION: Full-stack tournament management app for the Deepsea Roundup
#   annual fishing tournament. Built on the v3 angler tourney template.
#   React (Vite) + Express.js + Firebase + Stripe + Redis + Heroku.
###############################################################################

###############################################################################
# CHANGELOG
###############################################################################

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
# HEROKU DEPLOYMENT NOTES
###############################################################################

# Apps
#   Staging:    deepsea-roundup-ai-dev   (auto-deploys from: develop branch)
#   Production: deepsea-roundup-ai-prod  (auto-deploys from: main branch)

# Build process (heroku-postbuild in root package.json)
#   1. cd client && npm install && npm run build   (Vite build, outputs to client/dist/)
#   2. cd api && npm install

# IMPORTANT: vite and @vitejs/plugin-react MUST be in client/package.json "dependencies"
#   (not "devDependencies"). Heroku sets NODE_ENV=production and skips devDependencies,
#   causing "vite: not found" if they are in devDependencies.

# Redis
#   Add Heroku Key-Value Store (Redis) Mini addon to BOTH staging and prod apps.
#   The REDIS_TLS_URL config var is set automatically by the addon — do NOT add manually.
#   api/services/cache.js reads REDIS_TLS_URL at startup.

# Private key env vars (Firebase service account)
#   Paste the private key as a single line with literal \n characters in Heroku config vars.
#   The server calls .replace(/\\n/g, '\n') at runtime to restore the real newlines.
#   Example (from .env — do NOT add quotes around the value in Heroku):
#     VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n

# Config vars to set on both apps (staging and prod versions where noted)
#   VITE_NODE_ENV                          staging | production
#   VITE_SERVER_URL_STAGING                https://your-staging-app.herokuapp.com
#   VITE_SERVER_URL_PRODUCTION             https://your-prod-app.herokuapp.com
#   VITE_FIREBASE_API_KEY                  (staging / prod values)
#   VITE_FIREBASE_AUTH_DOMAIN
#   VITE_FIREBASE_PROJECT_ID
#   VITE_FIREBASE_STORAGE_BUCKET
#   VITE_FIREBASE_MESSAGING_SENDER_ID
#   VITE_FIREBASE_APP_ID
#   VITE_GOOGLE_SERVICE_ACCOUNT_TYPE
#   VITE_GOOGLE_SERVICE_ACCOUNT_PROJECT_ID
#   VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID
#   VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY   (single-line with literal \n)
#   VITE_GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL
#   VITE_GOOGLE_SERVICE_ACCOUNT_CLIENT_ID
#   VITE_GOOGLE_SERVICE_ACCOUNT_AUTH_URI
#   VITE_GOOGLE_SERVICE_ACCOUNT_TOKEN_URI
#   VITE_STRIPE_PRIVATE_KEY_TESTING
#   VITE_STRIPE_WEBHOOK_SECRET_KEY_TESTING
#   VITE_STRIPE_PRIVATE_KEY_PRODUCTION
#   VITE_STRIPE_WEBHOOK_SECRET_KEY_PRODUCTION

# Stripe webhook URLs
#   Staging:    https://your-staging-app.herokuapp.com/api/registration_webhook
#   Production: https://your-prod-app.herokuapp.com/api/registration_webhook

###############################################################################
# LOCAL DEVELOPMENT
###############################################################################

# Prerequisites
#   nvm (use node 21.6.0)
#   Redis installed locally
#   Stripe CLI installed

# Terminal 1 — Redis
#   redis-server
#   (confirm: redis-cli ping → PONG)

# Terminal 2 — API server
#   nvm use 21.6.0
#   cd api && npm run dev

# Terminal 3 — Vite dev server
#   nvm use 21.6.0
#   cd client && npm start

# Terminal 4 — Stripe webhook forwarding (for registration testing)
#   stripe listen --forward-to localhost:3001/api/registration_webhook

# .env file lives in the project root directory (gitignored).
# Copy the structure from Heroku config vars above.

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
# 6. Create new Firebase projects (see Firebase Setup above)
# 7. Update Heroku config vars with new Firebase credentials
# 8. Update Stripe webhook URLs if the Heroku app URL has changed
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

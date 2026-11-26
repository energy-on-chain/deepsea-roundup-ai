#!/usr/bin/env bash
# Deploys Deep Sea Roundup to staging or production.
#
#   scripts/deploy.sh staging
#   scripts/deploy.sh production
#
# 1. Rebuilds server-side pricing from the client configs
# 2. Builds the React site for that environment
# 3. Deploys the API to Cloud Run (service "api")
# 4. Deploys the site to Firebase Hosting (which routes /api/** to Cloud Run)
# 5. Smoke-tests /api/health through Hosting
#
# Uses the "arrowhead" gcloud configuration so other clients' gcloud setups are untouched.
# Override with CLOUDSDK_ACTIVE_CONFIG_NAME=<name> if needed.

set -euo pipefail

ENV_NAME="${1:-}"
if [[ "$ENV_NAME" != "staging" && "$ENV_NAME" != "production" ]]; then
  echo "Usage: $0 staging|production" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
export CLOUDSDK_ACTIVE_CONFIG_NAME="${CLOUDSDK_ACTIVE_CONFIG_NAME:-arrowhead}"

# shellcheck disable=SC1090
set -a; source "deploy/$ENV_NAME.env"; set +a

if [[ "$ENV_NAME" == "production" ]]; then
  BRANCH="$(git rev-parse --abbrev-ref HEAD)"
  if [[ "$BRANCH" != "main" ]]; then
    read -r -p "You are on '$BRANCH', not main. Deploy to PRODUCTION anyway? (type yes) " ok
    [[ "$ok" == "yes" ]] || exit 1
  fi
fi

echo "==> [$ENV_NAME] project $PROJECT_ID, commit $(git rev-parse --short HEAD)"

echo "==> Building server pricing"
node api/scripts/build-pricing.mjs

echo "==> Building site"
(cd client && npm install --no-audit --no-fund && npm run "build:$ENV_NAME")

echo "==> Deploying API to Cloud Run"
gcloud run deploy api \
  --project "$PROJECT_ID" \
  --region "$REGION" \
  --source api \
  --no-invoker-iam-check \
  --service-account "$RUNTIME_SA" \
  --memory 1Gi \
  --cpu 1 \
  --concurrency 80 \
  --timeout 120 \
  --min-instances "$MIN_INSTANCES" \
  --max-instances "$MAX_INSTANCES" \
  --set-env-vars "^|^APP_ENV=$APP_ENV|STORAGE_BUCKET=$STORAGE_BUCKET|CLIENT_URL=$CLIENT_URL|ADMIN_EMAILS=$ADMIN_EMAILS|REGISTRATION_TEST_MODE=$REGISTRATION_TEST_MODE|EMAIL_FROM=$EMAIL_FROM" \
  --set-secrets "STRIPE_SECRET_KEY=STRIPE_SECRET_KEY:latest,STRIPE_WEBHOOK_SECRET=STRIPE_WEBHOOK_SECRET:latest,RESEND_API_KEY=RESEND_API_KEY:latest" \
  --quiet

echo "==> Deploying site to Firebase Hosting"
firebase deploy --only hosting --project "$ENV_NAME" --non-interactive

echo "==> Smoke test"
curl -fsS "https://$PROJECT_ID.web.app/api/health"; echo
echo "==> Done: https://$PROJECT_ID.web.app"

#!/usr/bin/env bash
# Heroku inventory — read-only snapshot of everything Heroku is doing for us,
# so nothing gets forgotten when we move off it.
#
# Usage:
#   heroku login
#   bash migration/heroku-inventory.sh            # writes heroku-inventory-<date>.md here
#
# Prints config var NAMES only, never values. To capture values for the move,
# run this per app and store the output in 1Password, NOT in git:
#   heroku config -s -a <app>
#
# Nothing in this script changes anything on Heroku.

set -uo pipefail

OUT="heroku-inventory-$(date +%Y-%m-%d).md"
command -v heroku >/dev/null || { echo "heroku CLI not installed"; exit 1; }
command -v jq >/dev/null || { echo "jq not installed"; exit 1; }
heroku auth:whoami >/dev/null 2>&1 || { echo "Run 'heroku login' first"; exit 1; }

{
  echo "# Heroku inventory — $(date '+%Y-%m-%d %H:%M')"
  echo
  echo "Account: $(heroku auth:whoami 2>/dev/null)"
  echo
  echo "## All apps (every team you can see)"
  echo '```'
  heroku apps --all 2>/dev/null
  echo '```'
  echo
  echo "## Pipelines"
  echo '```'
  heroku pipelines 2>/dev/null
  echo '```'
  echo
  echo "## All add-ons across apps (these bill separately from dynos)"
  echo '```'
  heroku addons --all 2>/dev/null
  echo '```'

  for APP in $(heroku apps --all --json 2>/dev/null | jq -r '.[].name'); do
    echo
    echo "---"
    echo "## App: \`$APP\`"
    echo
    echo "### Info (stack, region, repo, web URL)"
    echo '```'
    heroku apps:info -a "$APP" 2>/dev/null
    echo '```'
    echo "### Dyno formation (size × count = what we pay)"
    echo '```'
    heroku ps -a "$APP" 2>/dev/null
    heroku ps:type -a "$APP" 2>/dev/null
    echo '```'
    echo "### Config var NAMES (values intentionally omitted)"
    echo '```'
    heroku config -a "$APP" --json 2>/dev/null | jq -r 'keys[]'
    echo '```'
    echo "### Add-ons on this app"
    echo '```'
    heroku addons -a "$APP" 2>/dev/null
    echo '```'
    echo "### Custom domains (each needs a DNS change at cutover)"
    echo '```'
    heroku domains -a "$APP" 2>/dev/null
    echo '```'
    echo "### SSL certs"
    echo '```'
    heroku certs -a "$APP" 2>/dev/null
    echo '```'
    echo "### Buildpacks"
    echo '```'
    heroku buildpacks -a "$APP" 2>/dev/null
    echo '```'
    echo "### Log drains"
    echo '```'
    heroku drains -a "$APP" 2>/dev/null
    echo '```'
    echo "### App webhooks"
    echo '```'
    heroku webhooks -a "$APP" 2>/dev/null
    echo '```'
    echo "### Enabled features / labs"
    echo '```'
    heroku labs -a "$APP" 2>/dev/null | grep -E '^\[\+\]' || echo "(none enabled)"
    echo '```'
    echo "### Last 5 releases"
    echo '```'
    heroku releases -a "$APP" -n 5 2>/dev/null
    echo '```'
    if heroku addons -a "$APP" --json 2>/dev/null | jq -e '.[] | select(.addon_service.name=="scheduler")' >/dev/null; then
      echo "### ⚠ Heroku Scheduler is attached — open its dashboard and list every job:"
      echo "heroku addons:open scheduler -a $APP"
    fi
  done
} > "$OUT"

echo "Wrote $OUT"
echo "Next: send me that file (it holds no secret values) and check the Heroku invoice for the actual monthly total."

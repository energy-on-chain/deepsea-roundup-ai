---
name: sync-staging
description: Re-sync the staging Firestore project (deepsea-roundup-ai-dev) with production (deepsea-roundup-ai-prod), so staging reflects real, current tournament data instead of stale test fixtures. Use whenever the user asks to sync staging from production, refresh staging data, or mirror prod to staging.
---

# Sync staging from production

Runs `scripts/sync-staging-from-prod.js`, which copies `anglers*`, `catches*`,
`pots*`, `sponsors*`, and `announcements*` collections from production into
staging. Production is **read-only** — the script hard-gates on `project_id`
before any write, and every write in it targets staging only. Direction is
one-way and not configurable via flags; there is no "sync prod from staging"
mode.

## Steps

1. **Dry run first, always** — this reports scope (collections and doc
   counts) with zero writes or deletes:
   ```
   NODE_PATH="$(pwd)/api/node_modules" node scripts/sync-staging-from-prod.js --dry-run
   ```
   Run from the repo root.

2. **Show the user the dry-run output** and confirm before proceeding — this
   is a destructive operation on staging (it clears each collection before
   repopulating it). Don't skip this confirmation step even if the user's
   request sounded casual ("sync staging real quick") — the scope should
   still be visible before anything is deleted.

3. **Live run**, only after confirmation:
   ```
   NODE_PATH="$(pwd)/api/node_modules" node scripts/sync-staging-from-prod.js
   ```
   Staging's prior contents are backed up locally first, to
   `scripts/backups/staging-presync-<timestamp>/` (gitignored — contains
   real contestant PII), before being cleared and replaced.

4. **Report back** what changed (collection names + doc counts from the
   script's own output) and where the pre-sync backup landed, in case
   something needs to be recovered from it.

## Notes

- `NODE_PATH` is required because `scripts/` has no `node_modules` of its
  own; it resolves `firebase-admin` from `api/node_modules` instead.
- Needs `scripts/keys/new-production.json` and `scripts/keys/new-staging.json`
  (gitignored service account keys) to exist locally.
- If you need to inspect *why* something looks wrong in staging or
  production data rather than sync everything, write a small one-off
  diagnostic script instead (see `scripts/diagnose_*.js` for the established
  pattern: read-only, uses the same service account keys, one Node script
  per question) — this skill is specifically for the full re-sync, not
  targeted lookups.

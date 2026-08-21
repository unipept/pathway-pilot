#!/usr/bin/env bash
#
# Deploy PathwayPilot from the server itself.
#
#   cd /opt/pathwaypilot && ./deploy/deploy.sh
#
# Pulls main, rebuilds both halves, seeds the KEGG data if it is missing,
# restarts the API and checks it came back. Safe to re-run.
#
# GitHub cannot reach this host, so deploys are pull-based by design:
# nothing here needs inbound access or a stored credential.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SERVICE="${SERVICE:-pathwaypilot-api}"
BRANCH="${BRANCH:-main}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:3000/health}"
HEALTH_TIMEOUT="${HEALTH_TIMEOUT:-300}"
# RESTART=0 builds everything and stops there, leaving whatever is serving in
# place. Used during the migration onto systemd, where the old process still
# holds port 3000 and starting the unit would only fail.
RESTART="${RESTART:-1}"

log() { printf '\n\033[1m==> %s\033[0m\n' "$*"; }
die() { printf '\n\033[31mFAILED: %s\033[0m\n' "$*" >&2; exit 1; }

cd "$ROOT"

# ---------------------------------------------------------------------------
log "Checking the working tree is clean"
# A deploy that quietly discards someone's hotfix is worse than one that stops.
# backend/data is excluded for belt-and-braces only: it is gitignored, so
# `git status --porcelain` already can't see anything under it. The exclude
# costs nothing and keeps this check honest if that ever changes.
[ -z "$(git status --porcelain -- . ':(exclude)backend/data')" ] \
    || die "working tree has local changes; commit, stash or revert them first"

BEFORE="$(git rev-parse --short HEAD)"

# ---------------------------------------------------------------------------
log "Pulling $BRANCH"
git fetch --quiet origin "$BRANCH"
git checkout --quiet "$BRANCH"

git merge --ff-only --quiet "origin/$BRANCH" || die "cannot fast-forward $BRANCH; the local branch has diverged"

AFTER="$(git rev-parse --short HEAD)"
if [ "$BEFORE" = "$AFTER" ]; then
    echo "    already at $AFTER — rebuilding anyway"
else
    echo "    $BEFORE -> $AFTER"
    git --no-pager log --oneline "$BEFORE..$AFTER" | sed 's/^/    /'
fi

# ---------------------------------------------------------------------------
log "Building the backend"
cd "$ROOT/backend"
[ -f .env ] || die ".env is missing. Copy .env.example and fill it in."
# Full install first: tsc is a devDependency and the build needs it. Prune
# afterwards so the running service carries runtime dependencies only.
npm ci --no-audit --no-fund
npm run build
npm prune --omit=dev

# ---------------------------------------------------------------------------
log "Seeding KEGG data if absent"
# backend/data is gitignored, so a fresh checkout has none: this is what seeds
# it on first deploy. On a server that already has data it is normally a
# no-op, but it also covers the directory ever being emptied by hand — the
# API cannot start without it.
if [ -z "$(ls -A data 2>/dev/null || true)" ]; then
    echo "    data/ is empty — running a full refresh (about three minutes)"
    npm run refresh-data
else
    echo "    data/ is present — leaving it to the monthly timer"
fi

# ---------------------------------------------------------------------------
log "Building the frontend"
cd "$ROOT/web"
npm ci --no-audit --no-fund
npm run build
[ -f dist/index.html ] || die "web build produced no dist/index.html"

# ---------------------------------------------------------------------------
cd "$ROOT"

if [ "$RESTART" = "0" ]; then
    log "Built $AFTER — not restarting (RESTART=0)"
    echo "    backend:  $ROOT/backend/build"
    echo "    frontend: $ROOT/web/dist (served by nginx)"
    exit 0
fi

log "Restarting $SERVICE"
sudo systemctl restart "$SERVICE"

# ---------------------------------------------------------------------------
log "Waiting for the API to answer"
# The mapping tables are built at startup, so a cold start is slow. Poll rather
# than sleeping a fixed amount.
deadline=$(( SECONDS + HEALTH_TIMEOUT ))
until curl -fsS -o /dev/null --max-time 10 "$HEALTH_URL"; do
    if ! systemctl is-active --quiet "$SERVICE"; then
        journalctl -u "$SERVICE" -n 40 --no-pager >&2
        die "$SERVICE stopped while starting up"
    fi
    [ "$SECONDS" -lt "$deadline" ] || {
        journalctl -u "$SERVICE" -n 40 --no-pager >&2
        die "API did not answer within ${HEALTH_TIMEOUT}s"
    }
    sleep 5
done

log "Deployed $AFTER successfully"
echo "    API:      $(systemctl is-active "$SERVICE")"
echo "    Frontend: $ROOT/web/dist (served by nginx)"
echo "    Refresh:  $(systemctl is-active pathwaypilot-refresh.timer 2>/dev/null || echo 'timer not installed')"

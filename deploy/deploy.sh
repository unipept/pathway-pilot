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
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:3000/mapping/ec/1.1.1.1}"
HEALTH_TIMEOUT="${HEALTH_TIMEOUT:-300}"

log() { printf '\n\033[1m==> %s\033[0m\n' "$*"; }
die() { printf '\n\033[31mFAILED: %s\033[0m\n' "$*" >&2; exit 1; }

cd "$ROOT"

# ---------------------------------------------------------------------------
log "Checking the working tree is clean"
# A deploy that quietly discards someone's hotfix is worse than one that stops.
# backend/data is excluded: those files are tracked, but the refresh timer
# rewrites them in place, so on a server that has ever refreshed they are
# always modified. That is expected state, not an edit someone made.
[ -z "$(git status --porcelain -- . ':(exclude)backend/data')" ] \
    || die "working tree has local changes; commit, stash or revert them first"

BEFORE="$(git rev-parse --short HEAD)"

# ---------------------------------------------------------------------------
log "Pulling $BRANCH"
git fetch --quiet origin "$BRANCH"
git checkout --quiet "$BRANCH"

# Park the refreshed data outside git for the duration of the fast-forward:
# otherwise a commit that touches backend/data cannot be merged over locally
# modified files. The server's copy is newer than anything committed, so it
# goes back afterwards.
DATA_STASH=""
if ! git diff --quiet -- backend/data; then
    DATA_STASH="$(mktemp -d)"
    cp -a backend/data/. "$DATA_STASH/"
    git checkout --quiet -- backend/data
fi

git merge --ff-only --quiet "origin/$BRANCH" || die "cannot fast-forward $BRANCH; the local branch has diverged"

if [ -n "$DATA_STASH" ]; then
    cp -a "$DATA_STASH/." backend/data/
    rm -rf "$DATA_STASH"
    echo "    kept the server's refreshed backend/data"
fi

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
# backend/data ships in the repository, so a fresh checkout already has a
# usable (if stale) snapshot and this is normally a no-op. It still matters if
# the directory was ever emptied by hand: the API cannot start without it.
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
log "Restarting $SERVICE"
cd "$ROOT"
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

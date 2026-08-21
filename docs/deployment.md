# Deploying PathwayPilot

PathwayPilot runs on a single machine. nginx serves the built frontend and proxies
`/api` to a Node process managed by systemd. A systemd timer refreshes the KEGG data
monthly, on the first Monday at 13:00.

GitHub cannot reach the server, so **deploys are pull-based**: you run a script on the
box and it fetches from GitHub. Nothing needs inbound SSH or a credential stored in the
repository.

```
                    ┌──────────────────────── the server ───────────────────────┐
                    │                                                            │
  browser ────────▶ │  nginx :80/:443                                            │
                    │    ├── /            → /opt/pathwaypilot/web/dist  (static) │
                    │    └── /api/        → 127.0.0.1:3000              (proxy)  │
                    │                             │                              │
                    │                    pathwaypilot-api.service                │
                    │                      node build/index.js                   │
                    │                             │                              │
                    │                     backend/data/  ◀── pathwaypilot-       │
                    │                     (untracked)         refresh.timer      │
                    └────────────────────────────────────────────┼───────────────┘
                                                                 ▼
                                                          rest.kegg.jp
```

The browser also calls the Unipept and EBI Proteins APIs directly; those do not go
through this server.

## Layout on the server

| path | what it is |
|---|---|
| `/opt/pathwaypilot` | the git checkout, on `main` |
| `/opt/pathwaypilot/backend/.env` | configuration — **not in git**, see `backend/.env.example` |
| `/opt/pathwaypilot/backend/build` | compiled backend, produced by `npm run build` |
| `/opt/pathwaypilot/backend/data` | KEGG data — **not in git**, server-side state |
| `/opt/pathwaypilot/web/dist` | built frontend, served by nginx |

Everything runs as an unprivileged `pathwaypilot` user that owns the checkout.

> **The machine serving pathwaypilot.ugent.be today does not use these paths yet.** Its
> nginx site is `pathwp-web` and its document root is `/var/www/pathwp-web/dist`, which is
> what `deploy/nginx.conf.example` targets. The `root` in that file, the paths in the two
> systemd units, and this table all have to name the same checkout — if the existing tree
> stays where it is instead of moving to `/opt/pathwaypilot`, change them together.

## First-time setup

Once per machine.

```bash
# 1. A service account that owns the tree
sudo useradd --system --create-home --home-dir /opt/pathwaypilot pathwaypilot
sudo -u pathwaypilot git clone https://github.com/unipept/pathway-pilot.git /opt/pathwaypilot

# 2. Configuration
cd /opt/pathwaypilot/backend
sudo -u pathwaypilot cp .env.example .env
sudo -u pathwaypilot "$EDITOR" .env          # defaults work; check PORT

# 3. systemd units
sudo cp /opt/pathwaypilot/deploy/pathwaypilot-api.service       /etc/systemd/system/
sudo cp /opt/pathwaypilot/deploy/pathwaypilot-refresh.service   /etc/systemd/system/
sudo cp /opt/pathwaypilot/deploy/pathwaypilot-refresh.timer     /etc/systemd/system/
sudo systemctl daemon-reload

# 4. nginx — the site already exists as pathwp-web; keep the same name so the
#    symlink in sites-enabled and the Certbot renewal hooks keep working.
sudo cp /opt/pathwaypilot/deploy/nginx.conf.example /etc/nginx/sites-available/pathwp-web
sudo ln -s /etc/nginx/sites-available/pathwp-web /etc/nginx/sites-enabled/   # already linked
sudo nginx -t && sudo systemctl reload nginx

# 5. First deploy — builds both halves and seeds backend/data (~3 min)
cd /opt/pathwaypilot && sudo -u pathwaypilot ./deploy/deploy.sh

# 6. Enable on boot
sudo systemctl enable --now pathwaypilot-api
sudo systemctl enable --now pathwaypilot-refresh.timer
```

## Deploying a change

```bash
cd /opt/pathwaypilot
sudo -u pathwaypilot ./deploy/deploy.sh
```

The script pulls `main`, rebuilds the backend and the frontend, seeds `backend/data` if
it is empty, restarts the API, and polls until it answers. It stops rather than
continuing if the working tree is dirty, if `main` has diverged, if `.env` is missing,
or if the API does not come back — and prints the last 40 journal lines when it does not.

It is safe to re-run, and re-running with no new commits simply rebuilds.

## The KEGG data

`backend/data/` is roughly 8 MB of tables fetched from `rest.kegg.jp`. A snapshot of it
**is tracked in git**, so a fresh checkout starts without a refresh, but on the server
those files are live state: the refresh timer rewrites them in place, which leaves the
working tree permanently modified under `backend/data`. `deploy.sh` knows this — it
ignores that directory when it checks the tree is clean, and copies the server's
(newer) files back over anything a pull brings in.

The timer refreshes it on the first Monday of each month at 13:00:

```bash
systemctl list-timers pathwaypilot-refresh.timer   # when it next runs
systemd-analyze calendar 'Mon *-*-1..7 13:00'      # confirm the schedule reads right
timedatectl                                        # OnCalendar uses the system timezone
sudo systemctl start pathwaypilot-refresh          # run it now
journalctl -u pathwaypilot-refresh -n 50           # how the last run went
```

The unit says `13:00` with no zone, which means 13:00 **local time on the server** — so
`timedatectl` must report `Europe/Brussels` for that to be 13:00 in Brussels. On systemd
252 and newer the zone can be pinned in the unit instead
(`OnCalendar=Mon *-*-1..7 13:00 Europe/Brussels`); on older systemd that line does not
parse and the timer will not load, so check `systemctl --version` before changing it.

A run makes 19 sequential requests to KEGG and takes about three minutes. Each file is
written to a temporary path and renamed into place, so an interrupted run cannot leave a
half-written file behind. The job stops at the first failure and exits non-zero, leaving
the files it had already written; the next run picks everything up again.

**The API does not reload data at runtime.** It builds its mapping tables at startup, so
a refresh only takes effect on the next restart:

```bash
sudo systemctl restart pathwaypilot-api
```

Restarting shortly after the monthly refresh is a reasonable habit; adding it to the refresh
unit is deliberately not done here, because it would make a KEGG hiccup able to bounce the API.

## Rolling back

The deploy is a git checkout, so rolling back is checking out the previous commit and
rebuilding:

```bash
cd /opt/pathwaypilot
sudo -u pathwaypilot git log --oneline -10          # find the last good commit
sudo -u pathwaypilot git checkout <sha>
cd backend && sudo -u pathwaypilot npm ci --omit=dev \
  && sudo -u pathwaypilot npm install --no-save typescript \
  && sudo -u pathwaypilot npm run build
cd ../web && sudo -u pathwaypilot npm ci && sudo -u pathwaypilot npm run build
sudo systemctl restart pathwaypilot-api
```

A rollback does move `backend/data/` back to the snapshot committed at that revision.
The data is not version-specific, so this only costs you freshness — run
`sudo systemctl start pathwaypilot-refresh` afterwards if it matters.

To get back onto the branch afterwards: `git checkout main`, then run `deploy.sh`.

## Checking on it

```bash
systemctl status pathwaypilot-api          # is it up
journalctl -u pathwaypilot-api -f          # follow the log
journalctl -u pathwaypilot-api --since '1 hour ago'
systemctl list-timers pathwaypilot-refresh.timer

curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/mapping/ec/1.1.1.1
```

There is no dedicated health endpoint yet, so the deploy script and the check above use
a cheap real request instead.

## Known rough edges

- **Startup is slow.** The API builds its mapping tables from `backend/data` before it
  answers anything — expect tens of seconds. `TimeoutStartSec=300` in the unit and the
  polling loop in `deploy.sh` both allow for it. Restarts are not instant and briefly
  return 502 through nginx.
- **Startup is noisy.** Roughly ten thousand lines of pathway ids go to stdout on every
  start, and now land in the journal. Harmless, but it makes `journalctl` less useful
  than it should be.
- **Production and development take different paths.** `npm start` runs compiled output;
  `npm run serve` runs TypeScript through ts-node for local development. Keeping ts-node
  off the production path is deliberate — a break in that toolchain took `npm run serve`
  down once already.
- **No zero-downtime deploy.** `systemctl restart` stops the old process before the new
  one is ready. Given the traffic this serves, that is a reasonable trade.

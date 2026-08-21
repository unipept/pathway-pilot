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
                    │    ├── /            → ~pathwp/pathway-pilot/web/dist     │
                    │    └── /api/        → 127.0.0.1:3000              (proxy)  │
                    │                             │                              │
                    │                    pathwaypilot-api.service                │
                    │                      node build/index.js                   │
                    │                             │                              │
                    │                     backend/data/  ◀── pathwaypilot-       │
                    │                                             refresh.timer      │
                    └────────────────────────────────────────────┼───────────────┘
                                                                 ▼
                                                          rest.kegg.jp
```

The browser also calls the Unipept and EBI Proteins APIs directly; those do not go
through this server.

## Layout on the server

| path | what it is |
|---|---|
| `/home/pathwp/pathway-pilot` | the git checkout, on `main` |
| `/home/pathwp/pathway-pilot/backend/.env` | configuration — **not in git**, see `backend/.env.example` |
| `/home/pathwp/pathway-pilot/backend/build` | compiled backend, produced by `npm run build` |
| `/home/pathwp/pathway-pilot/backend/data` | KEGG data — server-side state, see below |
| `/home/pathwp/pathway-pilot/web/dist` | built frontend, served directly by nginx |
| `/etc/nginx/sites-available/pathwp-web` | the site, symlinked into `sites-enabled` |

Everything runs as the unprivileged `pathwp` user that owns the checkout. The paths above
appear in both systemd units and in `deploy/nginx.conf.example`; they have to agree, so
move them together or not at all.

Two things the machine needs that are easy to miss:

- **A system-wide node.** systemd does not run a login shell, so nvm's node is invisible
  to it and `ExecStart=/usr/bin/node` would fail. Install Node 22 LTS from the distro or
  NodeSource; nvm stays fine for interactive work.
- **The system timezone on `Europe/Brussels`**, because the refresh timer schedules in
  local time and this host's systemd is too old to pin a zone per unit.

`/var/www/pathwp-web/dist` was the old document root — a hand-copied build, last written
in December 2024. Nothing writes there any more once the new site config is in place, and
it can be archived and deleted.

## Setting the machine up

Once per machine. The API currently runs under `forever` + `nodemon` + `ts-node` against
`src/`, started by hand; these steps replace that with systemd running compiled output.
Do them in order — the old process keeps serving until step 6, so you can stop at any
point and still have a working site.

```bash
# 1. A node systemd can see. nvm's v21.7.1 is end-of-life and only exists in
#    pathwp's shell.
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
/usr/bin/node --version                       # must print v22.x

# 2. Local time, for the refresh timer
sudo timedatectl set-timezone Europe/Brussels
timedatectl                                   # confirm

# 3. Configuration, if backend/.env is not already there
cd /home/pathwp/pathway-pilot/backend
sudo -u pathwp cp -n .env.example .env
sudo -u pathwp "$EDITOR" .env                 # defaults work; check PORT

# 4. systemd units
cd /home/pathwp/pathway-pilot
sudo cp deploy/pathwaypilot-api.service     /etc/systemd/system/
sudo cp deploy/pathwaypilot-refresh.service /etc/systemd/system/
sudo cp deploy/pathwaypilot-refresh.timer   /etc/systemd/system/
sudo systemd-analyze verify /etc/systemd/system/pathwaypilot-*.{service,timer}
sudo systemctl daemon-reload

# 5. Build once, while the old process is still serving. RESTART=0 stops the
#    script before it touches systemd — the old process still owns port 3000,
#    so starting the unit now would only fail on EADDRINUSE.
sudo -u pathwp env RESTART=0 ./deploy/deploy.sh   # env: sudoers may strip a bare VAR=

# 6. Hand over: stop the old process, start the unit
sudo -u pathwp -i forever list               # note what is running — there are two monitors
sudo -u pathwp -i forever stopall
sudo systemctl enable --now pathwaypilot-api
curl -s http://127.0.0.1:3000/health          # readiness + table sizes

# 7. nginx — same site name, so the sites-enabled symlink and the Certbot
#    renewal hooks keep working. Keep a copy of the old file first.
sudo cp /etc/nginx/sites-available/pathwp-web /root/pathwp-web.nginx.bak
sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/pathwp-web
sudo nginx -t && sudo systemctl reload nginx

# 8. The monthly refresh
sudo systemctl enable --now pathwaypilot-refresh.timer
systemctl list-timers pathwaypilot-refresh.timer
```

Check anything that started the old process on boot — a `@reboot` crontab line for
`pathwp`, or a `forever` service — and remove it, or it will fight the unit for port 3000
after the next reboot.

If step 7 leaves the site serving 403s, nginx cannot traverse into the checkout:

```bash
sudo -u www-data ls /home/pathwp/pathway-pilot/web/dist   # must list the build
sudo chmod o+x /home/pathwp /home/pathwp/pathway-pilot    # if it cannot
```

## Deploying a change

```bash
cd /home/pathwp/pathway-pilot
sudo -u pathwp ./deploy/deploy.sh
```

The script pulls `main`, rebuilds the backend and the frontend, seeds `backend/data` if
it is empty, restarts the API, and polls until it answers. It stops rather than
continuing if the working tree is dirty, if `main` has diverged, if `.env` is missing,
or if the API does not come back — and prints the last 40 journal lines when it does not.

It is safe to re-run, and re-running with no new commits simply rebuilds.

## The KEGG data

`backend/data/` is roughly 8 MB of tables fetched from `rest.kegg.jp`. It is **not
tracked in git** (gitignored at `backend/.gitignore:7`) — it is server-side state,
seeded by `npm run refresh-data` and rewritten in place monthly by the timer.
`deploy.sh` already calls `npm run refresh-data` when `data/` is empty, so a fresh
checkout seeds itself on first deploy. Being untracked also means it is simply invisible
to git: there is nothing for a pull to conflict with and nothing for the tree-cleanliness
check to trip over.

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
cd /home/pathwp/pathway-pilot
sudo -u pathwp git log --oneline -10          # find the last good commit
sudo -u pathwp git checkout <sha>
cd backend && sudo -u pathwp npm ci --omit=dev \
  && sudo -u pathwp npm install --no-save typescript \
  && sudo -u pathwp npm run build
cd ../web && sudo -u pathwp npm ci && sudo -u pathwp npm run build
sudo systemctl restart pathwaypilot-api
```

A rollback does **not** touch `backend/data/` — it is untracked, so a checkout leaves it
exactly as it is. No refresh is needed afterwards.

To get back onto the branch afterwards: `git checkout main`, then run `deploy.sh`.

A rollback leaves the built frontend at whatever the last build produced, so run the
frontend build (or `deploy.sh`) rather than only restarting the API.

## Checking on it

```bash
systemctl status pathwaypilot-api          # is it up
journalctl -u pathwaypilot-api -f          # follow the log
journalctl -u pathwaypilot-api --since '1 hour ago'
systemctl list-timers pathwaypilot-refresh.timer

curl -s http://127.0.0.1:3000/health          # readiness + table sizes
```

`GET /health` reports readiness and the size of each mapping table:

```json
{"status":"ok","uptimeSeconds":41,
 "maps":{"compound":19863,"ec":8452,"ko":26934,"module":478,"pathway":563,"reaction":12871}}
```

It answers 200 when every table has entries and 503 when one is empty. The counts are the
useful part day to day: a KEGG refresh that half-failed leaves the service up and answering,
but with tables smaller than they were, and this is where that shows.

## Known rough edges

- **Startup is slow.** The API builds its mapping tables from `backend/data` before it
  answers anything — expect tens of seconds. `TimeoutStartSec=300` in the unit and the
  polling loop in `deploy.sh` both allow for it. Restarts are not instant and briefly
  return 502 through nginx.

- **Production and development take different paths.** `npm start` runs compiled output;
  `npm run serve` runs TypeScript through ts-node for local development. Keeping ts-node
  off the production path is deliberate — a break in that toolchain took `npm run serve`
  down once already.
- **Two node installs.** systemd and `deploy.sh` use `/usr/bin/node`; an interactive
  `pathwp` shell gets nvm's. Check `/usr/bin/node --version` before blaming a build for
  something a version difference explains.
- **No zero-downtime deploy.** `systemctl restart` stops the old process before the new
  one is ready. Given the traffic this serves, that is a reasonable trade.

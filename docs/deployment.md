# Deployment Notes

## Local Development

```bash
docker compose -f infra/docker-compose.yml up -d
npm install
npm run dev
```

## Simple MVP Deployment

Option A:

- One VPS
- Node backend
- Static frontend
- PostgreSQL on the same server
- HTTPS through Nginx or Caddy

Option B:

- Frontend on Vercel or Cloudflare Pages
- Backend on a small server
- Managed PostgreSQL

## Tencent Cloud CVM

The production layout is:

```text
Internet -> Nginx :80/:443
  /              -> /var/www/draughtsone (Vite build)
  /api/*         -> Fastify on 127.0.0.1:4000
  /socket.io/*   -> Socket.IO on 127.0.0.1:4000
Fastify          -> PostgreSQL on 127.0.0.1:5432
Fastify          -> scan_linux Hub subprocess
```

Only ports 22, 80, and 443 should be reachable through the Tencent Cloud
security group. Do not expose port 4000 or the Scan DXP port.

### First deployment

The repository is deployed at `/home/ubuntu/DraughtsOne-main`. Preserve the
server-provided `scan_linux`, `scan.ini`, and `data/` files when updating the
application source.

Install Nginx and Docker once if they are not already present:

```bash
sudo apt-get update
sudo apt-get install -y nginx
# Install Docker Engine and its Compose plugin using Docker's Ubuntu guide.
```

Create the production environment:

```bash
cd /home/ubuntu/DraughtsOne-main
cp .env.production.example .env.production
chmod 600 .env.production
```

Replace `JWT_SECRET` with a random value:

```bash
openssl rand -hex 32
```

For initial IP access, leave:

```text
WEB_ORIGIN=http://43.139.202.182
```

Deploy:

```bash
chmod +x infra/deploy-tencent.sh
./infra/deploy-tencent.sh
```

### Verification

```bash
curl http://127.0.0.1:4000/health
curl http://127.0.0.1/api/health
systemctl status draughtsone --no-pager
journalctl -u draughtsone -n 100 --no-pager
```

Test Scan through the API:

```bash
node - <<'NODE'
const board = Array.from({ length: 10 }, () => Array(10).fill(null));
for (let row = 0; row < 10; row += 1) {
  for (let col = 0; col < 10; col += 1) {
    if ((row + col) % 2 === 0) continue;
    if (row < 4) board[row][col] = { id: `b-${row}-${col}`, color: "black", kind: "man" };
    if (row > 5) board[row][col] = { id: `w-${row}-${col}`, color: "white", kind: "man" };
  }
}
fetch("http://127.0.0.1:4000/ai/best-move", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ state: { board, turn: "white", ply: 0, mandatoryCapture: false }, moveTimeMs: 1000 })
}).then((response) => response.text()).then(console.log);
NODE
```

### Domain and HTTPS

After the domain points to the server, update `WEB_ORIGIN` to the exact HTTPS
origin, update `server_name` in `infra/nginx/draughtsone.conf`, deploy again,
and issue/install the TLS certificate. If the CVM is in mainland China, finish
the required ICP filing before enabling public domain access.

### Updating

Keep `.env.production`, `scan_linux`, `scan.ini`, and `data/` outside Git
changes. Pull the desired commit and run `./infra/deploy-tencent.sh` again.

Guest identities, games, and moves are persisted in PostgreSQL. The active
matchmaking queue remains in memory for the single-server MVP, so a deployment
cancels searches that have not yet produced a game.

## Required Production Settings

- `DATABASE_URL`
- `JWT_SECRET`
- `WEB_ORIGIN`
- `PORT`
- `HOST`
- `SCAN_ENGINE_PATH`
- `SCAN_MAX_PROCESSES`
- `SCAN_TIMEOUT_MS`

## Later Scaling

| Trigger | Upgrade |
| --- | --- |
| 50+ simultaneous matches | Replace memory room store with Redis |
| Multiple backend servers | Add Socket.IO Redis adapter |
| Restart must preserve matchmaking searches | Store matchmaking tickets in Redis |
| Commercial launch | Add stronger logging, audit trails, anti-cheat, and operations tooling |

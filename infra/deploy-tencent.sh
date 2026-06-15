#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${REPO_DIR:-/home/ubuntu/DraughtsOne-main}"
WEB_ROOT="${WEB_ROOT:-/var/www/draughtsone}"

cd "$REPO_DIR"

test -x "$REPO_DIR/scan_linux" || {
  echo "scan_linux is missing or is not executable at $REPO_DIR/scan_linux" >&2
  exit 1
}

test -f "$REPO_DIR/.env.production" || {
  echo ".env.production is missing. Create it from .env.production.example first." >&2
  exit 1
}

if ! grep -q '^DATABASE_URL=' "$REPO_DIR/.env.production"; then
  echo 'DATABASE_URL=postgresql://draughtsone:draughtsone@127.0.0.1:5432/draughtsone' >> "$REPO_DIR/.env.production"
fi

set -a
# shellcheck disable=SC1091
source "$REPO_DIR/.env.production"
set +a

npm ci
npm run db:generate -w @draughtsone/server

command -v docker >/dev/null 2>&1 || {
  echo "Docker is required for the PostgreSQL service. Install Docker before deploying multiplayer." >&2
  exit 1
}

sudo docker compose -f infra/docker-compose.yml up -d postgres
for attempt in {1..30}; do
  if sudo docker compose -f infra/docker-compose.yml exec -T postgres pg_isready -U draughtsone -d draughtsone >/dev/null 2>&1; then
    break
  fi
  if [[ "$attempt" == "30" ]]; then
    echo "PostgreSQL did not become ready." >&2
    exit 1
  fi
  sleep 1
done

npx prisma db push --schema apps/server/prisma/schema.prisma
npm run typecheck
npm test
npm run build

sudo mkdir -p "$WEB_ROOT"
sudo find "$WEB_ROOT" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
sudo cp -a apps/web/dist/. "$WEB_ROOT/"
sudo install -m 0644 infra/nginx/draughtsone.conf /etc/nginx/sites-available/draughtsone
sudo ln -sfn /etc/nginx/sites-available/draughtsone /etc/nginx/sites-enabled/draughtsone
sudo rm -f /etc/nginx/sites-enabled/default
sudo install -m 0644 infra/systemd/draughtsone.service /etc/systemd/system/draughtsone.service

sudo nginx -t
sudo systemctl daemon-reload
sudo systemctl enable --now draughtsone
sudo systemctl restart draughtsone
sudo systemctl enable --now nginx
sudo systemctl reload nginx

curl --fail --silent --show-error http://127.0.0.1:4000/health
echo
echo "DraughtsOne deployment completed."

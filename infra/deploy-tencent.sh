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

npm ci
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

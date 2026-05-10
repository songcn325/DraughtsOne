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

## Required Production Settings

- `DATABASE_URL`
- `JWT_SECRET`
- `WEB_ORIGIN`
- `PORT`

## Later Scaling

| Trigger | Upgrade |
| --- | --- |
| 50+ simultaneous matches | Replace memory room store with Redis |
| Multiple backend servers | Add Socket.IO Redis adapter |
| Restart must not lose active games | Persist active state more frequently |
| Commercial launch | Add stronger logging, audit trails, anti-cheat, and operations tooling |


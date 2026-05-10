# DraughtsOne MVP

DraughtsOne is a responsive web MVP for learning, training, and real-time 10x10 International Draughts matches.

This repository is intentionally structured as a collaboration scaffold. It gives frontend, backend, database, deployment, API contract, and game-engine boundaries without pretending the whole product is production-complete.

## Repository Layout

```text
apps/
  web/        React + Vite frontend prototype
  server/     Fastify + Socket.IO backend prototype
packages/
  shared/     Frontend/backend TypeScript contracts
  draughts-engine/ Pure rules engine package
docs/
  api.md
  architecture.md
  frontend-backend-contract.md
  milestone-plan.md
infra/
  docker-compose.yml
```

## MVP Priorities

1. Make the existing Google AI Studio screens real React routes.
2. Keep the frontend/backend contract explicit in `packages/shared`.
3. Keep International Draughts rules independent in `packages/draughts-engine`.
4. Provide a backend skeleton that owns live-game authority.
5. Provide database and deployment examples for early GitHub collaboration.

## Quick Start

```bash
npm install
npm run dev
```

The command above is the intended workflow after dependencies are installed. This scaffold is ready to push to GitHub and iterate with a frontend team.

## Apps

- Web app: `apps/web`
- API and realtime server: `apps/server`

## Key Documents

- API contract: `docs/api.md`
- Architecture: `docs/architecture.md`
- Frontend/backend contract notes: `docs/frontend-backend-contract.md`
- Milestone plan: `docs/milestone-plan.md`


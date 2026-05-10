# Contributing To DraughtsOne MVP

This repository is designed for early collaboration between product, frontend, backend, and game-engine work.

## Before Changing API Or Socket Contracts

1. Update `packages/shared/src/index.ts`.
2. Update `docs/api.md` or `docs/frontend-backend-contract.md`.
3. Confirm both frontend and backend still compile.

## Frontend Rules

- Start with mock data when backend work is not ready.
- Keep page code separate from API and socket clients.
- Keep visual style close to the Google AI Studio prototypes.

## Backend Rules

- Backend is authoritative for live matches.
- Validate every move with `@draughtsone/draughts-engine`.
- Keep room state behind `RoomStore`.
- Store complete move history for replay and analysis.

## Game Engine Rules

- Keep the engine pure TypeScript.
- Do not import React, Fastify, Prisma, or Socket.IO.
- Add tests for every rule edge case before relying on it in live play.


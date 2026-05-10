# DraughtsOne Shared Contracts

This folder is the frontend-backend contract source of truth.

## How To Read This Folder

- `routes.ts`: REST and web route constants.
- `errors.ts`: shared error codes and error-page view shape.
- `api/*.contract.ts`: REST request and response contracts by product area.
- `api/rest.contract.ts`: aggregate REST API map for whole-system review.
- `game/*.contract.ts`: board, move, clock, and result JSON contracts.
- `realtime/*.contract.ts`: Socket.IO event names and payloads.
- `pages/*.contract.ts`: page-level data expectations for frontend screens.
- `index.ts`: export-only entrypoint used by frontend, backend, and engine imports.

## Current MVP Function Blocks

- Username/password register and login, email password reset, and future email/SMS code login/register extension: `api/auth.contract.ts`
- User profile: `api/users.contract.ts`
- Play hall, room creation, room join, game detail, history, resign, submit move: `api/games.contract.ts`
- Realtime PK events: `realtime/socket-events.contract.ts`
- 10x10 draughts board state and moves: `game/game-state.contract.ts`, `game/moves.contract.ts`
- Learn page: `api/learn.contract.ts`
- Daily training puzzle page: `api/training.contract.ts`
- AI play style analysis page: `api/ai-analysis.contract.ts`
- Error page: `errors.ts`, `pages/page.contract.ts`

## Team Rule

If frontend and backend disagree, change these contracts first, then adjust implementation.

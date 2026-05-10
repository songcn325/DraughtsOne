# MVP Milestone Plan

## Milestone 1: UI Conversion

- Convert the Google AI Studio HTML screens into React pages.
- Extract `TopBar`, `BottomNav`, `TactileButton`, `DraughtsBoard`, `PlayerCard`, and `CreateGameModal`.
- Keep Tailwind theme values aligned with the prototype.
- Use mock data from `apps/web/src/data`.

## Milestone 2: Rules Engine

- Complete International Draughts move generation.
- Add tests for initial position, normal moves, mandatory capture, multi-capture, kings, promotion, illegal moves, and result detection.
- Keep the engine pure and reusable.

## Milestone 3: Backend and Database

- Replace demo auth with database-backed users and password hashing.
- Add Prisma migrations.
- Wire learning progress and training attempts to PostgreSQL.
- Save games and `game_moves`.

## Milestone 4: Real-Time PK

- Connect frontend Socket.IO client to backend events.
- Add create, join, ready, move, resign, and disconnect flows.
- Add authoritative match clocks.
- Add quick-match queue.

## Milestone 5: Trial Readiness

- Test on mobile browsers.
- Test 20 simultaneous online users.
- Add logging and database backup process.
- Add loading, empty, error, disconnected, and reconnecting UI states.


# DraughtsOne MVP Architecture

## Goal

The MVP is a responsive web app for learning, training, and human-vs-human 10x10 International Draughts matches.

```text
Browser / Mobile Browser
  -> React Web App
  -> REST API for account, learn, train, game history
  -> WebSocket for live PK
  -> Fastify + Socket.IO Server
  -> PostgreSQL through Prisma
```

## Monorepo Boundaries

| Area | Path | Responsibility |
| --- | --- | --- |
| Frontend | `apps/web` | Routes, UI, mock data, REST client, Socket.IO client |
| Backend | `apps/server` | Auth, users, learning, training, games, realtime room authority |
| Shared contracts | `packages/shared` | API payloads, game state JSON, socket events, error codes |
| Rules engine | `packages/draughts-engine` | Pure International Draughts logic |
| Deployment | `infra` | Local PostgreSQL and future service setup |

## Design Principle

The game engine must not import React, Fastify, Socket.IO, Prisma, or browser APIs. Frontend can use it for previews. Backend uses it as the authority.

## MVP Runtime State

Live room state starts in memory behind `RoomStore`.

Later upgrade:

```text
InMemoryRoomStore -> RedisRoomStore
Socket.IO single server -> Socket.IO Redis adapter
One backend -> API server + realtime game server
```

## Current Completion Level

This repository is an MVP communication scaffold:

- Web pages are converted into React-style routes with mock data.
- Contracts are explicit and centralized.
- Backend routes and realtime events exist.
- Prisma schema defines database shape.
- Engine supports first-pass move validation and tests.

Not complete yet:

- Production authentication and password hashing are represented but not fully wired to the database.
- Full international draughts edge cases need deeper tests.
- Match clocks need authoritative interval handling.
- Active games are not persisted continuously yet.


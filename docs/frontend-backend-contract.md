# Frontend and Backend Contract

This is the document frontend and backend teams should review together before implementation begins.

## Source Of Truth

Use `packages/shared/src/index.ts` as the source of truth for:

- `User`
- `Game`
- `GameState`
- `MovePayload`
- `ApiResponse`
- `ApiError`
- `SocketClientEvents`
- `SocketServerEvents`

## Game State JSON

`GameState` is intentionally plain JSON so it can be stored in PostgreSQL, emitted over Socket.IO, and replayed later.

Important fields:

| Field | Meaning |
| --- | --- |
| `board` | 10x10 array of `BoardPiece | null` |
| `turn` | Current player color |
| `ply` | Half-move count |
| `mandatoryCapture` | UI hint and validation signal |
| `pendingMultiCaptureFrom` | Used when multi-capture continuation is required |
| `winner` | Final winning color |
| `resultReason` | End reason |

## Move Payload

```ts
type MovePayload = {
  from: { row: number; col: number };
  to: { row: number; col: number };
  path?: Array<{ row: number; col: number }>;
  clientMoveId?: string;
};
```

Frontend can generate optimistic previews, but the backend confirms legality.

## Socket Events

Client to server:

```text
game:create
game:join
game:ready
game:move
game:resign
game:leave
matchmaking:join
matchmaking:cancel
```

Server to client:

```text
game:created
game:joined
game:started
game:state
game:moveAccepted
game:moveRejected
game:ended
game:opponentDisconnected
matchmaking:matched
error
```

## Frontend Expectations

- Render routes even when backend is unavailable by using mock data.
- Treat `game:moveAccepted` as the authoritative board update.
- Show `game:moveRejected` without changing the official state.
- Use `clientMoveId` to reconcile optimistic UI later.
- Keep page components separate from API and socket modules.

## Backend Expectations

- Validate every move through `@draughtsone/draughts-engine`.
- Broadcast accepted moves to both players.
- Persist games and move history when database wiring is completed.
- Keep live room state behind `RoomStore`.
- Do not place UI-specific state in the engine or database schema.


# REST API Contract

All responses use:

```ts
type ApiResponse<T> =
  | { ok: true; data: T; requestId?: string }
  | { ok: false; error: ApiError; requestId?: string };
```

Canonical TypeScript types live in `packages/shared/src/index.ts`.

## Authentication

### `POST /auth/register`

Request:

```json
{
  "emailOrPhone": "player@example.com",
  "password": "password",
  "displayName": "Player One"
}
```

Response data:

```ts
AuthSession
```

### `POST /auth/login`

Request:

```json
{
  "emailOrPhone": "player@example.com",
  "password": "password"
}
```

Response data:

```ts
AuthSession
```

## Current User

### `GET /me`

Response data:

```ts
User
```

### `PATCH /me`

Request:

```ts
Partial<Pick<User, "displayName" | "avatarUrl">>
```

Response data:

```ts
User
```

## Learn

### `GET /learn/path`

Response data:

```ts
LearnPath
```

### `POST /learn/lessons/:lessonId/complete`

Response data:

```json
{
  "lessonId": "rules",
  "status": "completed",
  "completedAt": "2026-05-10T00:00:00.000Z"
}
```

## Train

### `GET /train/daily`

Response data:

```ts
TrainingTask[]
```

### `POST /train/tasks/:taskId/attempt`

Request:

```ts
TrainingAttemptRequest
```

Response data:

```ts
TrainingAttemptResult
```

## Games

### `POST /games`

Request:

```ts
CreateGameRequest
```

Response data:

```ts
Game
```

### `POST /games/join`

Request:

```ts
JoinGameRequest
```

Response data:

```ts
Game
```

### `GET /games/:gameId`

Response data:

```ts
Game
```

### `GET /games/history`

Response data:

```ts
Game[]
```

### `POST /games/:gameId/resign`

Response data:

```ts
Game
```


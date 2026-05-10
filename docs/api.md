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
  "username": "playerone",
  "email": "player@example.com",
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
  "username": "playerone",
  "password": "password"
}
```

Response data:

```ts
AuthSession
```

### `POST /auth/verification-code/send`

Used for email verification now and SMS verification later.

Request:

```json
{
  "channel": "email",
  "target": "player@example.com",
  "purpose": "reset_password"
}
```

### `POST /auth/verification-code/login`

Future extension for email or SMS code login. SMS should remain disabled in the first MVP unless the team accepts message fees.

Request:

```json
{
  "channel": "sms",
  "target": "+8613800000000",
  "code": "123456"
}
```

### `POST /auth/password-reset/request`

Request:

```json
{
  "username": "playerone"
}
```

### `POST /auth/password-reset/confirm`

Request:

```json
{
  "username": "playerone",
  "code": "123456",
  "newPassword": "new-password"
}
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

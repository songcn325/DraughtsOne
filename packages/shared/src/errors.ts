export type ApiErrorCode =
  | "AUTH_REQUIRED"
  | "INVALID_CREDENTIALS"
  | "ACCOUNT_ALREADY_EXISTS"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "FORBIDDEN"
  | "RATE_LIMITED"
  | "ROOM_FULL"
  | "ROOM_NOT_READY"
  | "OPPONENT_REQUIRED"
  | "ILLEGAL_MOVE"
  | "NOT_YOUR_TURN"
  | "GAME_ALREADY_ENDED"
  | "MATCHMAKING_UNAVAILABLE"
  | "COMPUTER_OPPONENT_NOT_AVAILABLE"
  | "INTERNAL_ERROR";

export type ApiError = {
  code: ApiErrorCode;
  message: string;
  fieldErrors?: Record<string, string>;
  details?: Record<string, unknown>;
};

export type ErrorPageView = {
  statusCode: 400 | 401 | 403 | 404 | 409 | 429 | 500 | 503;
  title: string;
  message: string;
  primaryAction?: {
    label: string;
    href: string;
  };
};


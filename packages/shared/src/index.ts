export type ID = string;

export type ApiResponse<T> =
  | { ok: true; data: T; requestId?: string }
  | { ok: false; error: ApiError; requestId?: string };

export type ApiError = {
  code:
    | "AUTH_REQUIRED"
    | "INVALID_CREDENTIALS"
    | "VALIDATION_ERROR"
    | "NOT_FOUND"
    | "ROOM_FULL"
    | "ILLEGAL_MOVE"
    | "GAME_ALREADY_ENDED"
    | "INTERNAL_ERROR";
  message: string;
  details?: Record<string, unknown>;
};

export type User = {
  id: ID;
  emailOrPhone: string;
  displayName: string;
  avatarUrl?: string;
  rating: number;
  createdAt: string;
};

export type AuthSession = {
  user: User;
  accessToken: string;
};

export type RegisterRequest = {
  emailOrPhone: string;
  password: string;
  displayName: string;
};

export type LoginRequest = {
  emailOrPhone: string;
  password: string;
};

export type PatchMeRequest = Partial<Pick<User, "displayName" | "avatarUrl">>;

export type LessonNode = {
  id: string;
  unitId: string;
  title: string;
  status: "locked" | "available" | "completed";
  icon: string;
};

export type LearnPath = {
  units: Array<{
    id: string;
    title: string;
    subtitle: string;
    nodes: LessonNode[];
  }>;
};

export type TrainingTask = {
  id: ID;
  type: "puzzle" | "drill" | "endgame";
  title: string;
  boardPosition: GameState;
  solution: MovePayload[];
  difficulty: "beginner" | "intermediate" | "advanced";
  activeDate: string;
};

export type TrainingAttemptRequest = {
  movePayloads: MovePayload[];
  elapsedMs: number;
};

export type TrainingAttemptResult = {
  result: "success" | "failed";
  attemptCount: number;
  completedAt?: string;
};

export type PlayerColor = "white" | "black";
export type PieceKind = "man" | "king";
export type GameStatus = "waiting" | "ready" | "active" | "ended";
export type ResultReason = "win" | "draw" | "resignation" | "timeout" | "disconnect";

export type BoardPoint = {
  row: number;
  col: number;
};

export type BoardPiece = {
  id: string;
  color: PlayerColor;
  kind: PieceKind;
};

export type BoardSquare = BoardPiece | null;

export type GameState = {
  board: BoardSquare[][];
  turn: PlayerColor;
  ply: number;
  mandatoryCapture: boolean;
  pendingMultiCaptureFrom?: BoardPoint;
  winner?: PlayerColor;
  resultReason?: ResultReason;
};

export type MovePayload = {
  from: BoardPoint;
  to: BoardPoint;
  path?: BoardPoint[];
  clientMoveId?: string;
};

export type Game = {
  id: ID;
  roomCode: string;
  status: GameStatus;
  playerWhiteId?: ID;
  playerBlackId?: ID;
  state: GameState;
  timeControl: {
    initialSeconds: number;
    incrementSeconds: number;
  };
  startedAt?: string;
  endedAt?: string;
  winnerId?: ID;
  resultReason?: ResultReason;
};

export type GameMove = {
  id: ID;
  gameId: ID;
  moveNumber: number;
  playerId: ID;
  payload: MovePayload;
  boardStateAfter: GameState;
  createdAt: string;
};

export type CreateGameRequest = {
  timeControl?: Game["timeControl"];
  visibility: "private" | "quick_match";
};

export type JoinGameRequest = {
  roomCode: string;
};

export type SocketClientEvents = {
  "game:create": (payload: CreateGameRequest) => void;
  "game:join": (payload: JoinGameRequest) => void;
  "game:ready": (payload: { gameId: ID }) => void;
  "game:move": (payload: { gameId: ID; move: MovePayload }) => void;
  "game:resign": (payload: { gameId: ID }) => void;
  "game:leave": (payload: { gameId: ID }) => void;
  "matchmaking:join": () => void;
  "matchmaking:cancel": () => void;
};

export type SocketServerEvents = {
  "game:created": (payload: { game: Game; inviteLink: string }) => void;
  "game:joined": (payload: { game: Game }) => void;
  "game:started": (payload: { game: Game }) => void;
  "game:state": (payload: { game: Game }) => void;
  "game:moveAccepted": (payload: { game: Game; move: GameMove }) => void;
  "game:moveRejected": (payload: { gameId: ID; error: ApiError }) => void;
  "game:ended": (payload: { game: Game }) => void;
  "game:opponentDisconnected": (payload: { gameId: ID; reconnectWindowSeconds: number }) => void;
  "matchmaking:matched": (payload: { game: Game }) => void;
  error: (payload: ApiError) => void;
};


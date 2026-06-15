import type { ApiError } from "../errors.js";
import type {
  CreateGameRequest,
  CreateGameResult,
  Game,
  JoinGameRequest,
  JoinGameResult,
  SubmitMoveResult
} from "../api/games.contract.js";
import type { ID, ISODateTime } from "../common.js";
import type { TimeControl } from "../api/games.contract.js";
import type { MovePayload } from "../game/moves.contract.js";

export const SOCKET_EVENTS = {
  client: {
    gameCreate: "game:create",
    gameJoin: "game:join",
    gameReady: "game:ready",
    gameMove: "game:move",
    gameResign: "game:resign",
    gameLeave: "game:leave",
    matchmakingJoin: "matchmaking:join",
    matchmakingCancel: "matchmaking:cancel"
  },
  server: {
    gameCreated: "game:created",
    gameJoined: "game:joined",
    gameStarted: "game:started",
    gameState: "game:state",
    gameMoveAccepted: "game:moveAccepted",
    gameMoveRejected: "game:moveRejected",
    gameEnded: "game:ended",
    opponentDisconnected: "game:opponentDisconnected",
    matchmakingMatched: "matchmaking:matched",
    matchmakingStatus: "matchmaking:status",
    matchmakingCancelled: "matchmaking:cancelled",
    matchmakingTimedOut: "matchmaking:timedOut",
    error: "error"
  }
} as const;

export type GameReadyPayload = {
  gameId: ID;
};

export type GameMovePayload = {
  gameId: ID;
  move: MovePayload;
};

export type GameIdPayload = {
  gameId: ID;
};

export type MoveRejectedPayload = {
  gameId: ID;
  error: ApiError;
};

export type OpponentDisconnectedPayload = {
  gameId: ID;
  reconnectWindowSeconds: number;
};

export type MatchmakingJoinPayload = {
  timeControl: TimeControl;
};

export type MatchmakingStatusPayload = {
  status: "searching" | "delayed";
  queuedAt: ISODateTime;
  expiresAt: ISODateTime;
  waitedSeconds: number;
};

export type SocketClientEvents = {
  "game:create": (payload: CreateGameRequest) => void;
  "game:join": (payload: JoinGameRequest) => void;
  "game:ready": (payload: GameReadyPayload) => void;
  "game:move": (payload: GameMovePayload) => void;
  "game:resign": (payload: GameIdPayload) => void;
  "game:leave": (payload: GameIdPayload) => void;
  "matchmaking:join": (payload: MatchmakingJoinPayload) => void;
  "matchmaking:cancel": () => void;
};

export type SocketServerEvents = {
  "game:created": (payload: CreateGameResult) => void;
  "game:joined": (payload: JoinGameResult) => void;
  "game:started": (payload: { game: Game }) => void;
  "game:state": (payload: { game: Game; moves?: SubmitMoveResult["move"][] }) => void;
  "game:moveAccepted": (payload: SubmitMoveResult) => void;
  "game:moveRejected": (payload: MoveRejectedPayload) => void;
  "game:ended": (payload: { game: Game }) => void;
  "game:opponentDisconnected": (payload: OpponentDisconnectedPayload) => void;
  "matchmaking:matched": (payload: JoinGameResult) => void;
  "matchmaking:status": (payload: MatchmakingStatusPayload) => void;
  "matchmaking:cancelled": () => void;
  "matchmaking:timedOut": (payload: MatchmakingStatusPayload) => void;
  error: (payload: ApiError) => void;
};

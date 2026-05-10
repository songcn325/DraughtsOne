import type { ApiError } from "../errors";
import type {
  CreateGameRequest,
  CreateGameResult,
  Game,
  JoinGameRequest,
  JoinGameResult,
  SubmitMoveResult
} from "../api/games.contract";
import type { ID } from "../common";
import type { MovePayload } from "../game/moves.contract";

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

export type SocketClientEvents = {
  "game:create": (payload: CreateGameRequest) => void;
  "game:join": (payload: JoinGameRequest) => void;
  "game:ready": (payload: GameReadyPayload) => void;
  "game:move": (payload: GameMovePayload) => void;
  "game:resign": (payload: GameIdPayload) => void;
  "game:leave": (payload: GameIdPayload) => void;
  "matchmaking:join": () => void;
  "matchmaking:cancel": () => void;
};

export type SocketServerEvents = {
  "game:created": (payload: CreateGameResult) => void;
  "game:joined": (payload: JoinGameResult) => void;
  "game:started": (payload: { game: Game }) => void;
  "game:state": (payload: { game: Game }) => void;
  "game:moveAccepted": (payload: SubmitMoveResult) => void;
  "game:moveRejected": (payload: MoveRejectedPayload) => void;
  "game:ended": (payload: { game: Game }) => void;
  "game:opponentDisconnected": (payload: OpponentDisconnectedPayload) => void;
  "matchmaking:matched": (payload: JoinGameResult) => void;
  error: (payload: ApiError) => void;
};


import type { ApiEndpoint, EmptyRequest, ID, ISODateTime, PaginatedResponse } from "../common";
import type { User } from "./auth.contract";
import type { GameState, GameStatus, PlayerColor, ResultReason } from "../game/game-state.contract";
import type { GameMove, MovePayload } from "../game/moves.contract";

export type OpponentType = "human" | "computer";
export type GameVisibility = "private" | "quick_match";
export type ComputerDifficulty = "beginner" | "intermediate" | "advanced";

export type TimeControl = {
  initialSeconds: number;
  incrementSeconds: number;
};

export type GamePlayer = {
  userId: ID;
  displayName: string;
  avatarUrl?: string;
  rating: number;
  color: PlayerColor;
  isComputer?: boolean;
};

export type Game = {
  id: ID;
  roomCode: string;
  status: GameStatus;
  opponentType: OpponentType;
  visibility: GameVisibility;
  playerWhiteId?: ID;
  playerBlackId?: ID;
  players?: GamePlayer[];
  state: GameState;
  timeControl: TimeControl;
  startedAt?: ISODateTime;
  endedAt?: ISODateTime;
  winnerId?: ID;
  resultReason?: ResultReason;
};

export type GameHallView = {
  currentUser: Pick<User, "id" | "displayName" | "avatarUrl" | "rating">;
  onlineCount: number;
  activeRoomCount: number;
  quickMatchAvailable: boolean;
  computerPlayAvailable: boolean;
  suggestedTimeControls: TimeControl[];
  recentGames: GameSummary[];
};

export type GameSummary = {
  id: ID;
  roomCode: string;
  status: GameStatus;
  opponentName: string;
  resultLabel?: string;
  playedAt?: ISODateTime;
};

export type CreateGameRequest = {
  opponentType: OpponentType;
  visibility: GameVisibility;
  timeControl?: TimeControl;
  computerDifficulty?: ComputerDifficulty;
};

export type CreateGameResult = {
  game: Game;
  inviteLink?: string;
};

export type JoinGameRequest = {
  roomCode: string;
};

export type JoinGameResult = {
  game: Game;
  assignedColor: PlayerColor;
};

export type GameDetailView = {
  game: Game;
  moves: GameMove[];
  viewerColor?: PlayerColor;
  canMove: boolean;
};

export type SubmitMoveRequest = {
  move: MovePayload;
};

export type SubmitMoveResult = {
  game: Game;
  move: GameMove;
};

export type ResignGameResult = {
  game: Game;
};

export type GamesApiContract = {
  "GET /games/hall": ApiEndpoint<EmptyRequest, GameHallView>;
  "POST /games": ApiEndpoint<CreateGameRequest, CreateGameResult>;
  "POST /games/join": ApiEndpoint<JoinGameRequest, JoinGameResult>;
  "GET /games/:gameId": ApiEndpoint<EmptyRequest, GameDetailView>;
  "GET /games/history": ApiEndpoint<EmptyRequest, PaginatedResponse<GameSummary>>;
  "POST /games/:gameId/moves": ApiEndpoint<SubmitMoveRequest, SubmitMoveResult>;
  "POST /games/:gameId/resign": ApiEndpoint<EmptyRequest, ResignGameResult>;
};


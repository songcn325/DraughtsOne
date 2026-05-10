import type { ID, ISODateTime } from "../common";

export type PlayerColor = "white" | "black";
export type PieceKind = "man" | "king";
export type GameStatus = "waiting" | "ready" | "active" | "paused" | "ended";
export type ResultReason = "win" | "draw" | "resignation" | "timeout" | "disconnect" | "forfeit";

export type BoardPoint = {
  row: number;
  col: number;
};

export type BoardPiece = {
  id: ID;
  color: PlayerColor;
  kind: PieceKind;
};

export type BoardSquare = BoardPiece | null;

export type ClockState = {
  whiteSecondsRemaining: number;
  blackSecondsRemaining: number;
  lastStartedAt?: ISODateTime;
};

export type GameState = {
  board: BoardSquare[][];
  turn: PlayerColor;
  ply: number;
  mandatoryCapture: boolean;
  pendingMultiCaptureFrom?: BoardPoint;
  clock?: ClockState;
  winner?: PlayerColor;
  resultReason?: ResultReason;
};


import type { ID, ISODateTime } from "../common";
import type { BoardPoint, GameState } from "./game-state.contract";

export type MovePayload = {
  from: BoardPoint;
  to: BoardPoint;
  path?: BoardPoint[];
  clientMoveId?: string;
};

export type GameMove = {
  id: ID;
  gameId: ID;
  moveNumber: number;
  playerId: ID;
  payload: MovePayload;
  boardStateAfter: GameState;
  createdAt: ISODateTime;
};


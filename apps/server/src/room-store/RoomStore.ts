import type { Game, ID } from "@draughtsone/shared";

export interface RoomStore {
  createRoom(game: Game): Promise<Game>;
  getRoom(gameId: ID): Promise<Game | undefined>;
  getRoomByCode(roomCode: string): Promise<Game | undefined>;
  updateRoom(game: Game): Promise<Game>;
  deleteRoom(gameId: ID): Promise<void>;
  listRooms(): Promise<Game[]>;
}


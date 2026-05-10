import type { Game, ID } from "@draughtsone/shared";
import type { RoomStore } from "./RoomStore.js";

export class InMemoryRoomStore implements RoomStore {
  private rooms = new Map<ID, Game>();

  async createRoom(game: Game): Promise<Game> {
    this.rooms.set(game.id, game);
    return game;
  }

  async getRoom(gameId: ID): Promise<Game | undefined> {
    return this.rooms.get(gameId);
  }

  async getRoomByCode(roomCode: string): Promise<Game | undefined> {
    return [...this.rooms.values()].find((game) => game.roomCode === roomCode);
  }

  async updateRoom(game: Game): Promise<Game> {
    this.rooms.set(game.id, game);
    return game;
  }

  async deleteRoom(gameId: ID): Promise<void> {
    this.rooms.delete(gameId);
  }

  async listRooms(): Promise<Game[]> {
    return [...this.rooms.values()];
  }
}


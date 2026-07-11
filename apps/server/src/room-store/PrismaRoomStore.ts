import type { Game, GameMove, GamePlayer, GameState, ID, TimeControl } from "@draughtsone/shared";
import { prisma } from "../db/prisma.js";
import type { RoomStore } from "./RoomStore.js";

const gameInclude = {
  playerWhite: true,
  playerBlack: true
};

type StoredUser = {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  rating: number;
};

type StoredGame = {
  id: string;
  roomCode: string;
  status: string;
  opponentType: string;
  visibility: string;
  playerWhiteId: string | null;
  playerBlackId: string | null;
  winnerId: string | null;
  resultReason: string | null;
  timeControl: unknown;
  state: unknown;
  startedAt: Date | null;
  endedAt: Date | null;
  playerWhite: StoredUser | null;
  playerBlack: StoredUser | null;
};

function playerView(user: StoredGame["playerWhite"], color: "white" | "black"): GamePlayer | undefined {
  if (!user) return undefined;
  return {
    userId: user.id,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl ?? undefined,
    rating: user.rating,
    color
  };
}

function toGame(game: StoredGame): Game {
  return {
    id: game.id,
    roomCode: game.roomCode,
    status: game.status as Game["status"],
    opponentType: game.opponentType as Game["opponentType"],
    visibility: game.visibility as Game["visibility"],
    playerWhiteId: game.playerWhiteId ?? undefined,
    playerBlackId: game.playerBlackId ?? undefined,
    players: [
      playerView(game.playerWhite, "white"),
      playerView(game.playerBlack, "black")
    ].filter((player): player is GamePlayer => Boolean(player)),
    state: game.state as unknown as GameState,
    timeControl: game.timeControl as unknown as TimeControl,
    startedAt: game.startedAt?.toISOString(),
    endedAt: game.endedAt?.toISOString(),
    winnerId: game.winnerId ?? undefined,
    resultReason: game.resultReason as Game["resultReason"]
  };
}

export class PrismaRoomStore implements RoomStore {
  async createRoom(game: Game): Promise<Game> {
    return toGame(await prisma.game.create({
      data: {
        id: game.id,
        roomCode: game.roomCode,
        status: game.status,
        opponentType: game.opponentType,
        visibility: game.visibility,
        playerWhiteId: game.playerWhiteId,
        playerBlackId: game.playerBlackId,
        winnerId: game.winnerId,
        resultReason: game.resultReason,
        timeControl: game.timeControl,
        state: game.state,
        startedAt: game.startedAt,
        endedAt: game.endedAt
      },
      include: gameInclude
    }));
  }

  async getRoom(gameId: ID): Promise<Game | undefined> {
    const game = await prisma.game.findUnique({ where: { id: gameId }, include: gameInclude });
    return game ? toGame(game) : undefined;
  }

  async getRoomByCode(roomCode: string): Promise<Game | undefined> {
    const game = await prisma.game.findUnique({ where: { roomCode }, include: gameInclude });
    return game ? toGame(game) : undefined;
  }

  async updateRoom(game: Game): Promise<Game> {
    return toGame(await prisma.game.update({
      where: { id: game.id },
      data: {
        status: game.status,
        playerWhiteId: game.playerWhiteId,
        playerBlackId: game.playerBlackId,
        winnerId: game.winnerId,
        resultReason: game.resultReason,
        state: game.state,
        startedAt: game.startedAt,
        endedAt: game.endedAt
      },
      include: gameInclude
    }));
  }

  async deleteRoom(gameId: ID): Promise<void> {
    await prisma.game.delete({ where: { id: gameId } });
  }

  async listRooms(): Promise<Game[]> {
    const games = await prisma.game.findMany({ include: gameInclude, orderBy: { createdAt: "desc" } });
    return games.map(toGame);
  }

  async addMove(move: GameMove): Promise<GameMove> {
    const stored = await prisma.gameMove.create({
      data: {
        id: move.id,
        gameId: move.gameId,
        moveNumber: move.moveNumber,
        playerId: move.playerId,
        movePayloadJson: move.payload,
        boardStateAfter: move.boardStateAfter,
        createdAt: move.createdAt
      }
    });
    return {
      id: stored.id,
      gameId: stored.gameId,
      moveNumber: stored.moveNumber,
      playerId: stored.playerId,
      payload: stored.movePayloadJson as GameMove["payload"],
      boardStateAfter: stored.boardStateAfter as unknown as GameState,
      createdAt: stored.createdAt.toISOString()
    };
  }

  async listMoves(gameId: ID): Promise<GameMove[]> {
    const moves = await prisma.gameMove.findMany({ where: { gameId }, orderBy: { moveNumber: "asc" } });
    return moves.map((move: {
      id: string;
      gameId: string;
      moveNumber: number;
      playerId: string;
      movePayloadJson: unknown;
      boardStateAfter: unknown;
      createdAt: Date;
    }) => ({
      id: move.id,
      gameId: move.gameId,
      moveNumber: move.moveNumber,
      playerId: move.playerId,
      payload: move.movePayloadJson as GameMove["payload"],
      boardStateAfter: move.boardStateAfter as unknown as GameState,
      createdAt: move.createdAt.toISOString()
    }));
  }
}

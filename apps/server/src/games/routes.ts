import type { FastifyInstance } from "fastify";
import type { CreateGameRequest, GameMove, JoinGameRequest } from "@draughtsone/shared";
import { applyMove } from "@draughtsone/draughts-engine";
import { createGame } from "./createGame.js";
import type { RoomStore } from "../room-store/RoomStore.js";

export function registerGameRoutes(app: FastifyInstance, roomStore: RoomStore) {
  app.post<{ Body: CreateGameRequest }>("/games", async (request) => {
    const game = await roomStore.createRoom(createGame(request.body));
    return { ok: true, data: { game, inviteLink: `/play?roomCode=${game.roomCode}` } };
  });

  app.post<{ Body: JoinGameRequest }>("/games/join", async (request) => {
    const game = await roomStore.getRoomByCode(request.body.roomCode);
    if (!game) return { ok: false, error: { code: "NOT_FOUND", message: "Room code was not found." } };
    if (game.playerBlackId) return { ok: false, error: { code: "ROOM_FULL", message: "Room already has two players." } };
    const updated = await roomStore.updateRoom({ ...game, playerBlackId: "demo-opponent", status: "ready" });
    return { ok: true, data: { game: updated, assignedColor: "black" } };
  });

  app.get<{ Params: { gameId: string } }>("/games/:gameId", async (request) => {
    const game = await roomStore.getRoom(request.params.gameId);
    if (!game) return { ok: false, error: { code: "NOT_FOUND", message: "Game was not found." } };
    return { ok: true, data: { game, moves: [], viewerColor: "white", canMove: game.state.turn === "white" } };
  });

  app.get("/games/history", async () => {
    const rooms = await roomStore.listRooms();
    return {
      ok: true,
      data: {
        items: rooms.map((game) => ({
          id: game.id,
          roomCode: game.roomCode,
          status: game.status,
          opponentName: game.playerBlackId ? "Opponent" : "Waiting player",
          resultLabel: game.resultReason,
          playedAt: game.endedAt ?? game.startedAt
        })),
        page: 1,
        pageSize: 20,
        total: rooms.length
      }
    };
  });

  app.post<{ Params: { gameId: string } }>("/games/:gameId/resign", async (request) => {
    const game = await roomStore.getRoom(request.params.gameId);
    if (!game) return { ok: false, error: { code: "NOT_FOUND", message: "Game was not found." } };
    const ended = { ...game, status: "ended" as const, resultReason: "resignation" as const, endedAt: new Date().toISOString() };
    await roomStore.updateRoom(ended);
    return { ok: true, data: { game: ended } };
  });

  app.post<{ Params: { gameId: string }; Body: GameMove["payload"] }>("/games/:gameId/moves/dev", async (request) => {
    const game = await roomStore.getRoom(request.params.gameId);
    if (!game) return { ok: false, error: { code: "NOT_FOUND", message: "Game was not found." } };
    try {
      const nextState = applyMove(game.state, request.body);
      const updated = await roomStore.updateRoom({ ...game, state: nextState, status: nextState.winner ? "ended" : "active" });
      return { ok: true, data: updated };
    } catch (error) {
      return { ok: false, error: { code: "ILLEGAL_MOVE", message: error instanceof Error ? error.message : "Move rejected." } };
    }
  });
}

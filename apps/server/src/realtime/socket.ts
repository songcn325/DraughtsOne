import { applyMove } from "@draughtsone/draughts-engine";
import type { GameMove, SocketClientEvents, SocketServerEvents } from "@draughtsone/shared";
import type { Server } from "socket.io";
import { createGame } from "../games/createGame.js";
import type { RoomStore } from "../room-store/RoomStore.js";

export function registerRealtimeHandlers(io: Server<SocketClientEvents, SocketServerEvents>, roomStore: RoomStore) {
  io.on("connection", (socket) => {
    socket.on("game:create", async (payload) => {
      const game = await roomStore.createRoom(createGame(payload));
      socket.join(game.id);
      socket.emit("game:created", { game, inviteLink: `/play?roomCode=${game.roomCode}` });
    });

    socket.on("game:join", async ({ roomCode }) => {
      const game = await roomStore.getRoomByCode(roomCode);
      if (!game) return socket.emit("error", { code: "NOT_FOUND", message: "Room code was not found." });
      if (game.playerBlackId) return socket.emit("error", { code: "ROOM_FULL", message: "Room already has two players." });

      const updated = await roomStore.updateRoom({ ...game, playerBlackId: "socket-player", status: "ready" });
      socket.join(updated.id);
      io.to(updated.id).emit("game:joined", { game: updated });
    });

    socket.on("game:ready", async ({ gameId }) => {
      const game = await roomStore.getRoom(gameId);
      if (!game) return socket.emit("error", { code: "NOT_FOUND", message: "Game was not found." });
      const started = await roomStore.updateRoom({ ...game, status: "active", startedAt: new Date().toISOString() });
      io.to(gameId).emit("game:started", { game: started });
    });

    socket.on("game:move", async ({ gameId, move }) => {
      const game = await roomStore.getRoom(gameId);
      if (!game) return socket.emit("game:moveRejected", { gameId, error: { code: "NOT_FOUND", message: "Game was not found." } });

      try {
        const nextState = applyMove(game.state, move);
        const updated = await roomStore.updateRoom({ ...game, state: nextState, status: nextState.winner ? "ended" : "active" });
        const moveRecord: GameMove = {
          id: crypto.randomUUID(),
          gameId,
          moveNumber: nextState.ply,
          playerId: "socket-player",
          payload: move,
          boardStateAfter: nextState,
          createdAt: new Date().toISOString()
        };
        io.to(gameId).emit("game:moveAccepted", { game: updated, move: moveRecord });
        if (nextState.winner) io.to(gameId).emit("game:ended", { game: updated });
      } catch (error) {
        socket.emit("game:moveRejected", {
          gameId,
          error: { code: "ILLEGAL_MOVE", message: error instanceof Error ? error.message : "Move rejected." }
        });
      }
    });

    socket.on("game:resign", async ({ gameId }) => {
      const game = await roomStore.getRoom(gameId);
      if (!game) return;
      const ended = await roomStore.updateRoom({ ...game, status: "ended", resultReason: "resignation", endedAt: new Date().toISOString() });
      io.to(gameId).emit("game:ended", { game: ended });
    });
  });
}


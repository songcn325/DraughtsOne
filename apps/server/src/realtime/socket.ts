import { applyMove } from "@draughtsone/draughts-engine";
import type { Game, GameMove, SocketClientEvents, SocketServerEvents } from "@draughtsone/shared";
import type { Server } from "socket.io";
import { createGame } from "../games/createGame.js";
import { MatchmakingQueue } from "../matchmaking/MatchmakingQueue.js";
import type { RoomStore } from "../room-store/RoomStore.js";

const queue = new MatchmakingQueue();
const processingGames = new Set<string>();

export function registerRealtimeHandlers(io: Server<SocketClientEvents, SocketServerEvents>, roomStore: RoomStore) {
  const statusTimer = setInterval(() => {
    const now = Date.now();
    for (const ticket of queue.getExpired(now)) {
      io.to(ticket.socketId).emit("matchmaking:timedOut", queue.getStatus(ticket, now));
    }
    for (const ticket of queue.list()) {
      io.to(ticket.socketId).emit("matchmaking:status", queue.getStatus(ticket, now));
    }
  }, 5000);
  statusTimer.unref();

  io.on("connection", (socket) => {
    const userId = socket.data.userId as string | undefined;
    const rating = Number(socket.data.rating ?? 1200);
    if (!userId) {
      socket.emit("error", { code: "AUTH_REQUIRED", message: "A guest or registered session is required." });
      socket.disconnect();
      return;
    }

    socket.on("matchmaking:join", async ({ timeControl }) => {
      const now = Date.now();
      const pair = queue.join({ socketId: socket.id, userId, rating, timeControl, queuedAtMs: now });
      if (!pair) {
        const ticket = queue.list().find((candidate) => candidate.userId === userId);
        if (ticket) socket.emit("matchmaking:status", queue.getStatus(ticket, now));
        return;
      }

      try {
        const firstIsWhite = Math.random() < 0.5;
        const white = firstIsWhite ? pair.first : pair.second;
        const black = firstIsWhite ? pair.second : pair.first;
        const game = createGame({
          opponentType: "human",
          visibility: "quick_match",
          timeControl
        }, white.userId);
        const startedAt = new Date().toISOString();
        const started = await roomStore.createRoom({
          ...game,
          playerBlackId: black.userId,
          status: "active",
          startedAt,
          state: {
            ...game.state,
            clock: {
              whiteSecondsRemaining: timeControl.initialSeconds,
              blackSecondsRemaining: timeControl.initialSeconds,
              lastStartedAt: startedAt
            }
          }
        });

        const firstSocket = io.sockets.sockets.get(pair.first.socketId);
        const secondSocket = io.sockets.sockets.get(pair.second.socketId);
        firstSocket?.join(started.id);
        secondSocket?.join(started.id);
        firstSocket?.emit("matchmaking:matched", {
          game: started,
          assignedColor: firstIsWhite ? "white" : "black"
        });
        secondSocket?.emit("matchmaking:matched", {
          game: started,
          assignedColor: firstIsWhite ? "black" : "white"
        });
        io.to(started.id).emit("game:started", { game: started });
      } catch {
        io.to(pair.first.socketId).emit("error", { code: "MATCHMAKING_UNAVAILABLE", message: "A game could not be created." });
        io.to(pair.second.socketId).emit("error", { code: "MATCHMAKING_UNAVAILABLE", message: "A game could not be created." });
      }
    });

    socket.on("matchmaking:cancel", () => {
      if (queue.cancelByUser(userId)) socket.emit("matchmaking:cancelled");
    });

    socket.on("game:create", async (payload) => {
      const game = await roomStore.createRoom(createGame(payload, userId));
      socket.join(game.id);
      socket.emit("game:created", { game, inviteLink: `/play?roomCode=${game.roomCode}` });
    });

    socket.on("game:join", async ({ roomCode }) => {
      const game = await roomStore.getRoomByCode(roomCode);
      if (!game) return socket.emit("error", { code: "NOT_FOUND", message: "Room code was not found." });
      if (game.playerBlackId && game.playerBlackId !== userId) {
        return socket.emit("error", { code: "ROOM_FULL", message: "Room already has two players." });
      }
      const updated = game.playerBlackId
        ? game
        : await roomStore.updateRoom({ ...game, playerBlackId: userId, status: "ready" });
      socket.join(updated.id);
      io.to(updated.id).emit("game:joined", { game: updated, assignedColor: "black" });
    });

    socket.on("game:ready", async ({ gameId }) => {
      const game = await roomStore.getRoom(gameId);
      if (!game) return socket.emit("error", { code: "NOT_FOUND", message: "Game was not found." });
      if (game.playerWhiteId !== userId && game.playerBlackId !== userId) {
        return socket.emit("error", { code: "FORBIDDEN", message: "You are not a player in this game." });
      }
      socket.join(gameId);
      socket.emit("game:state", { game, moves: await roomStore.listMoves(gameId) });
    });

    socket.on("game:move", async ({ gameId, move }) => {
      const game = await roomStore.getRoom(gameId);
      if (!game) return socket.emit("game:moveRejected", { gameId, error: { code: "NOT_FOUND", message: "Game was not found." } });
      if (game.status === "ended" || game.state.winner) {
        return socket.emit("game:moveRejected", { gameId, error: { code: "GAME_ALREADY_ENDED", message: "This game has ended." } });
      }
      if (processingGames.has(gameId)) {
        return socket.emit("game:moveRejected", { gameId, error: { code: "VALIDATION_ERROR", message: "Another move is being processed." } });
      }
      const expectedPlayerId = game.state.turn === "white" ? game.playerWhiteId : game.playerBlackId;
      if (expectedPlayerId !== userId) {
        return socket.emit("game:moveRejected", { gameId, error: { code: "NOT_YOUR_TURN", message: "It is not your turn." } });
      }

      processingGames.add(gameId);
      try {
        const nextState = applyMove(updateClock(game), move);
        const winnerId = nextState.winner === "white" ? game.playerWhiteId : nextState.winner === "black" ? game.playerBlackId : undefined;
        const updated = await roomStore.updateRoom({
          ...game,
          state: restartClock(nextState),
          winnerId,
          resultReason: nextState.resultReason,
          status: nextState.winner ? "ended" : "active",
          endedAt: nextState.winner ? new Date().toISOString() : undefined
        });
        const moveRecord: GameMove = {
          id: crypto.randomUUID(),
          gameId,
          moveNumber: updated.state.ply,
          playerId: userId,
          payload: move,
          boardStateAfter: updated.state,
          createdAt: new Date().toISOString()
        };
        await roomStore.addMove(moveRecord);
        io.to(gameId).emit("game:moveAccepted", { game: updated, move: moveRecord });
        if (updated.state.winner) io.to(gameId).emit("game:ended", { game: updated });
      } catch (error) {
        socket.emit("game:moveRejected", {
          gameId,
          error: { code: "ILLEGAL_MOVE", message: error instanceof Error ? error.message : "Move rejected." }
        });
      } finally {
        processingGames.delete(gameId);
      }
    });

    socket.on("game:resign", async ({ gameId }) => {
      const game = await roomStore.getRoom(gameId);
      if (!game || (game.playerWhiteId !== userId && game.playerBlackId !== userId)) return;
      const winner = game.playerWhiteId === userId ? "black" : "white";
      const winnerId = winner === "white" ? game.playerWhiteId : game.playerBlackId;
      const ended = await roomStore.updateRoom({
        ...game,
        status: "ended",
        winnerId,
        resultReason: "resignation",
        endedAt: new Date().toISOString(),
        state: { ...game.state, winner, resultReason: "resignation" }
      });
      io.to(gameId).emit("game:ended", { game: ended });
    });

    socket.on("disconnect", () => {
      queue.cancelBySocket(socket.id);
    });
  });
}

function updateClock(game: Game): Game["state"] {
  const clock = game.state.clock;
  if (!clock?.lastStartedAt) return game.state;
  const elapsed = Math.max(0, Math.floor((Date.now() - Date.parse(clock.lastStartedAt)) / 1000));
  const remainingKey = game.state.turn === "white" ? "whiteSecondsRemaining" : "blackSecondsRemaining";
  return {
    ...game.state,
    clock: {
      ...clock,
      [remainingKey]: Math.max(0, clock[remainingKey] - elapsed)
    }
  };
}

function restartClock(state: Game["state"]): Game["state"] {
  if (!state.clock || state.winner) return state;
  return { ...state, clock: { ...state.clock, lastStartedAt: new Date().toISOString() } };
}

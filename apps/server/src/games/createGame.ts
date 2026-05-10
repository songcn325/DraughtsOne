import { createInitialGameState } from "@draughtsone/draughts-engine";
import type { CreateGameRequest, Game } from "@draughtsone/shared";

export function createGame(request: CreateGameRequest, playerId = "demo-user"): Game {
  const id = crypto.randomUUID();
  return {
    id,
    roomCode: id.slice(0, 6).toUpperCase(),
    status: "waiting",
    playerWhiteId: playerId,
    state: createInitialGameState(),
    timeControl: request.timeControl ?? { initialSeconds: 600, incrementSeconds: 0 }
  };
}


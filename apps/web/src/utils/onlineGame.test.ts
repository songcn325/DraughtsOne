import type { Game, GameMove } from "@draughtsone/shared";
import { applyMove, createInitialGameState } from "@draughtsone/draughts-engine";
import { describe, expect, it } from "vitest";
import { buildOnlinePdn, displayedClockSeconds } from "./onlineGame";

const game = {
  id: "game",
  roomCode: "ABC123",
  status: "active",
  opponentType: "human",
  visibility: "quick_match",
  playerWhiteId: "white",
  playerBlackId: "black",
  players: [
    { userId: "white", displayName: "Alice", rating: 1200, color: "white" },
    { userId: "black", displayName: "Bob", rating: 1200, color: "black" }
  ],
  timeControl: { initialSeconds: 600, incrementSeconds: 0 },
  state: {
    ...createInitialGameState(),
    turn: "white",
    ply: 0,
    mandatoryCapture: false,
    clock: {
      whiteSecondsRemaining: 600,
      blackSecondsRemaining: 600,
      lastStartedAt: "2026-06-15T12:00:00.000Z"
    }
  }
} satisfies Game;

describe("online game helpers", () => {
  it("renders the active clock continuously from the server timestamp", () => {
    expect(displayedClockSeconds(game, "white", Date.parse("2026-06-15T12:00:09.900Z"))).toBe(591);
    expect(displayedClockSeconds(game, "black", Date.parse("2026-06-15T12:00:09.900Z"))).toBe(600);
  });

  it("exports persisted online moves as PDN", () => {
    const move = {
      id: "move",
      gameId: "game",
      moveNumber: 1,
      playerId: "white",
      payload: { from: { row: 6, col: 1 }, to: { row: 5, col: 0 } },
      boardStateAfter: applyMove(createInitialGameState(), { from: { row: 6, col: 1 }, to: { row: 5, col: 0 } }),
      createdAt: "2026-06-15T12:00:01.000Z"
    } satisfies GameMove;
    expect(buildOnlinePdn(game, [move])).toContain("1. 31-26 *");
  });
});

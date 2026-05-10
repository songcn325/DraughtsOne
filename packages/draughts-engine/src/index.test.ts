import { describe, expect, it } from "vitest";
import { applyMove, createInitialGameState, generateLegalMoves, validateMove } from "./index";

describe("draughts engine MVP", () => {
  it("creates an initial 10x10 board with 20 pieces per side", () => {
    const state = createInitialGameState();
    const pieces = state.board.flat().filter(Boolean);
    expect(state.board).toHaveLength(10);
    expect(pieces.filter((piece) => piece?.color === "white")).toHaveLength(20);
    expect(pieces.filter((piece) => piece?.color === "black")).toHaveLength(20);
  });

  it("generates opening moves for white", () => {
    const state = createInitialGameState();
    expect(generateLegalMoves(state).length).toBeGreaterThan(0);
  });

  it("rejects moving an opponent piece", () => {
    const state = createInitialGameState();
    const result = validateMove(state, { from: { row: 3, col: 0 }, to: { row: 4, col: 1 } });
    expect(result.ok).toBe(false);
  });

  it("applies a simple legal move", () => {
    const state = createInitialGameState();
    const next = applyMove(state, { from: { row: 6, col: 1 }, to: { row: 5, col: 0 } });
    expect(next.turn).toBe("black");
    expect(next.board[5][0]?.color).toBe("white");
  });
});


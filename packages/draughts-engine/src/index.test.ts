import { describe, expect, it } from "vitest";
import type { BoardSquare, GameState } from "@draughtsone/shared";
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

  it("generates the longest available multi-capture for a man", () => {
    const board: BoardSquare[][] = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => null));
    board[5][8] = { id: "white-man", color: "white", kind: "man" };
    board[4][7] = { id: "black-1", color: "black", kind: "man" };
    board[2][5] = { id: "black-2", color: "black", kind: "man" };

    const state: GameState = {
      board,
      turn: "white",
      ply: 0,
      mandatoryCapture: true
    };

    const moves = generateLegalMoves(state);
    expect(moves).toHaveLength(1);
    expect(moves[0]).toMatchObject({
      from: { row: 5, col: 8 },
      to: { row: 1, col: 4 },
      captures: [
        { row: 4, col: 7 },
        { row: 2, col: 5 }
      ],
      path: [
        { row: 5, col: 8 },
        { row: 3, col: 6 },
        { row: 1, col: 4 }
      ]
    });
  });
});

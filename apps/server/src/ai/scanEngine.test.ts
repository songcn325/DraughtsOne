import type { GameState } from "@draughtsone/shared";
import { describe, expect, it } from "vitest";
import { parseHubMove, toHubPosition } from "./scanEngine.js";

describe("Scan Hub adapter", () => {
  it("serializes the standard 10x10 starting position", () => {
    const position = toHubPosition(createInitialState());

    expect(position).toBe(`W${"b".repeat(20)}${"e".repeat(10)}${"w".repeat(20)}`);
  });

  it("maps Scan square notation to board coordinates", () => {
    expect(parseHubMove("34-30", "17-21")).toEqual({
      notation: "34-30",
      from: { row: 6, col: 7 },
      to: { row: 5, col: 8 },
      path: [
        { row: 6, col: 7 },
        { row: 5, col: 8 }
      ],
      ponder: "17-21"
    });
  });

  it("preserves every landing in a capture sequence", () => {
    expect(parseHubMove("32x23x14").path).toEqual([
      { row: 6, col: 3 },
      { row: 4, col: 5 },
      { row: 2, col: 7 }
    ]);
  });
});

function createInitialState(): GameState {
  const board: GameState["board"] = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => null));
  for (let row = 0; row < 10; row += 1) {
    for (let col = 0; col < 10; col += 1) {
      if ((row + col) % 2 === 0) continue;
      if (row < 4) board[row][col] = { id: `b-${row}-${col}`, color: "black", kind: "man" };
      if (row > 5) board[row][col] = { id: `w-${row}-${col}`, color: "white", kind: "man" };
    }
  }
  return { board, turn: "white", ply: 0, mandatoryCapture: false };
}

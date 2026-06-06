import type { GameState } from "@draughtsone/shared";
import { describe, expect, it } from "vitest";
import { parseHubInfo, parseHubMove, toHubPosition } from "./scanEngine.js";

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
      ponder: "17-21",
      principalVariation: []
    });
  });

  it("uses the second square as the capture landing square", () => {
    expect(parseHubMove("32x23x14")).toMatchObject({
      from: { row: 6, col: 3 },
      to: { row: 4, col: 5 }
    });
  });

  it("parses the final progressive analysis line", () => {
    expect(
      parseHubInfo(
        'info depth=21 mean-depth=20.9 score=-0.01 nodes=20760277 time=2.417 nps=8.6 pv="34-30 20-25 32-28"'
      )
    ).toEqual({
      depth: 21,
      meanDepth: 20.9,
      score: -0.01,
      nodes: 20760277,
      timeSeconds: 2.417,
      nodesPerSecondMillions: 8.6,
      principalVariation: ["34-30", "20-25", "32-28"]
    });
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

import { createInitialGameState } from "@draughtsone/draughts-engine";
import { describe, expect, it } from "vitest";
import { parseHubMove, toHubPosition } from "./scanEngine.js";

describe("Scan Hub adapter", () => {
  it("serializes the standard 10x10 starting position", () => {
    const position = toHubPosition(createInitialGameState());

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

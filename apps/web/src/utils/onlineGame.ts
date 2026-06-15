import type { Game, GameMove, PlayerColor } from "@draughtsone/shared";
import { createInitialGameState } from "@draughtsone/draughts-engine";

export function displayedClockSeconds(game: Game, color: PlayerColor, nowMs: number) {
  const clock = game.state.clock;
  if (!clock) return 0;
  const stored = color === "white" ? clock.whiteSecondsRemaining : clock.blackSecondsRemaining;
  if (game.status !== "active" || game.state.winner || game.state.turn !== color || !clock.lastStartedAt) return stored;
  const elapsed = Math.max(0, Math.floor((nowMs - Date.parse(clock.lastStartedAt)) / 1000));
  return Math.max(0, stored - elapsed);
}

export function buildOnlinePdn(game: Game, moves: GameMove[]) {
  const result = game.state.winner === "white" ? "2-0" : game.state.winner === "black" ? "0-2" : "*";
  const pairs: string[] = [];
  for (let index = 0; index < moves.length; index += 2) {
    const white = moveToPdn(moves[index], capturedBeforeMove(moves, index));
    const black = moves[index + 1] ? ` ${moveToPdn(moves[index + 1], capturedBeforeMove(moves, index + 1))}` : "";
    pairs.push(`${Math.floor(index / 2) + 1}. ${white}${black}`);
  }
  return [
    '[Event "DraughtsOne online game"]',
    '[Site "DraughtsOne"]',
    `[Date "${new Date().toISOString().slice(0, 10)}"]`,
    `[Round "${game.roomCode}"]`,
    `[White "${game.players?.find((player) => player.color === "white")?.displayName ?? "White"}"]`,
    `[Black "${game.players?.find((player) => player.color === "black")?.displayName ?? "Black"}"]`,
    `[Result "${result}"]`,
    "",
    `${pairs.join(" ")} ${result}`.trim()
  ].join("\n");
}

function moveToPdn(move: GameMove, isCapture: boolean) {
  const points = move.payload.path && move.payload.path.length > 1
    ? move.payload.path
    : [move.payload.from, move.payload.to];
  return points.map((point) => point.row * 5 + Math.floor(point.col / 2) + 1).join(isCapture ? "x" : "-");
}

function capturedBeforeMove(moves: GameMove[], index: number) {
  const before = index === 0 ? createInitialGameState() : moves[index - 1].boardStateAfter;
  return countPieces(moves[index].boardStateAfter) < countPieces(before);
}

function countPieces(state: GameMove["boardStateAfter"]) {
  return state.board.flat().filter(Boolean).length;
}

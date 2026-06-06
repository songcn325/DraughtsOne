import type { AiBestMoveView, BoardPoint, GameState } from "@draughtsone/shared";
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { createInterface } from "node:readline";

const BOARD_SIZE = 10;
const DEFAULT_MOVE_TIME_MS = 1_000;
const DEFAULT_TIMEOUT_MS = 10_000;

let activeProcesses = 0;

export class ScanEngineError extends Error {
  constructor(
    message: string,
    readonly code: "INVALID_POSITION" | "UNAVAILABLE" | "BUSY" | "TIMEOUT" | "PROTOCOL_ERROR"
  ) {
    super(message);
    this.name = "ScanEngineError";
  }
}

export async function findBestMove(state: GameState, requestedMoveTimeMs?: number): Promise<AiBestMoveView> {
  const enginePath = process.env.SCAN_ENGINE_PATH;
  if (!enginePath) throw new ScanEngineError("SCAN_ENGINE_PATH is not configured.", "UNAVAILABLE");

  const maxProcesses = positiveInteger(process.env.SCAN_MAX_PROCESSES, 2);
  if (activeProcesses >= maxProcesses) throw new ScanEngineError("The AI engine is currently busy.", "BUSY");

  const moveTimeMs = clamp(Math.round(requestedMoveTimeMs ?? DEFAULT_MOVE_TIME_MS), 100, 10_000);
  const timeoutMs = positiveInteger(process.env.SCAN_TIMEOUT_MS, DEFAULT_TIMEOUT_MS);
  const hubPosition = toHubPosition(state);
  const executable = resolve(enginePath);

  activeProcesses += 1;
  try {
    return await runScan(executable, hubPosition, moveTimeMs, timeoutMs);
  } finally {
    activeProcesses -= 1;
  }
}

export function toHubPosition(state: GameState): string {
  if (state.board.length !== BOARD_SIZE || state.board.some((row) => row.length !== BOARD_SIZE)) {
    throw new ScanEngineError("The board must be a 10 by 10 matrix.", "INVALID_POSITION");
  }

  let squares = "";
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      if ((row + col) % 2 === 0) continue;
      const piece = state.board[row][col];
      if (!piece) {
        squares += "e";
      } else if (piece.color === "white") {
        squares += piece.kind === "king" ? "W" : "w";
      } else {
        squares += piece.kind === "king" ? "B" : "b";
      }
    }
  }

  return `${state.turn === "white" ? "W" : "B"}${squares}`;
}

export function parseHubMove(notation: string, ponder?: string): AiBestMoveView {
  const squareNumbers = notation.split(/[-x]/).map(Number);
  if (squareNumbers.length < 2 || squareNumbers.some((square) => !Number.isInteger(square) || square < 1 || square > 50)) {
    throw new ScanEngineError(`Scan returned an invalid move: ${notation}`, "PROTOCOL_ERROR");
  }

  const from = squareToPoint(squareNumbers[0]);
  const to = squareToPoint(squareNumbers[1]);
  return {
    notation,
    from,
    to,
    path: [from, to],
    ponder,
    principalVariation: []
  };
}

function runScan(executable: string, position: string, moveTimeMs: number, timeoutMs: number): Promise<AiBestMoveView> {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(executable, ["hub"], {
      cwd: dirname(executable),
      stdio: ["pipe", "pipe", "pipe"]
    });
    const output = createInterface({ input: child.stdout });
    let stderr = "";
    let settled = false;
    let latestInfo: Partial<AiBestMoveView> = {};

    const finish = (error?: Error, result?: AiBestMoveView) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      output.close();
      if (!child.killed) {
        child.stdin.write("quit\n");
        child.kill();
      }
      if (error) rejectPromise(error);
      else if (result) resolvePromise(result);
    };

    const timer = setTimeout(
      () => finish(new ScanEngineError(`Scan did not answer within ${timeoutMs}ms.`, "TIMEOUT")),
      timeoutMs
    );

    child.once("error", (error) => {
      finish(new ScanEngineError(`Unable to start Scan: ${error.message}`, "UNAVAILABLE"));
    });
    child.once("exit", (code, signal) => {
      if (!settled) {
        const detail = stderr.trim() || `exit code ${code ?? "unknown"}, signal ${signal ?? "none"}`;
        finish(new ScanEngineError(`Scan stopped before returning a move: ${detail}`, "PROTOCOL_ERROR"));
      }
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr = `${stderr}${chunk.toString()}`.slice(-4_000);
    });

    output.on("line", (line) => {
      const trimmed = line.trim();
      if (trimmed === "wait") {
        child.stdin.write("init\n");
        return;
      }
      if (trimmed === "ready") {
        child.stdin.write(`pos pos=${position}\n`);
        child.stdin.write(`level move-time=${Math.max(1, Math.ceil(moveTimeMs / 1_000))}\n`);
        child.stdin.write("go analyze\n");
        return;
      }
      if (trimmed.startsWith("info ")) {
        latestInfo = parseHubInfo(trimmed);
        return;
      }
      if (!trimmed.startsWith("done ")) return;

      const move = trimmed.match(/\bmove=([0-9]+(?:[-x][0-9]+)+)\b/)?.[1];
      const ponder = trimmed.match(/\bponder=([0-9]+(?:[-x][0-9]+)+)\b/)?.[1];
      if (!move) {
        finish(new ScanEngineError(`Scan returned an unrecognized result: ${trimmed}`, "PROTOCOL_ERROR"));
        return;
      }
      finish(undefined, { ...parseHubMove(move, ponder), ...latestInfo });
    });

    child.stdin.write("hub\n");
  });
}

export function parseHubInfo(line: string): Partial<AiBestMoveView> {
  const principalVariation = line.match(/\bpv=(?:"([^"]*)"|(\S+))/)?.slice(1).find(Boolean)?.split(/\s+/).filter(Boolean) ?? [];
  return {
    depth: numberField(line, "depth"),
    meanDepth: numberField(line, "mean-depth"),
    score: numberField(line, "score"),
    nodes: numberField(line, "nodes"),
    timeSeconds: numberField(line, "time"),
    nodesPerSecondMillions: numberField(line, "nps"),
    principalVariation
  };
}

function squareToPoint(square: number): BoardPoint {
  const index = square - 1;
  const row = Math.floor(index / 5);
  const offset = index % 5;
  const col = offset * 2 + (row % 2 === 0 ? 1 : 0);
  return { row, col };
}

function numberField(line: string, field: string): number | undefined {
  const value = line.match(new RegExp(`\\b${field}=(-?\\d+(?:\\.\\d+)?)`))?.[1];
  return value === undefined ? undefined : Number(value);
}

function positiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

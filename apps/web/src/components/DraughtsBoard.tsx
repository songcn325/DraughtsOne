import type { BoardPiece, BoardPoint, BoardSquare, GameState } from "@draughtsone/shared";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../i18n";

type AnimatedMove = { from: BoardPoint; to: BoardPoint; path?: BoardPoint[] };

type Props = {
  state: GameState;
  orientation?: "white" | "black";
  selected?: BoardPoint;
  legalTargets?: BoardPoint[];
  latestMove?: AnimatedMove;
  bestMove?: { from: BoardPoint; to: BoardPoint };
  onSquareClick?: (point: BoardPoint) => void;
};

type MovingPiece = { piece: BoardPiece; point: BoardPoint; durationMs: number };

function samePoint(a: BoardPoint | undefined, b: BoardPoint) {
  return a?.row === b.row && a.col === b.col;
}

function orientedCoordinate(value: number, orientation: "white" | "black") {
  return orientation === "black" ? 9 - value : value;
}

function cloneBoard(board: BoardSquare[][]) {
  return board.map((row) => row.map((piece) => (piece ? { ...piece } : null)));
}

function animationRoute(move: AnimatedMove) {
  const supplied = move.path && move.path.length > 1 ? move.path : [move.from, move.to];
  const route = samePoint(supplied[0], move.from) ? supplied : [move.from, ...supplied];
  return route.filter((point, index) => index === 0 || !samePoint(route[index - 1], point));
}

function capturedPointBetween(board: BoardSquare[][], from: BoardPoint, to: BoardPoint, mover: BoardPiece) {
  const rowStep = Math.sign(to.row - from.row);
  const colStep = Math.sign(to.col - from.col);
  let row = from.row + rowStep;
  let col = from.col + colStep;
  while (row !== to.row && col !== to.col) {
    const piece = board[row]?.[col];
    if (piece && piece.color !== mover.color) return { row, col };
    row += rowStep;
    col += colStep;
  }
  return undefined;
}

function PieceToken({ piece }: { piece: BoardPiece }) {
  return (
    <div className={`grid h-full w-full place-items-center rounded-full ${piece.color === "white" ? "bg-surface shadow-[inset_0_-4px_8px_rgba(0,0,0,0.08),0_4px_6px_rgba(0,0,0,0.12)]" : "bg-gradient-to-b from-[#4a4a4a] to-[#050505] shadow-[inset_0_-4px_8px_rgba(0,0,0,0.7),0_4px_6px_rgba(0,0,0,0.28)]"}`}>
      <div className="relative h-3/5 w-3/5 rounded-full border border-white/40">
        {piece.kind === "king" && (
          <span className="absolute left-1/2 top-1/2 grid h-[82%] w-[82%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/92 shadow-[0_1px_4px_rgba(0,0,0,0.16)]">
            <span className="material-symbols-outlined fill king-symbol text-secondary-fixed" aria-hidden="true">crown</span>
          </span>
        )}
      </div>
    </div>
  );
}

export function DraughtsBoard({ state, orientation = "white", selected, legalTargets = [], latestMove, bestMove, onSquareClick }: Props) {
  const { t } = useLanguage();
  const previousState = useRef(state);
  const animationRun = useRef(0);
  const [displayBoard, setDisplayBoard] = useState<BoardSquare[][]>(state.board);
  const [movingPiece, setMovingPiece] = useState<MovingPiece>();

  useEffect(() => {
    const before = previousState.current;
    previousState.current = state;
    const run = animationRun.current + 1;
    animationRun.current = run;

    if (!latestMove || before.board === state.board) {
      setDisplayBoard(state.board);
      setMovingPiece(undefined);
      return;
    }

    const piece = before.board[latestMove.from.row]?.[latestMove.from.col];
    const route = animationRoute(latestMove);
    if (!piece || route.length < 2) {
      setDisplayBoard(state.board);
      setMovingPiece(undefined);
      return;
    }

    let cancelled = false;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const segmentDuration = reduceMotion ? 1 : 300;
    let workingBoard = cloneBoard(before.board);
    workingBoard[latestMove.from.row][latestMove.from.col] = null;
    setDisplayBoard(workingBoard);
    setMovingPiece({ piece, point: route[0], durationMs: 0 });

    const nextFrame = () => new Promise<void>((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve())));
    const pause = (durationMs: number) => new Promise<void>((resolve) => window.setTimeout(resolve, durationMs));

    void (async () => {
      await nextFrame();
      for (let index = 1; index < route.length; index += 1) {
        if (cancelled || animationRun.current !== run) return;
        const from = route[index - 1];
        const to = route[index];
        setMovingPiece({ piece, point: to, durationMs: segmentDuration });
        await pause(segmentDuration + (reduceMotion ? 0 : 70));
        if (cancelled || animationRun.current !== run) return;
        const captured = capturedPointBetween(workingBoard, from, to, piece);
        if (captured) {
          workingBoard = cloneBoard(workingBoard);
          workingBoard[captured.row][captured.col] = null;
          setDisplayBoard(workingBoard);
        }
      }
      if (cancelled || animationRun.current !== run) return;
      setMovingPiece(undefined);
      setDisplayBoard(state.board);
    })();

    return () => { cancelled = true; };
  }, [state, latestMove]);

  return (
    <div className="rounded-lg bg-surface-container-low p-3 shadow-[0_8px_24px_rgba(45,47,47,0.06)]">
      <div className="relative grid aspect-square grid-cols-10 overflow-hidden rounded-lg bg-surface-container-highest" aria-busy={Boolean(movingPiece)}>
        {Array.from({ length: 10 }, (_, displayRow) =>
          Array.from({ length: 10 }, (_, displayCol) => {
            const rowIndex = orientedCoordinate(displayRow, orientation);
            const colIndex = orientedCoordinate(displayCol, orientation);
            const piece = displayBoard[rowIndex][colIndex];
            const dark = (rowIndex + colIndex) % 2 === 1;
            const point = { row: rowIndex, col: colIndex };
            const isSelected = samePoint(selected, point);
            const isTarget = legalTargets.some((target) => samePoint(target, point));
            const isLatestMove = samePoint(latestMove?.from, point) || samePoint(latestMove?.to, point);
            return (
              <button key={`${rowIndex}-${colIndex}`} type="button" disabled={Boolean(movingPiece)} onClick={() => onSquareClick?.(point)} className={`relative aspect-square disabled:cursor-wait ${dark ? "bg-surface-container-highest" : "bg-surface-container-lowest"} ${isSelected ? "ring-4 ring-inset ring-secondary-fixed" : ""}`} aria-label={t("square", { row: rowIndex + 1, col: colIndex + 1 })}>
                {isLatestMove && <span className="absolute inset-0 bg-tertiary-fixed/35" />}
                {isTarget && <span className="absolute left-1/2 top-1/2 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary shadow-[0_0_0_5px_rgba(255,203,42,0.45)]" />}
                {piece && <div className="absolute left-[10%] top-[10%] h-4/5 w-4/5"><PieceToken piece={piece} /></div>}
              </button>
            );
          })
        )}
        {movingPiece && (
          <div className="pointer-events-none absolute z-30 h-[8%] w-[8%] -translate-x-1/2 -translate-y-1/2 will-change-[left,top]" style={{ left: `${orientedCoordinate(movingPiece.point.col, orientation) * 10 + 5}%`, top: `${orientedCoordinate(movingPiece.point.row, orientation) * 10 + 5}%`, transition: movingPiece.durationMs ? `left ${movingPiece.durationMs}ms cubic-bezier(.22,.75,.2,1), top ${movingPiece.durationMs}ms cubic-bezier(.22,.75,.2,1)` : "none" }}>
            <PieceToken piece={movingPiece.piece} />
          </div>
        )}
        {bestMove && (
          <svg className="pointer-events-none absolute inset-0 z-20 h-full w-full" viewBox="0 0 100 100" aria-hidden="true">
            <defs><marker id="best-move-arrowhead" markerWidth="4" markerHeight="4" refX="3.2" refY="2" orient="auto"><path d="M0,0 L4,2 L0,4 Z" fill="#ffcb2a" /></marker></defs>
            <line x1={orientedCoordinate(bestMove.from.col, orientation) * 10 + 5} y1={orientedCoordinate(bestMove.from.row, orientation) * 10 + 5} x2={orientedCoordinate(bestMove.to.col, orientation) * 10 + 5} y2={orientedCoordinate(bestMove.to.row, orientation) * 10 + 5} stroke="#ffcb2a" strokeWidth="1.5" strokeLinecap="round" markerEnd="url(#best-move-arrowhead)" className="drop-shadow-[0_2px_2px_rgba(66,50,0,0.65)]" />
          </svg>
        )}
      </div>
    </div>
  );
}

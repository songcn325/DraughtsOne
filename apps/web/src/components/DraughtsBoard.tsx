import type { BoardPoint, GameState } from "@draughtsone/shared";

type Props = {
  state: GameState;
  selected?: BoardPoint;
  legalTargets?: BoardPoint[];
  onSquareClick?: (point: BoardPoint) => void;
};

function samePoint(a: BoardPoint | undefined, b: BoardPoint) {
  return a?.row === b.row && a.col === b.col;
}

export function DraughtsBoard({ state, selected, legalTargets = [], onSquareClick }: Props) {
  return (
    <div className="rounded-lg bg-surface-container-low p-3 shadow-[0_8px_24px_rgba(45,47,47,0.06)]">
      <div className="grid aspect-square grid-cols-10 overflow-hidden rounded-lg bg-surface-container-highest">
        {state.board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const dark = (rowIndex + colIndex) % 2 === 1;
            const point = { row: rowIndex, col: colIndex };
            const isSelected = samePoint(selected, point);
            const isTarget = legalTargets.some((target) => samePoint(target, point));
            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                type="button"
                onClick={() => onSquareClick?.(point)}
                className={`relative aspect-square ${dark ? "bg-surface-container-highest" : "bg-surface-container-lowest"} ${isSelected ? "ring-4 ring-inset ring-secondary-fixed" : ""}`}
                aria-label={`Square ${rowIndex + 1}, ${colIndex + 1}`}
              >
                {isTarget && <span className="absolute left-1/2 top-1/2 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary shadow-[0_0_0_5px_rgba(255,203,42,0.45)]" />}
                {piece && (
                  <div
                    className={`absolute left-[10%] top-[10%] grid h-4/5 w-4/5 place-items-center rounded-full ${
                      piece.color === "white"
                        ? "bg-surface shadow-[inset_0_-4px_8px_rgba(0,0,0,0.08),0_4px_6px_rgba(0,0,0,0.12)]"
                        : "bg-gradient-to-b from-[#4a4a4a] to-[#050505] shadow-[inset_0_-4px_8px_rgba(0,0,0,0.7),0_4px_6px_rgba(0,0,0,0.28)]"
                    }`}
                  >
                    <div className="grid h-3/5 w-3/5 place-items-center rounded-full border border-white/40">
                      {piece.kind === "king" && <span className="material-symbols-outlined fill text-base text-secondary-fixed">crown</span>}
                    </div>
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

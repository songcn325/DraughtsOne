import type { GameState } from "@draughtsone/shared";

export function DraughtsBoard({ state }: { state: GameState }) {
  return (
    <div className="rounded-[1.5rem] bg-surface-container-low p-3 shadow-[0_8px_24px_rgba(45,47,47,0.06)]">
      <div className="grid aspect-square grid-cols-10 overflow-hidden rounded-lg bg-surface-container-highest">
        {state.board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const dark = (rowIndex + colIndex) % 2 === 1;
            return (
              <div key={`${rowIndex}-${colIndex}`} className={`relative aspect-square ${dark ? "bg-surface-container-highest" : "bg-surface-container-lowest"}`}>
                {piece && (
                  <div
                    className={`absolute left-[10%] top-[10%] grid h-4/5 w-4/5 place-items-center rounded-full ${
                      piece.color === "white"
                        ? "bg-surface shadow-[inset_0_-4px_8px_rgba(0,0,0,0.08),0_4px_6px_rgba(0,0,0,0.12)]"
                        : "bg-gradient-to-b from-primary-fixed to-primary shadow-[inset_0_-4px_8px_rgba(35,91,0,0.4),0_4px_6px_rgba(42,105,0,0.3)]"
                    }`}
                  >
                    <div className="h-3/5 w-3/5 rounded-full border border-white/40" />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}


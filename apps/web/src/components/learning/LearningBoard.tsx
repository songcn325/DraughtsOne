type Square = [number, number];
type Piece = { at: Square; color: "white" | "black"; king?: boolean; id?: string };
type Arrow = { from: Square; to: Square };
type Scene = { pieces: Piece[]; arrows?: Arrow[]; highlights?: Square[]; numbered?: boolean; initial?: boolean };

function sameBoardSquare([rowA, colA]: Square, [rowB, colB]: Square) {
  return rowA === rowB && colA === colB;
}

function sceneFor(lesson: number, page: number): Scene {
  if (lesson === 1) return { pieces: [], numbered: true };
  if (lesson === 2 && page === 0) return { pieces: [], initial: true, numbered: true };
  if (lesson === 2) return { pieces: [{ at: [6, 3], color: "white" }, { at: [2, 7], color: "white", king: true }] };
  if (lesson === 3) {
    if (page === 0) {
      return {
        pieces: [
          { at: [7, 4], color: "white" },
          { at: [3, 6], color: "black" },
        ],
      };
    }

    return {
      pieces: [
        {
          at: [3, 4],
          color: "black",
        },
      ],
    };
  }
  if (lesson === 4) return { pieces: [{ at: [7, 2], color: "white" }, { at: [5, 4], color: "black" }] };
  if (lesson === 5) return { pieces: [{ at: [7, 2], color: "white" }, { at: [6, 3], color: "black" }, { at: [5, 4], color: "black" }], highlights: [[5, 4]] };
  if (lesson === 6) return { pieces: [{ at: [4, 3], color: "white" }, ...(page < 2 ? [{ at: [5, 4] as Square, color: "black" as const }] : [])], arrows: page === 1 ? [{ from: [4, 3], to: [6, 5] }] : [], highlights: [[6, 5]] };
  if (lesson === 7) return { pieces: [] };
  if (lesson === 8) return { pieces: [] };
  if (lesson === 9) {
    const openDiagonals: Square[] = [
      [0, 1], [0, 9],
      [1, 2], [1, 8],
      [2, 3], [2, 7],
      [3, 4], [3, 6],
      [5, 4], [5, 6],
      [6, 3], [6, 7],
      [7, 2], [7, 8],
      [8, 1], [8, 9],
      [9, 0],
    ];
    const blockers: Square[] = [[6, 7], [7, 8], [8, 1]];

    return {
      pieces: [
        { at: [4, 5], color: "white", king: true },
        ...(page === 1
          ? [
              { at: blockers[0], color: "black" as const },
              { at: blockers[1], color: "black" as const },
              { at: blockers[2], color: "white" as const },
            ]
          : []),
      ],
      highlights: page === 0
        ? openDiagonals
        : openDiagonals.filter((square) =>
            !blockers.some((blocker) => sameBoardSquare(square, blocker)) &&
            !sameBoardSquare(square, [8, 9]) &&
            !sameBoardSquare(square, [9, 0])
          ),
    };
  }
  if (lesson === 10) return { pieces: [] };
  if (lesson === 11) return { pieces: [] };
  if (lesson === 12) return { pieces: [] };
  if (lesson === 13) return { pieces: [] };
  if (lesson === 14) return { pieces: [] };
  return {
    pieces: [
      { at: [1, 2], color: "black", king: true },
      { at: [6, 3], color: "white", king: true },
    ],
  };
}

function initialPieces(): Piece[] {
  const pieces: Piece[] = [];
  for (let row = 0; row < 4; row += 1) for (let col = 0; col < 10; col += 1) if ((row + col) % 2 === 1) pieces.push({ at: [row, col], color: "black" });
  for (let row = 6; row < 10; row += 1) for (let col = 0; col < 10; col += 1) if ((row + col) % 2 === 1) pieces.push({ at: [row, col], color: "white" });
  return pieces;
}

function position([row, col]: Square) {
  return { left: `${(col + 0.5) * 10}%`, top: `${(row + 0.5) * 10}%` };
}

export function LearningBoard({
  lesson,
  page,
  onSquareClick,
  selected,
  lesson3White,
  lesson3Black,
  lesson4White,
  lesson4Black,
  lesson6White,
  lesson6Black,
  latestMove,
  moveTrail,
  lesson7White,
  lesson7Blacks,
  lesson7Blockers,
  lesson8Whites,
  lesson8Blacks,
  lesson10White,
  lesson10Blacks,
  lesson11Whites,
  lesson11Blacks,
  lesson12Whites,
  lesson12Blacks,
  lesson13Whites,
  lesson13Blacks,
  lesson13Ghosts,
  forbiddenSquares,
  lesson14White,
  lesson14Black,
  lesson14WhiteBlockers,
}: {
  lesson: number;
  page: number;
  onSquareClick?: (square: Square) => void;
  selected?: Square;
  lesson3White?: Square;
  lesson3Black?: Square;
  lesson4White?: Square;
  lesson4Black?: Square | null;
  lesson6White?: Square;
  lesson6Black?: Square | null;
  latestMove?: Arrow;
  moveTrail?: Square[];
  lesson7White?: Square;
  lesson7Blacks?: Square[];
  lesson7Blockers?: Square[];
  lesson8Whites?: Array<{ at: Square; king?: boolean; id: string }>;
  lesson8Blacks?: Square[];
  lesson10White?: Square;
  lesson10Blacks?: Square[];
  lesson11Whites?: Array<{ at: Square; id: string }>;
  lesson11Blacks?: Array<{ at: Square; id: string }>;
  lesson12Whites?: Array<{ at: Square; id: string }>;
  lesson12Blacks?: Array<{ at: Square; id: string }>;
  lesson13Whites?: Array<{ at: Square; id: string; king?: boolean }>;
  lesson13Blacks?: Array<{ at: Square; id: string; king?: boolean }>;
  lesson13Ghosts?: Square[];
  forbiddenSquares?: Square[];
  lesson14White?: Square;
  lesson14Black?: Square | null;
  lesson14WhiteBlockers?: Square[];
})
{
  const scene = sceneFor(lesson, page);
  let pieces = scene.initial ? initialPieces() : scene.pieces;

  if (lesson === 3 && lesson3White && lesson3Black) {
    pieces = [
      {
        at: lesson3White,
        color: "white",
      },
      {
        at: lesson3Black,
        color: "black",
      },
    ];
  }

  if (lesson === 4 && lesson4White) {
    pieces = [
      { at: lesson4White, color: "white" },
      ...(lesson4Black ? [{ at: lesson4Black, color: "black" as const }] : []),
    ];
  }

  if (lesson === 6 && lesson6White) {
    pieces = [
      { at: lesson6White, color: "white" },
      ...(lesson6Black ? [{ at: lesson6Black, color: "black" as const }] : []),
    ];
  }
  if (lesson === 7 && lesson7White && lesson7Blacks) {
    pieces = [
      { at: lesson7White, color: "white", id: "lesson7-white" },
      ...(lesson7Blockers ?? []).map((at) => ({
        at,
        color: "white" as const,
        id: `lesson7-blocker-${at[0]}-${at[1]}`,
      })),
      ...lesson7Blacks.map((at) => ({
        at,
        color: "black" as const,
        id: `lesson7-black-${at[0]}-${at[1]}`,
      })),
    ];
  }
  if (lesson === 8 && lesson8Whites && lesson8Blacks) {
    pieces = [
      ...lesson8Whites.map((piece) => ({
        ...piece,
        color: "white" as const,
      })),
      ...lesson8Blacks.map((at) => ({
        at,
        color: "black" as const,
        id: `lesson8-black-${at[0]}-${at[1]}`,
      })),
    ];
  }
  if (lesson === 10 && lesson10White && lesson10Blacks) {
    pieces = [
      { at: lesson10White, color: "white", king: true, id: "lesson10-white-king" },
      ...lesson10Blacks.map((at) => ({
        at,
        color: "black" as const,
        id: `lesson10-black-${at[0]}-${at[1]}`,
      })),
    ];
  }
  if (lesson === 11 && lesson11Whites && lesson11Blacks) {
    pieces = [
      ...lesson11Whites.map((piece) => ({ ...piece, color: "white" as const })),
      ...lesson11Blacks.map((piece) => ({ ...piece, color: "black" as const })),
    ];
  }
  if (lesson === 12 && lesson12Whites && lesson12Blacks) {
    pieces = [
      ...lesson12Whites.map((piece) => ({ ...piece, color: "white" as const })),
      ...lesson12Blacks.map((piece) => ({ ...piece, color: "black" as const })),
    ];
  }
  if (lesson === 13 && lesson13Whites && lesson13Blacks) {
    pieces = [
      ...lesson13Whites.map((piece) => ({ ...piece, color: "white" as const })),
      ...lesson13Blacks.map((piece) => ({ ...piece, color: "black" as const })),
    ];
  }
  if (lesson === 14 && lesson14White) {
    pieces = [
      { at: lesson14White, color: "white", id: "lesson14-white" },
      ...(lesson14WhiteBlockers ?? []).map((at) => ({
        at,
        color: "white" as const,
        id: `lesson14-blocker-${at[0]}-${at[1]}`,
      })),
      ...(lesson14Black
        ? [{ at: lesson14Black, color: "black" as const, id: "lesson14-black" }]
        : []),
    ];
  }
  const highlights = lesson === 7
    ? moveTrail ?? []
    : lesson === 8
    ? moveTrail ?? []
    : moveTrail
    ? moveTrail
    : latestMove
    ? [latestMove.from, latestMove.to]
    : scene.highlights ?? [];
  let number = 0;
  return (
  <div className="mx-auto aspect-square w-full max-w-[620px]">
    <div className="relative h-full w-full overflow-hidden rounded-xl ring-1 ring-[#cfd4d1] shadow-[0_6px_18px_rgba(45,55,55,.16)]">
      <div
        className="grid h-full w-full grid-cols-10"
        style={{ gridTemplateRows: "repeat(10, minmax(0, 1fr))" }}
      >
          {Array.from({ length: 100 }, (_, index) => {
            const row = Math.floor(index / 10);
            const col = index % 10;
            const dark = (row + col) % 2 === 1;

            if (dark) number += 1;

            const squareNumber = number;
            const active = selected?.[0] === row && selected?.[1] === col;

            return (
              <button
                key={index}
                type="button"
                onClick={() => onSquareClick?.([row, col])}
                disabled={!onSquareClick}
                aria-label={`Square ${row + 1}, ${col + 1}`}
                className={`relative grid place-items-center text-[10px] font-bold sm:text-xs ${
                  dark ? "bg-[#d9dcda]" : "bg-[#fbfbfa]"
                } ${
                  active ? "ring-4 ring-inset ring-[#49c58d]" : ""
                }`}
              >
                {scene.numbered && dark && (
                  <span className="absolute left-2 top-1.5 text-sm font-bold text-[#202124]">
                    {String(squareNumber).padStart(2, "0")}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {highlights.map((at, index) => (
          <span
            key={`h-${index}`}
            className="pointer-events-none absolute h-[10%] w-[10%] -translate-x-1/2 -translate-y-1/2 bg-[#74d5aa]/60"
            style={position(at)}
          />
        ))}

        {(forbiddenSquares ?? []).map((at, index) => (
          <span
            key={`forbidden-${index}`}
            className="pointer-events-none absolute h-[10%] w-[10%] -translate-x-1/2 -translate-y-1/2 bg-[#ff9797]/80"
            style={position(at)}
          />
        ))}

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <defs>
            <marker
              id="lesson-arrow"
              markerWidth="4"
              markerHeight="4"
              refX="3.5"
              refY="2"
              orient="auto"
            >
              <path d="M0 0L4 2L0 4Z" fill="#43bf87" />
            </marker>
          </defs>

          {(lesson === 7 || lesson === 8 ? [] : scene.arrows ?? []).map((arrow, index) => (
            <line
              key={index}
              x1={(arrow.from[1] + 0.5) * 10}
              y1={(arrow.from[0] + 0.5) * 10}
              x2={(arrow.to[1] + 0.5) * 10}
              y2={(arrow.to[0] + 0.5) * 10}
              stroke="#43bf87"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeDasharray="3 2"
              markerEnd="url(#lesson-arrow)"
            />
          ))}
        </svg>

        {pieces.map((piece, index) => (
          <span
            key={piece.id ?? `${piece.color}-${index}`}
            className={`pointer-events-none absolute grid h-[8.2%] w-[8.2%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border shadow-md transition-all duration-1000 ease-in-out ${
              piece.color === "black"
                ? "border-black bg-[#333]"
                : "border-[#e6e6e6] bg-white"
            }`}
            style={position(piece.at)}
          >
            {piece.king && (
              <span className="material-symbols-outlined text-[80%] text-[#d2a900]">
                crown
              </span>
            )}
          </span>
        ))}

        {(lesson13Ghosts ?? []).map((at, index) => (
          <span
            key={`lesson13-ghost-${index}`}
            className="pointer-events-none absolute h-[8.2%] w-[8.2%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/30 bg-[#333]/20 shadow-sm"
            style={position(at)}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}

type Square = [number, number];
type Piece = { at: Square; color: "white" | "black"; king?: boolean };
type Arrow = { from: Square; to: Square };
type Scene = { pieces: Piece[]; arrows?: Arrow[]; highlights?: Square[]; numbered?: boolean; initial?: boolean };

function sceneFor(lesson: number, page: number): Scene {
  if (lesson === 1) return { pieces: [], numbered: true };
  if (lesson === 2 && page === 0) return { pieces: [], initial: true };
  if (lesson === 2) return { pieces: [{ at: [6, 3], color: "white" }, { at: [2, 7], color: "white", king: true }] };
  if (lesson === 3) return { pieces: [{ at: page === 1 ? [3, 4] : [7, 4], color: page === 1 ? "black" : "white" }], arrows: page === 2 ? [] : page === 1 ? [{ from: [3, 4], to: [4, 3] }, { from: [3, 4], to: [4, 5] }] : [{ from: [7, 4], to: [6, 3] }, { from: [7, 4], to: [6, 5] }] };
  if (lesson === 4) return { pieces: [{ at: [7, 2], color: "white" }, ...(page < 2 ? [{ at: [6, 3] as Square, color: "black" as const }] : [])], arrows: page === 1 ? [{ from: [7, 2], to: [5, 4] }] : [], highlights: [[5, 4]] };
  if (lesson === 5) return { pieces: [{ at: [7, 2], color: "white" }, { at: [6, 3], color: "black" }, { at: [5, 4], color: "black" }], highlights: [[5, 4]] };
  if (lesson === 6) return { pieces: [{ at: [4, 3], color: "white" }, ...(page < 2 ? [{ at: [5, 4] as Square, color: "black" as const }] : [])], arrows: page === 1 ? [{ from: [4, 3], to: [6, 5] }] : [], highlights: [[6, 5]] };
  if (lesson === 7) return { pieces: [{ at: [8, 1], color: "white" }, { at: [7, 2], color: "black" }, { at: [5, 4], color: "black" }, { at: [3, 6], color: "black" }], arrows: page % 2 === 1 ? [{ from: [8, 1], to: [6, 3] }, { from: [6, 3], to: [4, 5] }, { from: [4, 5], to: [2, 7] }] : [], highlights: [[6, 3], [4, 5], [2, 7]] };
  if (lesson === 8) return { pieces: [{ at: page === 1 || page === 5 ? [0, 1] : [2, 3], color: "white", king: page === 1 || page === 5 }], arrows: page === 0 || page === 4 ? [{ from: [2, 3], to: [0, 1] }] : [], highlights: [[0, 1]] };
  if (lesson === 9) return { pieces: [{ at: [5, 4], color: "white", king: true }, ...(page === 1 ? [{ at: [3, 2] as Square, color: "black" as const }] : [])], arrows: page === 0 ? [{ from: [5, 4], to: [1, 0] }, { from: [5, 4], to: [1, 8] }, { from: [5, 4], to: [9, 0] }, { from: [5, 4], to: [9, 8] }] : [{ from: [5, 4], to: [4, 3] }] };
  if (lesson === 10) return { pieces: [{ at: [8, 1], color: "white", king: true }, { at: [6, 3], color: "black" }, { at: [3, 6], color: "black" }, ...(page > 3 ? [{ at: [5, 8] as Square, color: "black" as const }] : [])], arrows: page % 2 === 1 ? [{ from: [8, 1], to: [5, 4] }, { from: [5, 4], to: [2, 7] }] : [], highlights: [[5, 4], [2, 7]] };
  if (lesson === 11) return { pieces: [{ at: [7, 2], color: "white" }, { at: [7, 6], color: "white" }, { at: [6, 3], color: "black" }, { at: [4, 5], color: "black" }, { at: [2, 7], color: "black" }], arrows: page === 5 || page === 6 ? [{ from: [7, 2], to: [5, 4] }, { from: [2, 7], to: [6, 3] }] : [], highlights: [[5, 4]] };
  if (lesson === 12) return { pieces: [{ at: [8, 3], color: "white" }, { at: [6, 1], color: "white" }, { at: [7, 4], color: "black" }, { at: [5, 2], color: "black" }, { at: [3, 4], color: "black" }], arrows: page === 5 || page === 6 ? [{ from: [8, 3], to: [6, 5] }, { from: [6, 1], to: [4, 3] }] : [], highlights: [[6, 5], [4, 3]] };
  if (lesson === 13) return { pieces: [{ at: [8, 1], color: "white", king: true }, { at: [6, 3], color: "black" }, { at: [4, 5], color: "black" }, { at: [6, 7], color: "black" }], arrows: page > 0 ? [{ from: [8, 1], to: [5, 4] }, { from: [5, 4], to: [7, 8] }] : [], highlights: [[5, 4], [7, 8]] };
  if (lesson === 14) return { pieces: page < 2 ? [{ at: [4, 5], color: "white", king: true }] : [{ at: [0, 1], color: "black" }, { at: [1, 0], color: "white" }, { at: [1, 2], color: "white" }, { at: [2, 3], color: "white" }], highlights: page === 3 ? [[0, 1]] : [] };
  return { pieces: [{ at: [2, 1], color: "white", king: true }, { at: [7, 8], color: "black", king: true }], arrows: page === 1 ? [{ from: [2, 1], to: [5, 4] }, { from: [7, 8], to: [4, 5] }] : [] };
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

export function LearningBoard({ lesson, page, onSquareClick, selected }: { lesson: number; page: number; onSquareClick?: (square: Square) => void; selected?: Square }) {
  const scene = sceneFor(lesson, page);
  const pieces = scene.initial ? initialPieces() : scene.pieces;
  let number = 0;
  return (
    <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-2xl border-[8px] border-white bg-white shadow-[0_8px_25px_rgba(45,55,55,.12)]">
      <div className="grid h-full grid-cols-10">
        {Array.from({ length: 100 }, (_, index) => {
          const row = Math.floor(index / 10);
          const col = index % 10;
          const dark = (row + col) % 2 === 1;
          if (dark) number += 1;
          const squareNumber = number;
          const active = selected?.[0] === row && selected?.[1] === col;
          return <button key={index} type="button" onClick={() => onSquareClick?.([row, col])} disabled={!onSquareClick} aria-label={`Square ${row + 1}, ${col + 1}`} className={`relative grid aspect-square place-items-center text-[10px] font-bold sm:text-xs ${dark ? "bg-[#d9dcda]" : "bg-[#fbfbfa]"} ${active ? "ring-4 ring-inset ring-[#49c58d]" : ""}`}>{scene.numbered && dark ? squareNumber : ""}</button>;
        })}
      </div>
      {(scene.highlights ?? []).map((at, index) => <span key={`h-${index}`} className="pointer-events-none absolute h-[9%] w-[9%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-[#74d5aa]/60 ring-2 ring-[#49c58d]" style={position(at)} />)}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden="true">
        <defs><marker id="lesson-arrow" markerWidth="4" markerHeight="4" refX="3.5" refY="2" orient="auto"><path d="M0 0L4 2L0 4Z" fill="#43bf87" /></marker></defs>
        {(scene.arrows ?? []).map((arrow, index) => <line key={index} x1={(arrow.from[1] + .5) * 10} y1={(arrow.from[0] + .5) * 10} x2={(arrow.to[1] + .5) * 10} y2={(arrow.to[0] + .5) * 10} stroke="#43bf87" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 2" markerEnd="url(#lesson-arrow)" />)}
      </svg>
      {pieces.map((piece, index) => <span key={`${piece.at.join("-")}-${index}`} className={`pointer-events-none absolute grid h-[8.2%] w-[8.2%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border shadow-md transition-all duration-500 ${piece.color === "black" ? "border-black bg-[#333]" : "border-[#e6e6e6] bg-white"}`} style={position(piece.at)}>{piece.king && <span className="material-symbols-outlined text-[80%] text-[#d2a900]">crown</span>}</span>)}
    </div>
  );
}

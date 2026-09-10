import numberedBoard from "../../assets/learn/board-numbered.png";
import blackMan from "../../assets/learn/piece-black-man.png";
import whiteMan from "../../assets/learn/piece-white-man.png";

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

function numberedBoardPosition([row, col]: Square) {
  return { left: `${8.17 + (col + 0.5) * 8.37}%`, top: `${6.28 + (row + 0.5) * 8.36}%` };
}

function NumberedAssetBoard({ scene, onSquareClick, selected }: { scene: Scene; onSquareClick?: (square: Square) => void; selected?: Square }) {
  const pieces = scene.initial ? initialPieces() : scene.pieces;
  return (
    // Keep the image's natural aspect ratio: the supplied board includes intentional outer framing,
    // so forcing this wrapper to aspect-square would crop or distort it during future design updates.
    <div className="relative mx-auto w-full max-w-[620px]">
      <img src={numberedBoard} alt="International draughts board numbered 1 to 50" className="block h-auto w-full object-contain drop-shadow-[0_8px_18px_rgba(45,55,55,.12)]" />
      {(scene.highlights ?? []).map((at, index) => <span key={`h-${index}`} className="pointer-events-none absolute w-[7%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-[#74d5aa]/60 ring-2 ring-[#49c58d]" style={{ ...numberedBoardPosition(at), aspectRatio: "1" }} />)}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden="true">
        <defs><marker id="numbered-lesson-arrow" markerWidth="4" markerHeight="4" refX="3.5" refY="2" orient="auto"><path d="M0 0L4 2L0 4Z" fill="#43bf87" /></marker></defs>
        {(scene.arrows ?? []).map((arrow, index) => <line key={index} x1={8.17 + (arrow.from[1] + .5) * 8.37} y1={6.28 + (arrow.from[0] + .5) * 8.36} x2={8.17 + (arrow.to[1] + .5) * 8.37} y2={6.28 + (arrow.to[0] + .5) * 8.36} stroke="#43bf87" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2.5 2" markerEnd="url(#numbered-lesson-arrow)" />)}
      </svg>
      {pieces.map((piece, index) => piece.king
        ? <span key={`${piece.at.join("-")}-${index}`} className="pointer-events-none absolute grid w-[6.5%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#e7e7e7] bg-white shadow-md" style={{ ...numberedBoardPosition(piece.at), aspectRatio: "1" }}><span className="material-symbols-outlined text-[clamp(10px,2vw,22px)] text-[#d2a000]">crown</span></span>
        : <img key={`${piece.at.join("-")}-${index}`} src={piece.color === "black" ? blackMan : whiteMan} alt="" className="pointer-events-none absolute w-[10.5%] -translate-x-1/2 -translate-y-1/2" style={numberedBoardPosition(piece.at)} />
      )}
      {onSquareClick && <div className="absolute z-20 grid grid-cols-10" style={{ left: "8.17%", top: "6.28%", width: "83.7%", height: "83.6%" }}>{Array.from({ length: 100 }, (_, index) => { const row = Math.floor(index / 10); const col = index % 10; const active = selected?.[0] === row && selected?.[1] === col; return <button key={index} type="button" onClick={() => onSquareClick([row, col])} aria-label={`Square ${row + 1}, ${col + 1}`} className={active ? "ring-4 ring-inset ring-[#49c58d]" : ""} />; })}</div>}
    </div>
  );
}

export function LearningBoard({ lesson, page, onSquareClick, selected }: { lesson: number; page: number; onSquareClick?: (square: Square) => void; selected?: Square }) {
  const scene = sceneFor(lesson, page);
  return <NumberedAssetBoard scene={scene} onSquareClick={onSquareClick} selected={selected} />;
}

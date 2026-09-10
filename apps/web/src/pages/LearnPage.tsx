import type { BoardPiece, BoardPoint, BoardSquare, GameState } from "@draughtsone/shared";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { DraughtsBoard } from "../components/DraughtsBoard";
import { useLanguage } from "../i18n";
import type { Language } from "../i18n";
import mascot from "../assets/login-mascot-black.png";
import boardIcon from "../assets/learning-training/learn-grid-icon.png";
import pieceIcon from "../assets/learning-training/learn-piece-icon.png";
import moveIcon from "../assets/learning-training/learn-growth-icon.png";
import captureIcon from "../assets/learning-training/learn-capture-icon.png";
import promotionIcon from "../assets/learning-training/learn-promotion-icon.png";
import kingMoveIcon from "../assets/learning-training/learn-king-move-icon.png";
import kingCaptureIcon from "../assets/learning-training/learn-king-capture-icon.png";
import victoryIcon from "../assets/learning-training/learn-duel-icon.png";
import chapterBook from "../assets/learning-training/learn-chapter-book.png";
import chapterStar from "../assets/learning-training/learn-chapter-star.png";

type Copy = { en: string; zh: string };
type LessonPiece = BoardPiece & BoardPoint;
type LessonMove = { from: BoardPoint; to: BoardPoint; path?: BoardPoint[] };
type LessonPage = { copy: Copy; pieces?: LessonPiece[]; move?: LessonMove; interactive?: boolean; numbered?: boolean };
type Lesson = { id: number; title: Copy; icon: string; pages: LessonPage[] };

const p = (id: string, row: number, col: number, color: "white" | "black", kind: "man" | "king" = "man"): LessonPiece => ({ id, row, col, color, kind });
const move = (from: [number, number], to: [number, number], path?: [number, number][]): LessonMove => ({ from: { row: from[0], col: from[1] }, to: { row: to[0], col: to[1] }, path: path?.map(([row, col]) => ({ row, col })) });
const C = (zh: string, en: string): Copy => ({ zh, en });

const openingPieces: LessonPiece[] = Array.from({ length: 10 }, (_, row) =>
  Array.from({ length: 10 }, (_, col) => ({ row, col }))
).flat().filter(({ row, col }) => (row + col) % 2 === 1 && (row < 4 || row > 5)).map(({ row, col }) => p(`${row < 4 ? "b" : "w"}-${row}-${col}`, row, col, row < 4 ? "black" : "white"));

const lessons: Lesson[] = [
  { id: 1, title: C("认识棋盘", "Meet the board"), icon: boardIcon, pages: [
    { copy: C("国际跳棋使用 10×10 棋盘，深色格子从左下角到右上角，棋盘标有数字 1 到 50。", "International draughts uses a 10×10 board. The dark squares run from lower left to upper right and are numbered 1 to 50."), numbered: true }
  ] },
  { id: 2, title: C("如何摆放棋子", "Set up the pieces"), icon: pieceIcon, pages: [
    { copy: C("所有棋子均摆放在深色格子。白棋摆在数字 31–50 的格子中，黑棋摆在数字 1–20 的格子中。", "All pieces start on dark squares. White occupies squares 31–50 and Black occupies squares 1–20."), pieces: openingPieces }
  ] },
  { id: 3, title: C("兵的走法", "How a man moves"), icon: moveIcon, pages: [
    { copy: C("轮到白棋行棋。兵只能向前斜走一格，不能后退。选择白棋，再走到高亮格。", "White moves. A man moves one square diagonally forward and cannot move backward. Select the white piece, then the highlighted square."), pieces: [p("w1", 6, 3, "white"), p("w2", 6, 5, "white"), p("b1", 4, 7, "black")], move: move([6, 3], [5, 2]), interactive: true },
    { copy: C("非常棒！你已经学会了兵的基本走法。", "Great! You now know the basic movement of a man."), pieces: [p("w1", 5, 2, "white"), p("w2", 6, 5, "white"), p("b1", 4, 7, "black")] }
  ] },
  { id: 4, title: C("兵的吃子", "How a man captures"), icon: captureIcon, pages: [
    { copy: C("兵跳过相邻的对方棋子，落在它后方的空格，就能完成吃子。", "A man captures by jumping over an adjacent opposing piece into the empty square behind it."), pieces: [p("w", 6, 3, "white"), p("b", 5, 4, "black")], move: move([6, 3], [4, 5]), interactive: true },
    { copy: C("你成功完成了一次兵的跳吃！", "You completed a capture with a man."), pieces: [p("w", 4, 5, "white")] }
  ] },
  { id: 5, title: C("吃子的常见错误", "Common capture mistakes"), icon: captureIcon, pages: [
    { copy: C("当棋子连在一起，中间没有空格时，不能发起跳吃。", "You cannot capture when pieces are packed together and there is no empty landing square."), pieces: [p("w", 6, 3, "white"), p("b1", 5, 4, "black"), p("b2", 4, 5, "black")] }
  ] },
  { id: 6, title: C("兵的回吃", "Backward capture"), icon: captureIcon, pages: [
    { copy: C("兵虽然只能向前走，但只要后方有可以跳跃的空格，也可以向后吃子。", "A man moves forward, but it may capture backward whenever there is an empty landing square."), pieces: [p("w", 4, 3, "white"), p("b", 5, 4, "black")], move: move([4, 3], [6, 5]) }
  ] },
  { id: 7, title: C("兵的连吃", "Multiple capture"), icon: captureIcon, pages: [
    { copy: C("两个黑棋中间存在空格。选择白棋，一步连续跳过它们。", "There is an empty landing square between the two black pieces. Choose White and capture both in one move."), pieces: [p("w", 7, 2, "white"), p("b1", 6, 3, "black"), p("b2", 4, 5, "black")], move: move([7, 2], [3, 6], [[7, 2], [5, 4], [3, 6]]), interactive: true },
    { copy: C("非常棒！连续吃子在国际跳棋中视为一步棋。", "Excellent! A multiple capture counts as one move in international draughts."), pieces: [p("w", 3, 6, "white")] }
  ] },
  { id: 8, title: C("兵的升变", "Promotion"), icon: promotionIcon, pages: [
    { copy: C("兵抵达对方底线并停留时会升变为王棋。把白棋走到底线。", "A man becomes a king when it reaches and stops on the opponent's back rank. Move White to the back rank."), pieces: [p("w", 1, 2, "white"), p("b", 2, 7, "black")], move: move([1, 2], [0, 1]), interactive: true },
    { copy: C("兵仅经过底线但没有停留，不能升变。", "Passing across the back rank during a capture does not promote a man unless it finishes there."), pieces: [p("w", 2, 3, "white"), p("b", 1, 4, "black")] }
  ] },
  { id: 9, title: C("王的走法", "How a king moves"), icon: kingMoveIcon, pages: [
    { copy: C("王棋拥有非常突出的战斗力，只要斜线上没有阻碍，便可以沿斜线移动任意距离。", "A king is powerful: it may travel any distance along an unobstructed diagonal."), pieces: [p("k", 5, 4, "white", "king")], move: move([5, 4], [1, 8]) }
  ] },
  { id: 10, title: C("王的连吃", "King multiple capture"), icon: kingCaptureIcon, pages: [
    { copy: C("王棋可以跨越更远的距离连续吃子。试着完成这条路线。", "A king can cross long diagonals while making a capture chain. Complete this route."), pieces: [p("k", 8, 1, "white", "king"), p("b1", 6, 3, "black"), p("b2", 3, 6, "black")], move: move([8, 1], [1, 8], [[8, 1], [5, 4], [1, 8]]), interactive: true },
    { copy: C("真厉害！王棋连吃时，每次跳跃都清晰可见。", "Well done! Every jump in the king's capture sequence is shown clearly."), pieces: [p("k", 1, 8, "white", "king")] }
  ] },
  { id: 11, title: C("有吃必吃", "Capture is compulsory"), icon: captureIcon, pages: [
    { copy: C("在国际跳棋中，有吃必吃具有强制性。请选择能够吃子的白棋。", "Capturing is compulsory in international draughts. Choose the white piece that can capture."), pieces: [p("w1", 6, 1, "white"), p("w2", 6, 7, "white"), p("b1", 5, 2, "black"), p("b2", 3, 4, "black"), p("b3", 2, 7, "black")], move: move([6, 1], [2, 5], [[6, 1], [4, 3], [2, 5]]), interactive: true },
    { copy: C("正确！小万连续吃掉了两个黑棋，获得优势。", "Correct! White captured two black pieces in sequence and gained the advantage."), pieces: [p("w1", 2, 5, "white"), p("w2", 6, 7, "white"), p("b3", 2, 7, "black")] }
  ] },
  { id: 12, title: C("有多吃多", "Maximum capture"), icon: kingCaptureIcon, pages: [
    { copy: C("如果有多条吃子路线，必须选择吃子最多的走法。请走出第一步，剩余路线会自动完成。", "If several capture routes exist, you must choose the one that captures the most pieces. Make the first choice; the rest will play automatically."), pieces: [p("w", 7, 2, "white"), p("b1", 6, 3, "black"), p("b2", 4, 5, "black"), p("b3", 2, 7, "black"), p("b4", 6, 1, "black")], move: move([7, 2], [1, 8], [[7, 2], [5, 4], [3, 6], [1, 8]]), interactive: true },
    { copy: C("正确！你选择了能吃掉最多棋子的路线。", "Correct! You chose the route that captures the greatest number of pieces."), pieces: [p("w", 1, 8, "white")] }
  ] },
  { id: 13, title: C("土耳其规则", "Turkish capture rule"), icon: chapterStar, pages: [
    { copy: C("已经跳过的棋子不能再次跳过，这就是土耳其规则。", "A piece already crossed in a capture sequence cannot be crossed again. This is the Turkish capture rule."), pieces: [p("k", 4, 5, "white", "king"), p("b1", 3, 4, "black"), p("b2", 5, 4, "black"), p("b3", 5, 6, "black")], move: move([4, 5], [7, 2], [[4, 5], [2, 3], [6, 7], [7, 2]]) },
    { copy: C("记住：被跳过的棋子会立即从本次连吃路线中移除。", "Remember: a captured piece is removed immediately from the current capture route."), pieces: [p("k", 7, 2, "white", "king")] }
  ] },
  { id: 14, title: C("胜负判断", "Winning the game"), icon: victoryIcon, pages: [
    { copy: C("一方的所有棋子被吃光，或没有任何合法着法时，另一方获胜。", "You win when the opponent has no pieces left or has no legal move."), pieces: [p("w1", 5, 2, "white"), p("w2", 6, 3, "white"), p("b", 0, 9, "black")] },
    { copy: C("胜负条件已经掌握，去完成一盘对局吧！", "You now understand the winning conditions. Put them into practice in a full game."), pieces: [p("w1", 5, 2, "white"), p("w2", 6, 3, "white")] }
  ] },
  { id: 15, title: C("和棋判断", "Drawing the game"), icon: victoryIcon, pages: [
    { copy: C("双方都无法强制获胜时，可以约定和棋。后续课程还会介绍定式和棋。", "When neither player can force a win, the game may be drawn by agreement. Later lessons cover formal draw positions."), pieces: [p("wk", 7, 2, "white", "king"), p("bk", 2, 7, "black", "king")] }
  ] }
];

function localized(copy: Copy, language: Language) { return copy[language]; }

function toState(pieces: LessonPiece[]): GameState {
  const board: BoardSquare[][] = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => null));
  for (const piece of pieces) board[piece.row][piece.col] = { id: piece.id, color: piece.color, kind: piece.kind };
  return { board, turn: "white", ply: 0, mandatoryCapture: false };
}

function routeFor(moveSpec: LessonMove) {
  return moveSpec.path && moveSpec.path.length > 1 ? moveSpec.path : [moveSpec.from, moveSpec.to];
}

function applyLessonMove(state: GameState, moveSpec: LessonMove) {
  const board = state.board.map((row) => row.map((piece) => (piece ? { ...piece } : null)));
  const moving = board[moveSpec.from.row][moveSpec.from.col];
  if (!moving) return state;
  board[moveSpec.from.row][moveSpec.from.col] = null;
  const route = routeFor(moveSpec);
  for (let index = 1; index < route.length; index += 1) {
    const from = route[index - 1]; const to = route[index];
    const rowStep = Math.sign(to.row - from.row); const colStep = Math.sign(to.col - from.col);
    for (let row = from.row + rowStep, col = from.col + colStep; row !== to.row && col !== to.col; row += rowStep, col += colStep) {
      if (board[row][col] && board[row][col]?.color !== moving.color) { board[row][col] = null; break; }
    }
  }
  const promoted = moving.kind === "man" && ((moving.color === "white" && moveSpec.to.row === 0) || (moving.color === "black" && moveSpec.to.row === 9));
  board[moveSpec.to.row][moveSpec.to.col] = promoted ? { ...moving, kind: "king" } : moving;
  return { ...state, board, ply: state.ply + 1 };
}

function samePoint(a: BoardPoint | undefined, b: BoardPoint) { return a?.row === b.row && a.col === b.col; }

function NumberOverlay() {
  let number = 1;
  return <div className="pointer-events-none absolute inset-3 grid grid-cols-10 overflow-hidden rounded-lg">{Array.from({ length: 100 }, (_, index) => {
    const row = Math.floor(index / 10); const col = index % 10; const dark = (row + col) % 2 === 1; const label = dark ? number++ : undefined;
    return <span key={index} className="p-0.5 text-[8px] font-bold text-[#434843] sm:text-xs">{label}</span>;
  })}</div>;
}

function LessonDetail({ lesson, onBack, onFinish }: { lesson: Lesson; onBack: () => void; onFinish: () => void }) {
  const { language, setLanguage } = useLanguage();
  const [pageIndex, setPageIndex] = useState(0);
  const page = lesson.pages[pageIndex];
  const initialState = useMemo(() => toState(page.pieces ?? []), [lesson.id, pageIndex]);
  const [state, setState] = useState(initialState);
  const [selected, setSelected] = useState<BoardPoint>();
  const [latestMove, setLatestMove] = useState<LessonMove>();
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(!page.interactive);
  const [mistake, setMistake] = useState(false);

  useEffect(() => {
    setState(initialState); setSelected(undefined); setLatestMove(undefined); setShowHint(false); setMistake(false); setCompleted(!page.interactive);
    if (page.move && !page.interactive) {
      const timer = window.setTimeout(() => { setLatestMove(page.move); setState(applyLessonMove(initialState, page.move!)); }, 550);
      return () => window.clearTimeout(timer);
    }
  }, [initialState, page]);

  function handleSquare(point: BoardPoint) {
    if (!page.interactive || completed || !page.move) return;
    if (!selected) {
      if (samePoint(point, page.move.from)) { setSelected(point); setMistake(false); }
      else setMistake(true);
      return;
    }
    if (!samePoint(point, page.move.to)) { setMistake(true); setSelected(undefined); return; }
    setLatestMove(page.move); setState(applyLessonMove(state, page.move)); setSelected(undefined); setMistake(false); setCompleted(true);
  }

  function retry() { setState(initialState); setSelected(undefined); setLatestMove(undefined); setShowHint(false); setMistake(false); setCompleted(!page.interactive); }
  function continueLesson() { if (pageIndex < lesson.pages.length - 1) setPageIndex((value) => value + 1); else onFinish(); }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#fbfaf6] text-[#293444]">
      <main className="mx-auto min-h-screen w-full max-w-[520px] px-5 pb-8 pt-5 sm:px-8">
        <header className="grid grid-cols-[48px_1fr_auto] items-center gap-3">
          <button type="button" onClick={onBack} className="grid h-11 w-11 place-items-center rounded-full border border-[#dce4eb] bg-white" aria-label={language === "zh" ? "返回" : "Back"}><span className="material-symbols-outlined">chevron_left</span></button>
          <div className="text-center"><h1 className="text-[22px] font-black leading-tight">{String(lesson.id).padStart(2, "0")}. {localized(lesson.title, language)}</h1><p className="text-xs font-semibold text-[#8290a3]">{language === "zh" ? "国际跳棋入门基础" : "International draughts basics"}</p></div>
          <button type="button" onClick={() => setLanguage(language === "zh" ? "en" : "zh")} className="rounded-full bg-[#d9f5df] px-3 py-2 text-xs font-black text-[#45b987]" aria-label={language === "zh" ? "Switch to English" : "切换中文"}>{language === "zh" ? "EN" : "中文"} · ☆ {pageIndex + 1}/{lesson.pages.length}</button>
        </header>

        <section className="mt-10 grid grid-cols-[118px_1fr] items-center gap-3">
          <div className="text-center"><img src={mascot} alt="" className="mx-auto h-24 w-24 object-contain" /><p className="-mt-1 text-sm font-black text-[#48bd89]">{language === "zh" ? "小德拉夫：" : "Draff:"}</p></div>
          <div className="rounded-[20px] border border-[#dce4eb] bg-white px-5 py-5 text-[17px] font-semibold leading-8 text-[#455044] shadow-[0_5px_14px_rgba(43,52,66,.06)]">{localized(page.copy, language)}</div>
        </section>

        <div className="relative mt-7 rounded-[18px] bg-white p-1 shadow-[0_6px_18px_rgba(43,52,66,.08)]">
          <DraughtsBoard state={state} selected={selected} legalTargets={showHint && page.move ? [page.move.to] : selected && page.move ? [page.move.to] : []} latestMove={latestMove} onSquareClick={handleSquare} />
          {page.numbered && <NumberOverlay />}
        </div>

        {mistake && <p className="mt-3 rounded-xl bg-[#fff0ef] px-4 py-3 text-center text-sm font-bold text-[#c54b48]">{language === "zh" ? "这一步不符合规则，请重做一次或获取提示。" : "That move does not follow the rule. Try again or reveal the hint."}</p>}
        <button type="button" disabled={!completed} onClick={continueLesson} className="mt-6 w-full rounded-full bg-[#4fbd8d] py-4 text-lg font-black text-white shadow-[0_8px_18px_rgba(79,189,141,.24)] transition disabled:bg-[#a8ddc5] disabled:shadow-none">{pageIndex === lesson.pages.length - 1 ? (language === "zh" ? "我学会了" : "I learned it") : (language === "zh" ? "继续" : "Continue")}</button>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setShowHint(true)} className="rounded-full border border-[#dce4eb] bg-white py-3 font-black"><span className="mr-1 text-[#ff8a00]">♧</span>{language === "zh" ? "获得提示" : "Get hint"}</button>
          <button type="button" onClick={retry} className="rounded-full border border-[#dce4eb] bg-white py-3 font-black"><span className="material-symbols-outlined mr-1 align-middle text-lg">replay</span>{language === "zh" ? "重做一次" : "Try again"}</button>
        </div>
      </main>
    </div>
  );
}

function Chapter({ title, icon, children }: { title: string; icon: string; children: ReactNode }) {
  return <section className="space-y-4"><div className="flex items-center gap-2"><img src={icon} alt="" className="h-8 w-8" /><h2 className="text-2xl font-black">{title}</h2></div>{children}</section>;
}

export function LearnPage() {
  const { language } = useLanguage();
  const [activeLesson, setActiveLesson] = useState<Lesson>();
  const [completed, setCompleted] = useState<number[]>([]);
  if (activeLesson) return <LessonDetail lesson={activeLesson} onBack={() => setActiveLesson(undefined)} onFinish={() => { setCompleted((current) => current.includes(activeLesson.id) ? current : [...current, activeLesson.id]); setActiveLesson(undefined); }} />;

  const chapters = [lessons.slice(0, 5), lessons.slice(5, 10), lessons.slice(10)];
  const chapterTitles = language === "zh" ? ["第一章：棋盘与兵", "第二章：升变与王棋", "第三章：强制规则与胜负"] : ["Chapter 1: Board and men", "Chapter 2: Promotion and kings", "Chapter 3: Forced rules and results"];
  return (
    <div className="rounded-[2rem] bg-white p-5 shadow-[0_8px_24px_rgba(45,47,47,0.04)] sm:p-7">
      <div className="mb-7"><p className="text-sm font-black uppercase tracking-wider text-primary">{language === "zh" ? "学习中心" : "Learning centre"}</p><h1 className="mt-1 text-3xl font-black">{language === "zh" ? "国际跳棋入门基础" : "International draughts basics"}</h1><p className="mt-2 font-semibold text-on-surface-variant">{language === "zh" ? "15 节互动课程，完整覆盖设计稿中的基础规则。" : "15 interactive lessons covering the complete beginner rule set."}</p></div>
      <div className="space-y-9">{chapters.map((chapter, index) => <Chapter key={chapterTitles[index]} title={chapterTitles[index]} icon={index === 0 ? chapterBook : chapterStar}><div className="grid grid-cols-2 gap-4 lg:grid-cols-3">{chapter.map((lesson) => <button key={lesson.id} type="button" onClick={() => setActiveLesson(lesson)} className="relative min-h-[132px] rounded-[26px] border-2 border-[#e2e2e2] bg-white p-4 text-center shadow-[0_5px_0_rgba(0,0,0,.1)] transition hover:-translate-y-1 active:translate-y-1 active:shadow-none"><span className="absolute left-3 top-3 text-xs font-black text-[#94a09b]">{String(lesson.id).padStart(2, "0")}</span>{completed.includes(lesson.id) && <span className="absolute right-3 top-3 text-[#4fbd8d]">✓</span>}<img src={lesson.icon} alt="" className="mx-auto h-14 w-14" /><p className="mt-3 text-sm font-black sm:text-base">{localized(lesson.title, language)}</p></button>)}</div></Chapter>)}</div>
    </div>
  );
}

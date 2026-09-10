import type { BoardSquare, GameState } from "@draughtsone/shared";
import { useMemo, useState } from "react";
import type { MouseEvent } from "react";
import { DraughtsBoard } from "../components/DraughtsBoard";
import { useLanguage } from "../i18n";
import type { Language } from "../i18n";
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
import lockIcon from "../assets/learning-training/learn-lock-icon.png";

type Copy = { en: string; zh: string };
type LessonPage = { asset?: string; english: string };
type Lesson = { id: number; title: Copy; icon: string; pages: LessonPage[] };

const C = (zh: string, en: string): Copy => ({ zh, en });
const asset = (name: string) => `/learning-module/lesson-${name}.svg`;
const numberedPages = (lesson: number, count: number, english: string[]) => Array.from({ length: count }, (_, index) => ({ asset: asset(`${String(lesson).padStart(2, "0")}-${index + 1}`), english: english[index] }));

const lessons: Lesson[] = [
  { id: 1, title: C("认识棋盘", "Know the board"), icon: boardIcon, pages: [{ asset: asset("01"), english: "International draughts uses a 10×10 board. The dark squares run from lower left to upper right and are numbered 1 to 50." }] },
  { id: 2, title: C("认识棋子", "Know the pieces"), icon: pieceIcon, pages: [
    { asset: asset("02"), english: "All pieces are placed on dark squares. White starts on squares 31–50 and Black starts on squares 1–20." },
    { english: "Ordinary pieces are men. A man that reaches the opponent's back rank becomes a king and gains greater movement." }
  ] },
  { id: 3, title: C("兵的走法", "Man movement"), icon: moveIcon, pages: numberedPages(3, 3, [
    "It is White's turn. Which direction should the man move?", "Great—you know how a man moves. Now help Black make one move.", "Excellent. Remember: a man moves forward and cannot move backward."
  ]) },
  { id: 4, title: C("兵的吃子", "Man capture"), icon: captureIcon, pages: numberedPages(4, 3, [
    "Black moved in front of White and left an empty square behind it. Jump over Black to capture it.", "Jump over the opposing piece and land on the empty square behind it.", "You successfully completed a capture with a man."
  ]) },
  { id: 5, title: C("吃子的常见错误", "Common capture mistakes"), icon: captureIcon, pages: [{ asset: asset("05"), english: "If opposing pieces are touching and there is no empty landing square between them, a capture cannot be made." }] },
  { id: 6, title: C("兵的回吃", "Backward capture"), icon: captureIcon, pages: numberedPages(6, 3, [
    "Black has moved behind the white man, with an empty landing square available.", "A man may jump backward when making a capture.", "You captured Black. Remember: although a man moves forward, it may capture backward."
  ]) },
  { id: 7, title: C("兵的连吃", "Man multiple capture"), icon: captureIcon, pages: numberedPages(7, 6, [
    "There is an empty square between two black pieces. Help White make a multiple capture.", "Excellent! A multiple capture counts as one move in international draughts.", "Here are a few more multiple-capture exercises. Give them a try.", "That was no problem for you. Now try a harder route.", "Choose the continuation that captures every available piece.", "Excellent—you now understand multiple captures. Keep learning and you will soon be an expert."
  ]) },
  { id: 8, title: C("兵的升变", "Man promotion"), icon: promotionIcon, pages: numberedPages(8, 6, [
    "A man that stops on the opponent's back rank is crowned as a king. Move White to the back rank.", "The man has reached the back rank and is promoted.", "Choose the route that lets White's man become a king.", "A man that only passes across the back rank without stopping there is not promoted. Try again.", "Choose a route that finishes on the back rank.", "Excellent! You promoted White's man. Next, learn how kings move."
  ]) },
  { id: 9, title: C("王的走法", "King movement"), icon: kingMoveIcon, pages: [
    { asset: asset("09"), english: "A king is powerful. When a diagonal is clear, it can move any distance along it in one move." },
    { asset: asset("09-1"), english: "When a piece blocks the diagonal, the king's movement is limited." }
  ] },
  { id: 10, title: C("王的连吃", "King capture"), icon: kingCaptureIcon, pages: numberedPages(10, 10, [
    "An opposing piece is on the king's diagonal. With an empty square behind it, help White capture it.", "A king may land on any empty square beyond the captured piece, provided nothing blocks the path.", "Kings also make multiple captures. Help White's king capture both black pieces.", "A clean multiple capture! Now try the following exercises.", "Find the king's complete capture route.", "You are thinking like a strong player. Try one more position.", "This challenge has several possible routes. Find one.", "Excellent—you found one route. Return to the position and look for another.", "That is another correct route.", "Brilliant! Keep learning and become an international draughts expert."
  ]) },
  { id: 11, title: C("有吃必吃", "Capture is compulsory"), icon: captureIcon, pages: numberedPages(11, 8, [
    "It is White's turn. White must capture and may not move another piece.", "The compulsory-capture rule is mandatory in international draughts.", "Help White play the move required by the compulsory-capture rule.", "Excellent—you understand compulsory capture. Now apply it in a position.", "After this move, the next player must capture. Use that forced move to gain an advantage.", "Correct. Using compulsory capture to gain time is called winning a tempo.", "White captured one black piece, but Black replied by capturing two white pieces.", "Try again. You will find the correct solution soon."
  ]) },
  { id: 12, title: C("有多吃多", "Maximum capture"), icon: kingCaptureIcon, pages: numberedPages(12, 8, [
    "White can capture on either side and must follow the maximum-capture rule.", "White must choose the route that captures the most pieces. This rule is compulsory.", "Try an exercise: help White make the correct first move.", "Correct. Now see how maximum capture can be used tactically.", "Black is attacking two of your pieces. Use maximum capture to gain an advantage.", "Correct. Using the opponent's maximum-capture obligation this way is called a forcing attachment.", "The forced continuation completes the tactic.", "Try again. You will find the correct solution soon."
  ]) },
  { id: 13, title: C("土耳其规则", "Turkish capture rule"), icon: chapterStar, pages: numberedPages(13, 7, [
    "In international draughts, a piece already crossed during a capture sequence may not be crossed again. This is the Turkish rule.", "For example, Black makes this move and White's king begins a capture sequence.", "The king has only one legal landing. It cannot stop on a red square because the shadowed piece was already crossed.", "Now see how the Turkish rule can be used in a real position.", "White has made this move. Help Black's king complete its capture.", "Correct—you have mastered the Turkish rule.", "White used the Turkish rule tactically and successfully promoted a man."
  ]) },
  { id: 14, title: C("胜负判断", "Victory conditions"), icon: victoryIcon, pages: numberedPages(14, 4, [
    "Winning condition one: capture all of the opponent's pieces.", "White captured all of Black's pieces, so White wins.", "Winning condition two: leave the opponent with no legal move.", "After White's move, Black's men are blocked and cannot advance, so White wins."
  ]) },
  { id: 15, title: C("和棋判断", "Draw conditions"), icon: victoryIcon, pages: numberedPages(15, 2, [
    "When neither player can defeat the other, the position is a draw.", "Later lessons will introduce standard drawn positions and draws agreed by both players."
  ]) }
];

function localize(copy: Copy, language: Language) { return copy[language]; }

function legacyPieceState(): GameState {
  const board: BoardSquare[][] = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => null));
  board[4][3] = { id: "lesson-man", color: "white", kind: "man" };
  board[2][7] = { id: "lesson-king", color: "white", kind: "king" };
  return { board, turn: "white", ply: 0, mandatoryCapture: false };
}

function ExistingPiecePage() {
  const { language } = useLanguage();
  const state = useMemo(legacyPieceState, []);
  return (
    <div className="mx-auto min-h-[792px] w-full max-w-[398px] bg-[#fbfaf6] px-5 pb-36 pt-7 text-[#293444]">
      <h1 className="text-center text-2xl font-black">02. {language === "zh" ? "认识棋子" : "Know the pieces"}</h1>
      <p className="text-center text-xs font-semibold text-[#8290a3]">{language === "zh" ? "国际跳棋入门基础" : "International draughts basics"}</p>
      <div className="mt-8 rounded-3xl border border-[#dce4eb] bg-white p-5 text-lg font-semibold leading-8 shadow-sm">
        {language === "zh" ? "普通棋子称为兵。兵抵达对方底线后会升变为王棋，获得更强的移动能力。" : "Ordinary pieces are called men. A man that reaches the opponent's back rank becomes a king with greater movement."}
      </div>
      <div className="relative mt-8"><DraughtsBoard state={state} /><span className="absolute left-[29%] top-[46%] font-black text-[#48bd89]">{language === "zh" ? "兵" : "Man"}</span><span className="absolute right-[8%] top-[24%] font-black text-[#48bd89]">{language === "zh" ? "王棋" : "King"}</span></div>
    </div>
  );
}

function LessonViewer({ lesson, onClose, onComplete }: { lesson: Lesson; onClose: () => void; onComplete: () => void }) {
  const { language, setLanguage } = useLanguage();
  const [pageIndex, setPageIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [firstBoardPoint, setFirstBoardPoint] = useState<{ x: number; y: number }>();
  const [sequencePlaying, setSequencePlaying] = useState(false);
  const page = lesson.pages[pageIndex];
  const completionIndex = lesson.id === 11 || lesson.id === 12 ? 6 : lesson.pages.length - 1;
  const isLast = pageIndex === completionIndex;
  const autoSequenceStart = (lesson.id === 11 || lesson.id === 12) && pageIndex === 4;

  function goToPage(nextIndex: number) {
    setTransitioning(true);
    window.setTimeout(() => { setPageIndex(nextIndex); window.setTimeout(() => setTransitioning(false), 40); }, 170);
  }

  function advance() {
    if (isLast) { onComplete(); return; }
    goToPage(pageIndex + 1);
  }

  function playRequiredSequence() {
    if (!autoSequenceStart || sequencePlaying) return;
    setSequencePlaying(true);
    let next = pageIndex + 1;
    const end = Math.min(completionIndex, pageIndex + 2);
    const timer = window.setInterval(() => {
      goToPage(next);
      if (next >= end) {
        window.clearInterval(timer);
        setSequencePlaying(false);
      }
      next += 1;
    }, 720);
  }

  function registerBoardClick(event: MouseEvent<HTMLButtonElement>) {
    if (!autoSequenceStart || sequencePlaying) return;
    const point = { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY };
    if (!firstBoardPoint) {
      setFirstBoardPoint(point);
      return;
    }
    setFirstBoardPoint(undefined);
    if (Math.hypot(point.x - firstBoardPoint.x, point.y - firstBoardPoint.y) < 30) {
      goToPage(7);
      return;
    }
    playRequiredSequence();
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#f2f2f2]" role="dialog" aria-modal="true" aria-label={localize(lesson.title, language)}>
      <div className="relative mx-auto min-h-[792px] w-full max-w-[398px] overflow-hidden bg-[#fbfaf6] shadow-[0_0_40px_rgba(42,54,66,.12)]">
        {page.asset ? <img src={page.asset} alt="" className={`block h-auto w-full transition duration-200 ${transitioning ? "scale-[.99] opacity-30" : "scale-100 opacity-100"}`} /> : <ExistingPiecePage />}

        {page.asset && language === "en" && (
          <>
            <div className="absolute left-[25%] top-[7.2%] h-[8%] w-[55%] bg-[#fbfaf6] px-1 text-center"><h1 className="text-[17px] font-black leading-tight">{String(lesson.id).padStart(2, "0")}. {lesson.title.en}</h1><p className="mt-1 text-[9px] font-semibold text-[#8290a3]">International draughts basics</p></div>
            <div className="absolute left-[39.5%] top-[17.5%] flex h-[16.5%] w-[53.5%] items-center bg-white px-3 text-[13px] font-semibold leading-5 text-[#455044]">{page.english}</div>
            <div className="absolute left-[5%] top-[28%] flex h-[7%] w-[31%] items-center justify-center bg-[#fbfaf6] text-center text-[11px] font-black text-[#48bd89]">Draff:</div>
          </>
        )}

        <button type="button" onClick={onClose} className="absolute left-[5%] top-[7.5%] h-12 w-12 rounded-full focus-visible:ring-4 focus-visible:ring-[#4fbd8d]" aria-label={language === "zh" ? "返回课程列表" : "Back to lessons"} />
        {autoSequenceStart && <button type="button" onClick={registerBoardClick} className="absolute left-[8%] top-[40%] h-[39%] w-[84%] rounded-xl focus-visible:ring-4 focus-visible:ring-[#4fbd8d]" aria-label={!firstBoardPoint ? (language === "zh" ? "选择棋子" : "Select a piece") : (language === "zh" ? "选择落点" : "Select the destination")} />}
        <button type="button" disabled={autoSequenceStart || sequencePlaying} onClick={advance} className="absolute bottom-[10.2%] left-[7%] h-[6.5%] w-[86%] rounded-full bg-[#4fbd8d] text-base font-black text-white shadow-[0_6px_14px_rgba(79,189,141,.25)] focus-visible:ring-4 focus-visible:ring-[#257a57] disabled:bg-[#b9d9ca]">{autoSequenceStart ? (language === "zh" ? "请在棋盘上走第一步" : "Make the first move on the board") : isLast ? (language === "zh" ? "我学会了" : "I learned it") : (language === "zh" ? "继续" : "Continue")}</button>
        <button type="button" onClick={() => autoSequenceStart ? playRequiredSequence() : !isLast && goToPage(pageIndex + 1)} className="absolute bottom-[3.1%] left-[7%] h-[5.2%] w-[40%] rounded-full border border-[#dce4eb] bg-white text-sm font-black focus-visible:ring-4 focus-visible:ring-[#4fbd8d]">💡 {language === "zh" ? "获得提示" : "Get hint"}</button>
        <button type="button" onClick={() => goToPage((lesson.id === 11 || lesson.id === 12) && pageIndex === 7 ? 4 : 0)} className="absolute bottom-[3.1%] right-[7%] h-[5.2%] w-[40%] rounded-full border border-[#dce4eb] bg-white text-sm font-black focus-visible:ring-4 focus-visible:ring-[#4fbd8d]">↻ {language === "zh" ? "重做一次" : "Try again"}</button>
        <button type="button" onClick={() => setLanguage(language === "zh" ? "en" : "zh")} className="absolute right-[5%] top-[2%] rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-[#2b6c00] shadow" aria-label={language === "zh" ? "Switch to English" : "切换中文"}>{language === "zh" ? "EN" : "中文"}</button>
      </div>
    </div>
  );
}

function LessonTile({ lesson, completed, onClick }: { lesson: Lesson; completed: boolean; onClick: () => void }) {
  const { language } = useLanguage();
  return (
    <button type="button" onClick={onClick} className="relative min-h-[126px] rounded-[28px] border-2 border-[#e2e2e2] bg-white p-4 text-center shadow-[0_5px_0_rgba(0,0,0,.1)] transition hover:-translate-y-1 active:translate-y-1 active:shadow-none">
      <span className="absolute left-4 top-3 text-xs font-black text-[#8c9893]">{String(lesson.id).padStart(2, "0")}</span>
      {completed && <span className="absolute right-4 top-3 font-black text-[#4fbd8d]">✓</span>}
      <img src={lesson.icon} alt="" className="mx-auto h-16 w-16" />
      <p className="mt-3 text-base font-black text-[#202124]">{localize(lesson.title, language)}</p>
    </button>
  );
}

export function LearnPage() {
  const { language, t } = useLanguage();
  const [activeLesson, setActiveLesson] = useState<Lesson>();
  const [completed, setCompleted] = useState<number[]>([]);
  const chapterOne = lessons.slice(0, 2);
  const chapterTwo = lessons.slice(2);

  return (
    <>
      <div className="rounded-[2rem] bg-white p-5 shadow-[0_8px_24px_rgba(45,47,47,.04)] sm:p-7">
        <section className="space-y-5"><div className="flex items-center gap-2"><img src={chapterBook} alt="" className="h-8 w-8" /><h2 className="text-[25px] font-black">{t("chapterOneTitle")}</h2></div><div className="grid grid-cols-2 gap-5 lg:max-w-2xl">{chapterOne.map((lesson) => <LessonTile key={lesson.id} lesson={lesson} completed={completed.includes(lesson.id)} onClick={() => setActiveLesson(lesson)} />)}</div></section>
        <section className="mt-9 space-y-5"><div className="flex items-center gap-2"><img src={chapterStar} alt="" className="h-8 w-8" /><h2 className="text-[25px] font-black">{t("chapterTwoTitle")}</h2></div><div className="grid grid-cols-2 gap-5 lg:grid-cols-3">{chapterTwo.map((lesson) => <LessonTile key={lesson.id} lesson={lesson} completed={completed.includes(lesson.id)} onClick={() => setActiveLesson(lesson)} />)}</div></section>
        <section className="mt-9 space-y-5"><div className="flex items-center gap-2"><img src={lockIcon} alt="" className="h-8 w-8" /><h2 className="text-[25px] font-black">{t("chapterThreeTitle")}</h2></div><div className="flex min-h-[82px] items-center gap-4 rounded-[28px] border-2 border-[#e2e2e2] bg-white px-5 text-[#777]"><span className="grid h-12 w-12 place-items-center rounded-full bg-[#e5e5e5] font-black">…</span><div><p className="font-black">{t("advancedTactics")}</p><p className="text-sm font-bold">{t("advancedTacticsBody")}</p></div></div></section>
      </div>
      {activeLesson && <LessonViewer lesson={activeLesson} onClose={() => setActiveLesson(undefined)} onComplete={() => { setCompleted((current) => current.includes(activeLesson.id) ? current : [...current, activeLesson.id]); setActiveLesson(undefined); }} />}
    </>
  );
}

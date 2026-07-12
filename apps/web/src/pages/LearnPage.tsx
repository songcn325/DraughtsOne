import { useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { readAuthSession } from "../auth/session";
import { useLanguage, type TranslationKey } from "../i18n";
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
import bulbIcon from "../assets/learning-training/learn-bulb-icon.png";
import learnPieces from "../assets/learning-training/learn-pieces.png";

type LessonId = "board" | "pieces" | "manMove" | "capture" | "promotion" | "kingMove" | "kingCapture" | "victory";

type LessonCard = {
  id: LessonId;
  titleKey: TranslationKey;
  icon: string;
  locked?: boolean;
};

const chapterOne: LessonCard[] = [
  { id: "board", titleKey: "learnBoard", icon: boardIcon },
  { id: "pieces", titleKey: "learnPieces", icon: pieceIcon }
];

const chapterTwo: LessonCard[] = [
  { id: "manMove", titleKey: "learnManMove", icon: moveIcon },
  { id: "capture", titleKey: "learnCapture", icon: captureIcon },
  { id: "promotion", titleKey: "learnPromotion", icon: promotionIcon },
  { id: "kingMove", titleKey: "learnKingMove", icon: kingMoveIcon },
  { id: "kingCapture", titleKey: "learnKingCapture", icon: kingCaptureIcon },
  { id: "victory", titleKey: "learnVictory", icon: victoryIcon }
];

const lessonDetails: Record<LessonId, { titleKey: TranslationKey; bodyKey: TranslationKey; progress: number }> = {
  board: { titleKey: "learnBoard", bodyKey: "learnBoardBody", progress: 25 },
  pieces: { titleKey: "learnPieces", bodyKey: "learnPiecesBody", progress: 50 },
  manMove: { titleKey: "learnManMove", bodyKey: "learnManMoveBody", progress: 18 },
  capture: { titleKey: "learnCapture", bodyKey: "learnCaptureBody", progress: 34 },
  promotion: { titleKey: "learnPromotion", bodyKey: "learnPromotionBody", progress: 50 },
  kingMove: { titleKey: "learnKingMove", bodyKey: "learnKingMoveBody", progress: 66 },
  kingCapture: { titleKey: "learnKingCapture", bodyKey: "learnKingCaptureBody", progress: 82 },
  victory: { titleKey: "learnVictory", bodyKey: "learnVictoryBody", progress: 100 }
};

function LessonHeader({ title, progress, onBack }: { title: string; progress?: number; onBack: () => void }) {
  const { t } = useLanguage();
  const session = readAuthSession();

  return (
    <header className="sticky top-0 z-20 bg-white">
      {typeof progress === "number" && (
        <div className="h-1.5 bg-[#e2e2e2]">
          <div className="h-full bg-[#2b6c00]" style={{ width: `${progress}%` }} />
        </div>
      )}
      <div className="flex h-[60px] items-center justify-between border-b border-[#e2e2e2] px-6 text-[#2b6c00]">
        <button type="button" onClick={onBack} className="grid h-10 w-10 place-items-center" aria-label={t("back")}>
          <span className="material-symbols-outlined text-4xl">arrow_back</span>
        </button>
        <h1 className="text-xl font-black">{title}</h1>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-3xl">language</span>
          {!progress && (
            <Link to={session ? "/profile" : "/login"} className="text-base font-black">
              {t("me")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function ChapterTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <img src={icon} alt="" className="h-8 w-8" />
      <h2 className="text-[25px] font-black leading-tight text-[#202124]">{title}</h2>
    </div>
  );
}

function LessonTile({ lesson, active, onClick }: { lesson: LessonCard; active?: boolean; onClick: () => void }) {
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[126px] rounded-[28px] border-2 p-4 text-center shadow-[0_5px_0_rgba(0,0,0,0.10)] transition active:translate-y-1 active:shadow-none ${
        active ? "border-[#58cc02] bg-[#58cc02]" : "border-[#e2e2e2] bg-white"
      }`}
    >
      <img src={lesson.icon} alt="" className="mx-auto h-16 w-16" />
      <p className="mt-3 text-base font-black text-[#202124]">{t(lesson.titleKey)}</p>
    </button>
  );
}

function LockedModule() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-[82px] items-center gap-4 rounded-[28px] border-2 border-[#e2e2e2] bg-white px-5">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-[#e5e5e5] text-xl font-black text-[#777]">...</div>
      <div>
        <p className="font-black text-[#777]">{t("advancedTactics")}</p>
        <p className="text-sm font-bold text-[#777]">{t("advancedTacticsBody")}</p>
      </div>
    </div>
  );
}

function BoardGrid({ children, framed = false }: { children?: ReactNode; framed?: boolean }) {
  const cells = Array.from({ length: 100 }, (_, index) => {
    const row = Math.floor(index / 10);
    const col = index % 10;
    return { row, col, dark: (row + col) % 2 === 1 };
  });

  return (
    <div className={`relative mx-auto mt-10 w-full max-w-[420px] ${framed ? "rounded-[12px] border border-[#e2e2e2] p-2" : ""}`}>
      <div className="grid grid-cols-10 overflow-hidden rounded-[10px] bg-[#dedede]">
        {cells.map((cell) => (
          <div key={`${cell.row}-${cell.col}`} className={`aspect-square ${cell.dark ? "bg-[#d9d9d9]" : "bg-white"}`} />
        ))}
      </div>
      <div className={framed ? "absolute inset-2" : "absolute inset-0"}>{children}</div>
    </div>
  );
}

function Piece({ row, col, color = "white", king = false }: { row: number; col: number; color?: "white" | "black"; king?: boolean }) {
  return (
    <span
      className={`absolute z-10 grid h-[8.5%] w-[8.5%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full ${
        color === "black"
          ? "bg-[#333] shadow-[0_3px_5px_rgba(0,0,0,0.18)]"
          : "bg-white shadow-[inset_0_-3px_6px_rgba(0,0,0,0.08),0_3px_5px_rgba(0,0,0,0.18)]"
      }`}
      style={{ left: `${(col + 0.5) * 10}%`, top: `${(row + 0.5) * 10}%` }}
    >
      {king && (
        <span className="grid h-[64%] w-[64%] place-items-center rounded-full bg-white/95 shadow-[0_1px_4px_rgba(0,0,0,0.16)]">
          <span className="material-symbols-outlined fill king-symbol text-[#d3a600]" aria-hidden="true">crown</span>
        </span>
      )}
    </span>
  );
}

function Target({ row, col }: { row: number; col: number }) {
  return <span className="absolute h-[6%] w-[6%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#44d48d] bg-white/30" style={{ left: `${(col + 0.5) * 10}%`, top: `${(row + 0.5) * 10}%` }} />;
}

function BoardArrow({ from, to, dashed = false }: { from: [number, number]; to: [number, number]; dashed?: boolean }) {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <marker id={`learn-arrow-${from.join("-")}-${to.join("-")}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#44d48d" />
        </marker>
      </defs>
      <line
        x1={(from[1] + 0.5) * 10}
        y1={(from[0] + 0.5) * 10}
        x2={(to[1] + 0.5) * 10}
        y2={(to[0] + 0.5) * 10}
        stroke="#44d48d"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={dashed ? "2 2" : undefined}
        markerEnd={`url(#learn-arrow-${from.join("-")}-${to.join("-")})`}
      />
    </svg>
  );
}

function TeachingBoard({ lessonId }: { lessonId: LessonId }) {
  const { t } = useLanguage();
  const cells = Array.from({ length: 100 }, (_, index) => {
    const row = Math.floor(index / 10);
    const col = index % 10;
    const dark = (row + col) % 2 === 1;
    const black = row < 4 && dark;
    const white = row > 5 && dark;
    return { row, col, dark, black, white };
  });

  if (lessonId === "pieces") {
    return (
      <BoardGrid>
        <div className="absolute left-[22%] top-[35%] text-xl font-black text-[#008246] sm:text-2xl">{t("man")}</div>
        <Piece row={4} col={3} />
        <div className="absolute right-[16%] top-[5%] text-xl font-black text-[#008246] sm:text-2xl">{t("king")}</div>
        <Piece row={2} col={7} king />
      </BoardGrid>
    );
  }

  if (lessonId === "manMove") {
    return (
      <BoardGrid>
        <BoardArrow from={[6, 3]} to={[5, 4]} />
        <Piece row={6} col={3} />
      </BoardGrid>
    );
  }

  if (lessonId === "capture") {
    return (
      <BoardGrid>
        <Target row={3} col={2} />
        <Target row={7} col={2} />
        <Piece row={4} col={3} color="black" />
        <Piece row={6} col={3} color="black" />
        <Piece row={5} col={4} />
      </BoardGrid>
    );
  }

  if (lessonId === "promotion") {
    return (
      <BoardGrid>
        <Target row={0} col={1} />
        <BoardArrow from={[1, 2]} to={[0, 1]} />
        <Piece row={0} col={1} king />
      </BoardGrid>
    );
  }

  if (lessonId === "kingMove") {
    return (
      <BoardGrid>
        <BoardArrow from={[4, 4]} to={[1, 1]} />
        <BoardArrow from={[4, 4]} to={[1, 7]} />
        <BoardArrow from={[4, 4]} to={[7, 1]} />
        <BoardArrow from={[4, 4]} to={[7, 7]} />
        <Piece row={4} col={4} king />
      </BoardGrid>
    );
  }

  if (lessonId === "kingCapture") {
    return (
      <BoardGrid>
        <Target row={8} col={1} />
        <BoardArrow from={[8, 1]} to={[1, 8]} dashed />
        <Piece row={6} col={3} color="black" />
        <Piece row={3} col={6} color="black" />
        <Piece row={8} col={1} king />
      </BoardGrid>
    );
  }

  if (lessonId === "victory") {
    return (
      <div>
        <div className="mx-auto mt-8 w-fit rounded-[30px] bg-[#84ff32] px-12 py-5 text-center text-[#2b6c00]">
          <p className="text-3xl font-black">{t("victory")}</p>
          <p className="text-sm font-bold">{t("allOpponentPiecesCaptured")}</p>
        </div>
        <BoardGrid>
          <Piece row={0} col={1} color="black" />
          <Piece row={1} col={0} />
          <Piece row={1} col={2} />
          <Piece row={2} col={3} />
        </BoardGrid>
      </div>
    );
  }

  return (
    <BoardGrid framed>
      <>
        {cells.map((cell) => (
          <span key={`${cell.row}-${cell.col}`} className={`absolute ${cell.dark ? "" : ""}`}>
            {cell.black && <span className="absolute left-1/2 top-1/2 h-[74%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#333]" />}
            {cell.white && <span className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[inset_0_0_0_2px_#eeeeee,0_1px_2px_rgba(0,0,0,0.18)]" />}
          </span>
        ))}
        {cells.map((cell) => (
          <span key={`piece-${cell.row}-${cell.col}`}>
            {cell.black && <Piece row={cell.row} col={cell.col} color="black" />}
            {cell.white && <Piece row={cell.row} col={cell.col} />}
          </span>
        ))}
      </>
    </BoardGrid>
  );
}

function LessonDetail({ lessonId, onBack, onNext }: { lessonId: LessonId; onBack: () => void; onNext: () => void }) {
  const { t } = useLanguage();
  const detail = lessonDetails[lessonId];
  const isPieces = lessonId === "pieces";

  return (
    <div className="rounded-[2rem] bg-white shadow-[0_8px_24px_rgba(45,47,47,0.04)]">
      <LessonHeader title={t(detail.titleKey)} progress={detail.progress} onBack={onBack} />
      <main className="mx-auto max-w-2xl px-6 pb-28">
        <TeachingBoard lessonId={lessonId} />
        <section className="mt-10 flex gap-3 rounded-[32px] border-2 border-[#e2e2e2] bg-[#f3f3f3] px-5 py-5 shadow-[0_4px_0_rgba(0,0,0,0.08)]">
          <img src={bulbIcon} alt="" className="mt-1 h-5 w-5" />
          <p className="text-lg font-bold leading-8 text-[#505050]">{t(detail.bodyKey)}</p>
        </section>
        <div className="mt-10 space-y-5">
          {isPieces && (
            <button type="button" onClick={onBack} className="w-full rounded-[28px] bg-[#58cc02] py-4 text-xl font-black text-[#2b6c00] shadow-[0_8px_0_#2b6c00] active:translate-y-1 active:shadow-none">
              {t("finishExercise")}
            </button>
          )}
          <button type="button" onClick={onNext} className="w-full rounded-[28px] bg-[#58cc02] py-4 text-xl font-black text-[#2b6c00] shadow-[0_8px_0_#2b6c00] active:translate-y-1 active:shadow-none">
            {t("understandContinue")}
          </button>
        </div>
      </main>
    </div>
  );
}

export function LearnPage() {
  const { t } = useLanguage();
  const [activeLesson, setActiveLesson] = useState<LessonId | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<LessonId | null>(null);

  if (activeLesson) {
    const order = [...chapterOne, ...chapterTwo].map((lesson) => lesson.id);
    const nextLesson = order[order.indexOf(activeLesson) + 1] ?? null;
    return (
      <LessonDetail
        lessonId={activeLesson}
        onBack={() => setActiveLesson(null)}
        onNext={() => {
          setSelectedLesson(nextLesson);
          setActiveLesson(nextLesson);
        }}
      />
    );
  }

  return (
    <div className="rounded-[2rem] bg-white p-5 shadow-[0_8px_24px_rgba(45,47,47,0.04)] sm:p-7">
      <main className="space-y-8">
        <section className="space-y-5">
          <ChapterTitle icon={chapterBook} title={t("chapterOneTitle")} />
          <div className="grid grid-cols-2 gap-5 lg:max-w-2xl">
            {chapterOne.map((lesson) => (
              <LessonTile
                key={lesson.id}
                lesson={lesson}
                active={selectedLesson === lesson.id}
                onClick={() => {
                  setSelectedLesson(lesson.id);
                  setActiveLesson(lesson.id);
                }}
              />
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <ChapterTitle icon={chapterStar} title={t("chapterTwoTitle")} />
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
            {chapterTwo.map((lesson) => (
              <LessonTile
                key={lesson.id}
                lesson={lesson}
                active={selectedLesson === lesson.id}
                onClick={() => {
                  setSelectedLesson(lesson.id);
                  setActiveLesson(lesson.id);
                }}
              />
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <ChapterTitle icon={lockIcon} title={t("chapterThreeTitle")} />
          <LockedModule />
        </section>

        <img src={learnPieces} alt="" className="mx-auto mt-8 h-48 w-48 object-cover" />
      </main>
    </div>
  );
}

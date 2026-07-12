import { useState } from "react";
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

const lessonDetails: Record<LessonId, { titleKey: TranslationKey; bodyKey: TranslationKey; progress: number; kind: "board" | "pieces" }> = {
  board: { titleKey: "learnBoard", bodyKey: "learnBoardBody", progress: 25, kind: "board" },
  pieces: { titleKey: "learnPieces", bodyKey: "learnPiecesBody", progress: 50, kind: "pieces" },
  manMove: { titleKey: "learnManMove", bodyKey: "learnManMoveBody", progress: 18, kind: "pieces" },
  capture: { titleKey: "learnCapture", bodyKey: "learnCaptureBody", progress: 34, kind: "pieces" },
  promotion: { titleKey: "learnPromotion", bodyKey: "learnPromotionBody", progress: 50, kind: "pieces" },
  kingMove: { titleKey: "learnKingMove", bodyKey: "learnKingMoveBody", progress: 66, kind: "pieces" },
  kingCapture: { titleKey: "learnKingCapture", bodyKey: "learnKingCaptureBody", progress: 82, kind: "pieces" },
  victory: { titleKey: "learnVictory", bodyKey: "learnVictoryBody", progress: 100, kind: "pieces" }
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

function TeachingBoard({ kind }: { kind: "board" | "pieces" }) {
  const { t } = useLanguage();
  const cells = Array.from({ length: 100 }, (_, index) => {
    const row = Math.floor(index / 10);
    const col = index % 10;
    const dark = (row + col) % 2 === 1;
    const black = row < 4 && dark;
    const white = row > 5 && dark;
    return { row, col, dark, black, white };
  });

  if (kind === "pieces") {
    return (
      <div className="relative mx-auto mt-10 grid w-[330px] max-w-full grid-cols-10 overflow-hidden bg-[#dedede]">
        {cells.map((cell) => (
          <div key={`${cell.row}-${cell.col}`} className={`aspect-square ${cell.dark ? "bg-[#d9d9d9]" : "bg-white"}`} />
        ))}
        <div className="absolute left-[27%] top-[45%] text-lg font-black text-[#008246]">{t("man")}</div>
        <div className="absolute left-[25%] top-[51%] h-7 w-7 rounded-full bg-white shadow-[inset_0_0_0_2px_#eeeeee,0_1px_2px_rgba(0,0,0,0.18)]" />
        <div className="absolute right-[19%] top-[-4px] text-lg font-black text-[#008246]">{t("king")}</div>
        <div className="absolute right-[21%] top-[2%] grid h-7 w-7 place-items-center rounded-full bg-white shadow-[inset_0_0_0_2px_#eeeeee,0_1px_2px_rgba(0,0,0,0.18)]">
          <span className="text-xs font-black text-[#d7d7d7]">◎</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 rounded-[12px] border border-[#e2e2e2] p-2">
      <div className="grid w-[330px] max-w-full grid-cols-10 overflow-hidden rounded-[10px] bg-[#dedede]">
        {cells.map((cell) => (
          <div key={`${cell.row}-${cell.col}`} className={`relative aspect-square ${cell.dark ? "bg-[#d9d9d9]" : "bg-white"}`}>
            {cell.black && <span className="absolute left-1/2 top-1/2 h-[74%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#333]" />}
            {cell.white && <span className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[inset_0_0_0_2px_#eeeeee,0_1px_2px_rgba(0,0,0,0.18)]" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function LessonDetail({ lessonId, onBack, onNext }: { lessonId: LessonId; onBack: () => void; onNext: () => void }) {
  const { t } = useLanguage();
  const detail = lessonDetails[lessonId];
  const isPieces = lessonId === "pieces";

  return (
    <div className="min-h-screen bg-white">
      <LessonHeader title={t(detail.titleKey)} progress={detail.progress} onBack={onBack} />
      <main className="px-6 pb-28">
        <TeachingBoard kind={detail.kind} />
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

  if (activeLesson) {
    const order = [...chapterOne, ...chapterTwo].map((lesson) => lesson.id);
    const nextLesson = order[order.indexOf(activeLesson) + 1] ?? null;
    return (
      <LessonDetail
        lessonId={activeLesson}
        onBack={() => setActiveLesson(null)}
        onNext={() => setActiveLesson(nextLesson)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white pb-28">
      <LessonHeader title={t("learn")} onBack={() => window.history.back()} />
      <main className="space-y-8 px-5 py-9">
        <section className="space-y-5">
          <ChapterTitle icon={chapterBook} title={t("chapterOneTitle")} />
          <div className="grid grid-cols-2 gap-5">
            {chapterOne.map((lesson, index) => (
              <LessonTile key={lesson.id} lesson={lesson} active={index === 0} onClick={() => setActiveLesson(lesson.id)} />
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <ChapterTitle icon={chapterStar} title={t("chapterTwoTitle")} />
          <div className="grid grid-cols-2 gap-5">
            {chapterTwo.map((lesson) => (
              <LessonTile key={lesson.id} lesson={lesson} onClick={() => setActiveLesson(lesson.id)} />
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

import { useState } from "react";
import { LearningBoard } from "../components/learning/LearningBoard";
import { LessonFrame } from "../components/learning/LessonFrame";
import { learningLessons, type Copy, type LearningLesson } from "../data/learningLessons";
import { useLanguage } from "../i18n";
import chapterBook from "../assets/learn/learn-chapter-book.png";
import chapterStar from "../assets/learn/learn-chapter-star.png";
import lockIcon from "../assets/learn/learn-lock-icon.png";

type Square = [number, number];

function localize(copy: Copy, language: "zh" | "en") { return copy[language]; }

function LessonTile({ lesson, completed, onClick }: { lesson: LearningLesson; completed: boolean; onClick: () => void }) {
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

function LessonViewer({ lesson, onClose, onComplete }: { lesson: LearningLesson; onClose: () => void; onComplete: () => void }) {
  const { language, setLanguage } = useLanguage();
  const [pageIndex, setPageIndex] = useState(0);
  const [selected, setSelected] = useState<Square>();
  const [sequencePlaying, setSequencePlaying] = useState(false);
  const completionIndex = lesson.id === 11 || lesson.id === 12 ? 6 : lesson.pages.length - 1;
  const isLast = pageIndex === completionIndex;
  const requiredMove = (lesson.id === 11 || lesson.id === 12) && pageIndex === 4;
  const errorPage = (lesson.id === 11 || lesson.id === 12) && pageIndex === 7;

  function goTo(next: number) {
    setSelected(undefined);
    setPageIndex(next);
  }

  function advance() {
    if (isLast) onComplete();
    else goTo(pageIndex + 1);
  }

  function playAutomaticContinuation() {
    if (!requiredMove || sequencePlaying) return;
    setSequencePlaying(true);
    window.setTimeout(() => goTo(pageIndex + 1), 480);
    window.setTimeout(() => {
      goTo(Math.min(completionIndex, pageIndex + 2));
      setSequencePlaying(false);
    }, 1060);
  }

  function chooseSquare(square: Square) {
    if (!requiredMove || sequencePlaying) return;
    if (!selected) {
      setSelected(square);
      return;
    }
    if (selected[0] === square[0] && selected[1] === square[1]) {
      goTo(7);
      return;
    }
    playAutomaticContinuation();
  }

  const primaryLabel = errorPage
    ? language === "zh" ? "重做一次" : "Try again"
    : requiredMove
    ? language === "zh" ? "请在棋盘上走第一步" : "Make the first move on the board"
    : lesson.id === 1 && isLast ? language === "zh" ? "我学会了，下一节内容" : "I learned it—next lesson"
    : isLast ? language === "zh" ? "我学会了" : "I learned it"
    : language === "zh" ? "继续" : "Continue";

  return <LessonFrame
    language={language}
    lessonNumber={lesson.id}
    title={lesson.title}
    page={pageIndex}
    pageCount={lesson.pages.length}
    message={lesson.pages[pageIndex].copy}
    board={<LearningBoard lesson={lesson.id} page={pageIndex} selected={selected} onSquareClick={requiredMove ? chooseSquare : undefined} />}
    primaryLabel={primaryLabel}
    primaryDisabled={requiredMove || sequencePlaying}
    showSecondary={lesson.id !== 1}
    onBack={onClose}
    onPrimary={() => errorPage ? goTo(4) : advance()}
    onHint={() => requiredMove ? playAutomaticContinuation() : !isLast && goTo(pageIndex + 1)}
    onRetry={() => goTo((lesson.id === 11 || lesson.id === 12) && pageIndex === 7 ? 4 : 0)}
    onToggleLanguage={() => setLanguage(language === "zh" ? "en" : "zh")}
  />;
}

export function LearnPage() {
  const { t } = useLanguage();
  const [activeLesson, setActiveLesson] = useState<LearningLesson>();
  const [completed, setCompleted] = useState<number[]>([]);
  const chapterOne = learningLessons.slice(0, 2);
  const chapterTwo = learningLessons.slice(2);

  return (
    <>
      <div className="rounded-[2rem] bg-white p-5 shadow-[0_8px_24px_rgba(45,47,47,.04)] sm:p-7">
        <section className="space-y-5"><div className="flex items-center gap-2"><img src={chapterBook} alt="" className="h-8 w-8" /><h2 className="text-[25px] font-black">{t("chapterOneTitle")}</h2></div><div className="grid grid-cols-2 gap-5 lg:max-w-2xl">{chapterOne.map((lesson) => <LessonTile key={lesson.id} lesson={lesson} completed={completed.includes(lesson.id)} onClick={() => setActiveLesson(lesson)} />)}</div></section>
        <section className="mt-9 space-y-5"><div className="flex items-center gap-2"><img src={chapterStar} alt="" className="h-8 w-8" /><h2 className="text-[25px] font-black">{t("chapterTwoTitle")}</h2></div><div className="grid grid-cols-2 gap-5 lg:grid-cols-3">{chapterTwo.map((lesson) => <LessonTile key={lesson.id} lesson={lesson} completed={completed.includes(lesson.id)} onClick={() => setActiveLesson(lesson)} />)}</div></section>
        <section className="mt-9 space-y-5"><div className="flex items-center gap-2"><img src={lockIcon} alt="" className="h-8 w-8" /><h2 className="text-[25px] font-black">{t("chapterThreeTitle")}</h2></div><div className="flex min-h-[82px] items-center gap-4 rounded-[28px] border-2 border-[#e2e2e2] bg-white px-5 text-[#777]"><span className="grid h-12 w-12 place-items-center rounded-full bg-[#e5e5e5] font-black">…</span><div><p className="font-black">{t("advancedTactics")}</p><p className="text-sm font-bold">{t("advancedTacticsBody")}</p></div></div></section>
      </div>
      {activeLesson && <LessonViewer key={activeLesson.id} lesson={activeLesson} onClose={() => setActiveLesson(undefined)} onComplete={() => { setCompleted((current) => current.includes(activeLesson.id) ? current : [...current, activeLesson.id]); setActiveLesson(activeLesson.id === 1 ? learningLessons[1] : undefined); }} />}
    </>
  );
}

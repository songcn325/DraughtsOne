import { applyMove, generateLegalMoves } from "@draughtsone/draughts-engine";
import { useMemo, useState } from "react";
import type { BoardPoint, GameState } from "@draughtsone/shared";
import { mockTrainingTasks } from "../data/mockTrainingTasks";
import { DraughtsBoard } from "../components/DraughtsBoard";
import { TactileButton } from "../components/TactileButton";
import { useLanguage, type TranslationKey } from "../i18n";
import mascot from "../assets/learning-training/training-mascot.png";
import rewardGem from "../assets/learning-training/reward-gem.png";
import trophyIcon from "../assets/learning-training/trophy-icon.png";

const firstTask = mockTrainingTasks[0];

function samePoint(a: BoardPoint, b: BoardPoint) {
  return a.row === b.row && a.col === b.col;
}

export function TrainPage() {
  const { t } = useLanguage();
  const [activeTaskId, setActiveTaskId] = useState(firstTask.id);
  const activeTask = mockTrainingTasks.find((task) => task.id === activeTaskId) ?? firstTask;
  const [state, setState] = useState<GameState>(() => firstTask.boardPosition);
  const [selected, setSelected] = useState<BoardPoint>();
  const [feedbackKey, setFeedbackKey] = useState<TranslationKey>("task");
  const [feedbackValues, setFeedbackValues] = useState<Record<string, string>>({ title: t("forcedCapture") });
  const [showHint, setShowHint] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const legalMoves = useMemo(() => generateLegalMoves(state), [state]);
  const selectedMoves = selected ? legalMoves.filter((move) => samePoint(move.from, selected)) : [];
  const taskTitle = (taskId: string) => t(taskId === "daily-2" ? "kingLaneControl" : "forcedCapture");
  const activeTaskIndex = Math.max(0, mockTrainingTasks.findIndex((task) => task.id === activeTask.id));
  const progressPercent = ((activeTaskIndex + 1) / mockTrainingTasks.length) * 100;

  function startTask(taskId: string) {
    const task = mockTrainingTasks.find((candidate) => candidate.id === taskId);
    if (!task) return;
    setActiveTaskId(task.id);
    setState(task.boardPosition);
    setSelected(undefined);
    setFeedbackKey("task");
    setFeedbackValues({ title: t("forcedCapture") });
    setShowHint(true);
    setShowSuccess(false);
  }

  function resetTask() {
    setState(activeTask.boardPosition);
    setSelected(undefined);
    setFeedbackKey("task");
    setFeedbackValues({ title: taskTitle(activeTask.id) });
    setShowSuccess(false);
  }

  function nextTask() {
    const next = mockTrainingTasks[(activeTaskIndex + 1) % mockTrainingTasks.length];
    startTask(next.id);
  }

  function handleSquareClick(point: BoardPoint) {
    if (showSuccess) return;
    const piece = state.board[point.row][point.col];
    if (piece?.color === state.turn) {
      setSelected(point);
      setFeedbackKey("chooseDestination");
      setFeedbackValues({});
      return;
    }
    if (!selected) return;
    const move = selectedMoves.find((candidate) => samePoint(candidate.to, point));
    if (!move) {
      setFeedbackKey("tryAnother");
      setFeedbackValues({});
      return;
    }
    const expectedMove = activeTask.solution[0];
    const solved = !expectedMove || (samePoint(expectedMove.from, move.from) && samePoint(expectedMove.to, move.to));
    if (!solved) {
      setFeedbackKey("tryAnother");
      setFeedbackValues({});
      return;
    }
    setState(applyMove(state, move));
    setSelected(undefined);
    setFeedbackKey(move.captures.length > 0 ? "goodCapture" : "legalMove");
    setFeedbackValues({});
    setShowSuccess(true);
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(320px,520px)_1fr]">
      <section className="relative overflow-hidden rounded-[2rem] bg-primary-fixed p-6 shadow-[0_8px_0_#235b00] lg:col-span-2">
        <div className="relative z-10 flex items-center gap-4">
          <img src={mascot} alt="" className="h-16 w-16 rounded-2xl bg-white/70 p-2" />
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-primary">{t("trainingKicker")}</p>
            <h1 className="text-3xl font-black text-[#153f00]">{t("dailyTraining")}</h1>
            <p className="font-semibold text-[#2f5f1b]">{t("nowTraining", { title: taskTitle(activeTask.id) })}</p>
          </div>
        </div>
        <div className="absolute right-5 top-5 rounded-full bg-white/80 px-4 py-2 font-black text-[#423200]">{t("tasks", { value: mockTrainingTasks.length })}</div>
      </section>

      <section className="space-y-4">
        <section className="rounded-[2rem] bg-surface-container-lowest p-5 shadow-[0_8px_24px_rgba(45,47,47,0.06)] lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black">{t("dailyPuzzle")}</h2>
              <p className="mt-1 font-semibold text-on-surface-variant">{t("findBestMove")}</p>
            </div>
            <div className="grid h-16 w-16 place-items-center rounded-full bg-[#ffcc00] text-center text-sm font-black text-[#806700]">
              {t("tasksBadge", { value: mockTrainingTasks.length })}
            </div>
          </div>
          <div className="mt-5 rounded-[1.5rem] border border-[#e2e2e2] p-4">
            <div className="flex items-center gap-4">
              <img src={trophyIcon} alt="" className="h-12 w-12 rounded-2xl bg-[#58cc02] p-3" />
              <div className="flex-1">
                <div className="flex justify-between text-sm font-black">
                  <span>{t("dailyProgress")}</span>
                  <span>{activeTaskIndex + 1}/{mockTrainingTasks.length}</span>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#d8f3d3]">
                  <div className="h-full rounded-full bg-[#58cc02]" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {showHint && (
          <section className="rounded-[2rem] bg-surface-container-lowest p-5 shadow-[0_8px_24px_rgba(45,47,47,0.06)] lg:hidden">
            <p className="font-semibold leading-7 text-on-surface-variant">{t("dailyTrainingHint")}</p>
          </section>
        )}

        <div className="rounded-[2rem] bg-surface-container-lowest p-4 shadow-[0_8px_24px_rgba(45,47,47,0.06)]">
          <DraughtsBoard state={state} selected={selected} legalTargets={selectedMoves.map((move) => move.to)} onSquareClick={handleSquareClick} />
        </div>
        <p className="rounded-[1.5rem] bg-surface-container-low p-4 font-bold text-on-surface-variant">
          {t(feedbackKey, feedbackKey === "task" ? { title: t("forcedCapture") } : feedbackValues)}
        </p>
        <div className="grid grid-cols-2 gap-4">
          <TactileButton onClick={() => setShowHint((visible) => !visible)}>
            <span className="material-symbols-outlined">emoji_objects</span>
            {t("hint")}
          </TactileButton>
          <TactileButton tone="surface" onClick={resetTask}>
            <span className="material-symbols-outlined">replay</span>
            {t("retry")}
          </TactileButton>
        </div>
      </section>
      <div className="grid content-start gap-5">
        <section className="rounded-[2rem] bg-surface-container-lowest p-5 shadow-[0_8px_24px_rgba(45,47,47,0.06)]">
          <div className="flex items-center gap-4">
            <img src={rewardGem} alt="" className="h-14 w-14" />
            <div>
              <p className="text-sm font-black uppercase text-primary">{t("trainingReward")}</p>
              <h2 className="text-2xl font-black">{t("trainingRewardTitle")}</h2>
            </div>
          </div>
          <p className="mt-3 font-semibold text-on-surface-variant">{t("trainingRewardBody")}</p>
        </section>

        {mockTrainingTasks.map((task) => (
          <article key={task.id} className={`rounded-[2rem] p-5 shadow-[0_8px_24px_rgba(45,47,47,0.06)] ${task.id === activeTaskId ? "bg-primary-fixed text-[#1a4700]" : "bg-surface-container-low"}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase text-tertiary">{t(task.type as TranslationKey)}</p>
                <h2 className="mt-1 text-xl font-black">{taskTitle(task.id)}</h2>
                <p className="mt-2 font-semibold">{t(task.difficulty as TranslationKey)} · {t("gems", { value: task.rewardGems })}</p>
              </div>
              <img src={trophyIcon} alt="" className="h-12 w-12" />
            </div>
            <TactileButton className="mt-5" tone={task.id === activeTaskId ? "secondary" : "surface"} onClick={() => startTask(task.id)}>{t("startTask")}</TactileButton>
          </article>
        ))}
      </div>
      {showSuccess && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-black/55 px-5">
          <section className="relative w-full max-w-md rounded-[2rem] bg-white px-8 py-10 text-center shadow-[0_16px_48px_rgba(0,0,0,0.24)]">
            <img src={rewardGem} alt="" className="mx-auto h-24 w-24" />
            <div className="mx-auto mt-4 w-fit rounded-full bg-[#baf7d2] px-4 py-1 text-sm font-black text-[#0b6b2b]">{t("gemsAward", { value: activeTask.rewardGems + 2 })}</div>
            <h2 className="mt-7 text-4xl font-black text-primary">{t("great")}</h2>
            <p className="mt-2 font-semibold text-on-surface-variant">{t("foundBestMove")}</p>
            <TactileButton className="mt-8 w-full" onClick={nextTask}>{t("nextPuzzle")}</TactileButton>
            <button type="button" className="mt-5 font-black text-primary" onClick={() => setShowSuccess(false)}>{t("viewAnalysis")}</button>
          </section>
        </div>
      )}
    </div>
  );
}

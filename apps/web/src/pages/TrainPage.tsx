import { applyMove, generateLegalMoves } from "@draughtsone/draughts-engine";
import { useMemo, useState } from "react";
import type { BoardPoint, GameState } from "@draughtsone/shared";
import { mockTrainingTasks } from "../data/mockTrainingTasks";
import { DraughtsBoard } from "../components/DraughtsBoard";
import { TactileButton } from "../components/TactileButton";

const firstTask = mockTrainingTasks[0];

function samePoint(a: BoardPoint, b: BoardPoint) {
  return a.row === b.row && a.col === b.col;
}

export function TrainPage() {
  const [activeTaskId, setActiveTaskId] = useState(firstTask.id);
  const activeTask = mockTrainingTasks.find((task) => task.id === activeTaskId) ?? firstTask;
  const [state, setState] = useState<GameState>(() => firstTask.boardPosition);
  const [selected, setSelected] = useState<BoardPoint>();
  const [feedback, setFeedback] = useState(`Task: ${firstTask.title}`);
  const legalMoves = useMemo(() => generateLegalMoves(state), [state]);
  const selectedMoves = selected ? legalMoves.filter((move) => samePoint(move.from, selected)) : [];

  function startTask(taskId: string) {
    const task = mockTrainingTasks.find((candidate) => candidate.id === taskId);
    if (!task) return;
    setActiveTaskId(task.id);
    setState(task.boardPosition);
    setSelected(undefined);
    setFeedback(`Task: ${task.title}`);
  }

  function handleSquareClick(point: BoardPoint) {
    const piece = state.board[point.row][point.col];
    if (piece?.color === state.turn) {
      setSelected(point);
      setFeedback("Choose a highlighted destination.");
      return;
    }
    if (!selected) return;
    const move = selectedMoves.find((candidate) => samePoint(candidate.to, point));
    if (!move) {
      setFeedback("Try another square.");
      return;
    }
    setState(applyMove(state, move));
    setSelected(undefined);
    setFeedback(move.captures.length > 0 ? "Good capture. That is the tactical habit we want." : "Legal move played. Look for forcing captures when available.");
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(320px,520px)_1fr]">
      <div className="lg:col-span-2 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Daily Training</h1>
          <p className="font-semibold text-on-surface-variant">Now training: {activeTask.title}</p>
        </div>
        <div className="rounded-full bg-secondary-fixed px-4 py-2 font-black text-[#423200]">{mockTrainingTasks.length} tasks</div>
      </div>
      <section className="space-y-4">
        <DraughtsBoard state={state} selected={selected} legalTargets={selectedMoves.map((move) => move.to)} onSquareClick={handleSquareClick} />
        <p className="rounded-lg bg-surface-container-low p-4 font-bold text-on-surface-variant">{feedback}</p>
      </section>
      <div className="grid content-start gap-5">
        {mockTrainingTasks.map((task) => (
          <article key={task.id} className={`rounded-lg p-5 ${task.id === activeTaskId ? "bg-primary-fixed text-[#1a4700]" : "bg-surface-container-low"}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase text-tertiary">{task.type}</p>
                <h2 className="mt-1 text-xl font-black">{task.title}</h2>
                <p className="mt-2 font-semibold">{task.difficulty} · {task.rewardGems} gems</p>
              </div>
              <span className="material-symbols-outlined fill text-4xl text-secondary">emoji_events</span>
            </div>
            <TactileButton className="mt-5" tone={task.id === activeTaskId ? "secondary" : "surface"} onClick={() => startTask(task.id)}>Start task</TactileButton>
          </article>
        ))}
      </div>
    </div>
  );
}

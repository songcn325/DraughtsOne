import { mockTrainingTasks } from "../data/mockTrainingTasks";
import { TactileButton } from "../components/TactileButton";

export function TrainPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Daily Training</h1>
          <p className="font-semibold text-on-surface-variant">Puzzle and drill contracts are mock-backed for frontend work.</p>
        </div>
        <div className="rounded-full bg-secondary-fixed px-4 py-2 font-black text-[#423200]">3 tasks</div>
      </div>
      <div className="grid gap-5">
        {mockTrainingTasks.map((task) => (
          <article key={task.id} className="rounded-xl bg-surface-container-low p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-tertiary">{task.type}</p>
                <h2 className="mt-1 text-xl font-black">{task.title}</h2>
                <p className="mt-2 font-semibold text-on-surface-variant">{task.difficulty}</p>
              </div>
              <span className="material-symbols-outlined fill text-4xl text-secondary">emoji_events</span>
            </div>
            <TactileButton className="mt-5">Start task</TactileButton>
          </article>
        ))}
      </div>
    </div>
  );
}


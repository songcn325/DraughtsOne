import { mockLearnPath } from "../data/mockLearnPath";

export function LearnPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <section className="mb-10 rounded-xl bg-primary p-6 text-[#d5ffb9] shadow-[0_8px_0_#235b00]">
        <h1 className="text-3xl font-black tracking-tight">Learning Path</h1>
        <p className="mt-1 font-semibold opacity-90">A playable version of the Google AI Studio learning screen.</p>
      </section>
      <div className="relative flex flex-col items-center gap-16">
        {mockLearnPath.units.map((unit) => (
          <section key={unit.id} className="w-full">
            <div className="mb-10 rounded-xl bg-tertiary p-5 text-[#e9f4ff] shadow-[0_8px_0_#00557a]">
              <h2 className="text-2xl font-black">{unit.title}</h2>
              <p className="font-semibold opacity-90">{unit.subtitle}</p>
            </div>
            <div className="flex flex-col items-center gap-14">
              {unit.nodes.map((node, index) => (
                <button
                  key={node.id}
                  className={`grid h-24 w-24 place-items-center rounded-full text-center shadow-[0_8px_0_rgba(45,47,47,0.12)] ${
                    node.status === "completed" ? "bg-primary text-white" : node.status === "available" ? "bg-primary-fixed text-[#1a4700]" : "bg-surface-container-high text-outline"
                  } ${index % 2 === 0 ? "-translate-x-10" : "translate-x-10"}`}
                >
                  <span className="material-symbols-outlined fill text-4xl">{node.icon}</span>
                  <span className="absolute -bottom-8 text-xs font-black uppercase tracking-widest text-on-surface-variant">{node.title}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}


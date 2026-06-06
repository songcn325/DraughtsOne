import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockLearnPath } from "../data/mockLearnPath";
import { TactileButton } from "../components/TactileButton";
import { useLanguage } from "../i18n";

const lessonKeys = {
  rules: "lessonRules",
  openings: "lessonOpenings",
  positions: "lessonPositions",
  tempo: "lessonTempo",
  endgames: "lessonEndgames"
} as const;

export function LearnPage() {
  const { t } = useLanguage();
  const [activeLesson, setActiveLesson] = useState(mockLearnPath.currentLessonId);
  const navigate = useNavigate();
  const activeNode = mockLearnPath.units.flatMap((unit) => unit.nodes).find((node) => node.id === activeLesson);

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_320px]">
      <section className="rounded-lg bg-primary p-6 text-[#d5ffb9] shadow-[0_8px_0_#235b00] lg:col-span-2">
        <h1 className="text-3xl font-black tracking-tight">{t("learnTitle")}</h1>
        <p className="mt-1 font-semibold opacity-90">{t("learnSubtitle")}</p>
      </section>
      <div className="relative flex flex-col items-center gap-16 rounded-lg bg-surface-container-lowest p-6">
        {mockLearnPath.units.map((unit) => (
          <section key={unit.id} className="w-full">
            <div className="mb-10 rounded-lg bg-tertiary p-5 text-[#e9f4ff] shadow-[0_8px_0_#00557a]">
              <h2 className="text-2xl font-black">{t(unit.id === "unit-basics" ? "unitBasics" : "unitTactics")}</h2>
              <p className="font-semibold opacity-90">{t(unit.id === "unit-basics" ? "unitBasicsSubtitle" : "unitTacticsSubtitle")}</p>
            </div>
            <div className="flex flex-col items-center gap-14">
              {unit.nodes.map((node, index) => (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => node.status !== "locked" && setActiveLesson(node.id)}
                  className={`relative grid h-24 w-24 place-items-center rounded-full text-center shadow-[0_8px_0_rgba(45,47,47,0.12)] ${
                    node.status === "completed" ? "bg-primary text-white" : node.status === "available" ? "bg-primary-fixed text-[#1a4700]" : "bg-surface-container-high text-outline"
                  } ${activeLesson === node.id ? "ring-4 ring-secondary-fixed" : ""} ${index % 2 === 0 ? "-translate-x-10" : "translate-x-10"}`}
                >
                  <span className="material-symbols-outlined fill text-4xl">{node.icon}</span>
                  <span className="absolute -bottom-8 text-xs font-black uppercase text-on-surface-variant">{t(lessonKeys[node.id as keyof typeof lessonKeys])}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
      <aside className="space-y-4">
        <section className="rounded-lg bg-surface-container-low p-5">
          <p className="text-sm font-black uppercase text-primary">{t("currentLesson")}</p>
          <h2 className="mt-2 text-2xl font-black">{activeNode ? t(lessonKeys[activeNode.id as keyof typeof lessonKeys]) : t("openingBasics")}</h2>
          <p className="mt-3 font-semibold text-on-surface-variant">{t("lessonDescription")}</p>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-surface-container-high">
            <div className="h-full rounded-full bg-primary-fixed" style={{ width: `${activeNode?.progressPercent ?? 20}%` }} />
          </div>
          <TactileButton className="mt-5 w-full" onClick={() => navigate("/train")}>{t("startLesson")}</TactileButton>
        </section>
        <section className="rounded-lg bg-surface-container-lowest p-5">
          <h2 className="text-xl font-black">{t("today")}</h2>
          <p className="mt-2 font-semibold text-on-surface-variant">{t("streakGems", { days: mockLearnPath.streakDays, gems: mockLearnPath.gems })}</p>
        </section>
      </aside>
    </div>
  );
}

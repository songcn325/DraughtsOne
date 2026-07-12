import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockLearnPath } from "../data/mockLearnPath";
import { TactileButton } from "../components/TactileButton";
import { useLanguage } from "../i18n";
import learnPieces from "../assets/learning-training/learn-pieces.png";
import instructionCard from "../assets/learning-training/learn-instruction-card.png";
import gridIcon from "../assets/learning-training/learn-grid-icon.png";
import growthIcon from "../assets/learning-training/learn-growth-icon.png";
import duelIcon from "../assets/learning-training/learn-duel-icon.png";

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
  const activeProgress = activeNode?.progressPercent ?? 20;
  const featureCards = [
    { title: t("learnRulesCard"), body: t("learnRulesBody"), icon: gridIcon },
    { title: t("learnTacticsCard"), body: t("learnTacticsBody"), icon: duelIcon },
    { title: t("learnProgressCard"), body: t("learnProgressBody"), icon: growthIcon }
  ];

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="relative overflow-hidden rounded-[2rem] bg-[#79f63a] p-6 shadow-[0_8px_0_#235b00] lg:col-span-2">
        <div className="relative z-10 max-w-xl">
          <p className="text-sm font-black uppercase tracking-wide text-[#246900]">{t("learnKicker")}</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-[#153f00]">{t("learnTitle")}</h1>
          <p className="mt-3 max-w-md text-lg font-bold text-[#2f5f1b]">{t("learnSubtitle")}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <TactileButton onClick={() => navigate("/train")}>{t("continueLearning")}</TactileButton>
            <TactileButton tone="surface" onClick={() => navigate("/classroom")}>{t("enterClassroom")}</TactileButton>
          </div>
        </div>
        <img src={learnPieces} alt="" className="absolute -right-3 bottom-0 hidden w-44 drop-shadow-xl sm:block" />
      </section>

      <section className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          {featureCards.map((card) => (
            <article key={card.title} className="rounded-[1.5rem] bg-surface-container-lowest p-4 shadow-[0_8px_24px_rgba(45,47,47,0.06)]">
              <img src={card.icon} alt="" className="h-12 w-12" />
              <h2 className="mt-3 text-lg font-black">{card.title}</h2>
              <p className="mt-1 text-sm font-bold text-on-surface-variant">{card.body}</p>
            </article>
          ))}
        </div>

        <div className="relative flex flex-col items-center gap-14 rounded-[2rem] bg-surface-container-lowest p-6 shadow-[0_8px_24px_rgba(45,47,47,0.06)]">
          {mockLearnPath.units.map((unit) => (
            <section key={unit.id} className="w-full">
              <div className="mb-9 rounded-[1.5rem] bg-tertiary p-5 text-[#e9f4ff] shadow-[0_8px_0_#00557a]">
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
      </section>

      <aside className="space-y-5">
        <section className="rounded-[2rem] bg-surface-container-low p-5 shadow-[0_8px_24px_rgba(45,47,47,0.06)]">
          <p className="text-sm font-black uppercase text-primary">{t("currentLesson")}</p>
          <h2 className="mt-2 text-2xl font-black">{activeNode ? t(lessonKeys[activeNode.id as keyof typeof lessonKeys]) : t("openingBasics")}</h2>
          <p className="mt-3 font-semibold text-on-surface-variant">{t("lessonDescription")}</p>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-surface-container-high">
            <div className="h-full rounded-full bg-primary-fixed" style={{ width: `${activeProgress}%` }} />
          </div>
          <p className="mt-2 text-sm font-black text-primary">{t("progressPercent", { value: activeProgress })}</p>
          <TactileButton className="mt-5 w-full" onClick={() => navigate("/train")}>{t("startLesson")}</TactileButton>
        </section>

        <section className="overflow-hidden rounded-[2rem] bg-surface-container-lowest shadow-[0_8px_24px_rgba(45,47,47,0.06)]">
          <img src={instructionCard} alt="" className="w-full bg-[#dcffd0] object-cover" />
          <div className="p-5">
            <h2 className="text-xl font-black">{t("coachTip")}</h2>
            <p className="mt-2 font-semibold text-on-surface-variant">{t("coachTipBody")}</p>
          </div>
        </section>

        <section className="rounded-[2rem] bg-surface-container-lowest p-5 shadow-[0_8px_24px_rgba(45,47,47,0.06)]">
          <h2 className="text-xl font-black">{t("today")}</h2>
          <p className="mt-2 font-semibold text-on-surface-variant">{t("streakGems", { days: mockLearnPath.streakDays, gems: mockLearnPath.gems })}</p>
        </section>
      </aside>
    </div>
  );
}

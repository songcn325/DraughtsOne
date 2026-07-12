import { useNavigate } from "react-router-dom";
import { TactileButton } from "../components/TactileButton";
import { useLanguage } from "../i18n";
import classroomHero from "../assets/learning-training/classroom-hero.png";
import trophyIcon from "../assets/learning-training/trophy-icon.png";
import rewardGem from "../assets/learning-training/reward-gem.png";

export function ClassroomPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const cards = [
    { icon: "co_present", title: t("liveClassroom"), body: t("liveClassroomBody") },
    { icon: "smart_display", title: t("recordedLessons"), body: t("recordedLessonsBody") },
    { icon: "groups", title: t("studyGroup"), body: t("studyGroupBody") }
  ];

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="relative overflow-hidden rounded-[2rem] bg-surface-container-low p-6 shadow-[0_8px_24px_rgba(45,47,47,0.06)] lg:col-span-2">
        <div className="relative z-10 max-w-xl">
          <p className="text-sm font-black uppercase tracking-wide text-primary">{t("classroomKicker")}</p>
          <h1 className="mt-2 text-4xl font-black">{t("classroomTitle")}</h1>
          <p className="mt-3 max-w-md text-lg font-bold text-on-surface-variant">{t("classroomSubtitle")}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <TactileButton onClick={() => navigate("/learn")}>{t("reviewLessons")}</TactileButton>
            <TactileButton tone="surface" onClick={() => navigate("/train")}>{t("practiceNow")}</TactileButton>
          </div>
        </div>
        <img src={classroomHero} alt="" className="absolute -bottom-10 -right-6 hidden w-72 sm:block" />
      </section>

      <section className="grid gap-4 sm:grid-cols-3 lg:col-span-2">
        {cards.map((card) => (
          <article key={card.title} className="rounded-[1.75rem] bg-surface-container-lowest p-5 shadow-[0_8px_24px_rgba(45,47,47,0.06)]">
            <span className="material-symbols-outlined fill rounded-2xl bg-primary-fixed p-3 text-3xl text-[#1a4700]">{card.icon}</span>
            <h2 className="mt-4 text-xl font-black">{card.title}</h2>
            <p className="mt-2 font-semibold text-on-surface-variant">{card.body}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] bg-[#d9ffc8] p-5 shadow-[0_8px_0_#9de96b]">
        <p className="text-sm font-black uppercase text-primary">{t("nextClass")}</p>
        <h2 className="mt-2 text-2xl font-black text-[#153f00]">{t("nextClassTitle")}</h2>
        <p className="mt-3 font-bold text-[#2f5f1b]">{t("nextClassBody")}</p>
        <div className="mt-5 flex items-center gap-3 rounded-3xl bg-white/70 p-4">
          <img src={trophyIcon} alt="" className="h-12 w-12" />
          <div>
            <p className="font-black">{t("classReward")}</p>
            <p className="text-sm font-bold text-on-surface-variant">{t("classRewardBody")}</p>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] bg-surface-container-lowest p-5 shadow-[0_8px_24px_rgba(45,47,47,0.06)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase text-primary">{t("classProgress")}</p>
            <h2 className="mt-2 text-2xl font-black">{t("classProgressTitle")}</h2>
          </div>
          <img src={rewardGem} alt="" className="h-16 w-16" />
        </div>
        <p className="mt-3 font-semibold text-on-surface-variant">{t("classProgressBody")}</p>
        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-surface-container-low p-3">
            <p className="text-2xl font-black">3</p>
            <p className="text-xs font-black uppercase text-on-surface-variant">{t("lessons")}</p>
          </div>
          <div className="rounded-2xl bg-surface-container-low p-3">
            <p className="text-2xl font-black">12</p>
            <p className="text-xs font-black uppercase text-on-surface-variant">{t("drills")}</p>
          </div>
          <div className="rounded-2xl bg-surface-container-low p-3">
            <p className="text-2xl font-black">120</p>
            <p className="text-xs font-black uppercase text-on-surface-variant">{t("gemsShort")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

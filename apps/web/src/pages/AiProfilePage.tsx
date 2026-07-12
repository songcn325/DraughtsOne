import { useLanguage } from "../i18n";

const radar = [
  { key: "aiIntuitive", value: 85, color: "#2b6c00" },
  { key: "aiLogical", value: 92, color: "#44b9ee" },
  { key: "aiAggressive", value: 78, color: "#ff4f5f" },
  { key: "aiCalm", value: 64, color: "#e8c84d" }
] as const;

export function AiProfilePage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <section className="rounded-[2rem] bg-surface-container-lowest p-6 shadow-[0_8px_24px_rgba(45,47,47,0.06)] lg:col-span-2">
        <p className="text-sm font-black uppercase tracking-wide text-primary">{t("aiCoach")}</p>
        <h1 className="mt-2 text-4xl font-black">{t("aiAnalysisSystem")}</h1>
        <p className="mt-3 max-w-2xl text-lg font-bold text-on-surface-variant">{t("aiAnalysisIntro")}</p>
      </section>

      <section className="space-y-5">
        <article className="relative overflow-hidden rounded-[2rem] border-4 border-primary bg-[#c9ff4f] p-6 text-center shadow-[0_8px_0_#2b6c00]">
          <div className="absolute -right-10 -top-8 h-36 w-36 rounded-full bg-white/30" />
          <div className="mx-auto grid h-36 w-36 place-items-center rounded-full bg-white">
            <span className="material-symbols-outlined fill text-7xl text-primary">psychology</span>
          </div>
          <h2 className="mt-5 text-3xl font-black text-primary">{t("tacticalHunter")}</h2>
          <p className="text-sm font-black uppercase tracking-widest text-primary">{t("tacticalHunterEn")}</p>
          <div className="mx-auto mt-4 w-fit rounded-full border border-white bg-white/30 px-5 py-2 text-sm font-black text-primary">{t("topFive")}</div>
        </article>

        <section>
          <h2 className="text-2xl font-black">{t("chessRadar")}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {radar.map((item) => (
              <article key={item.key} className="rounded-[1.5rem] border-2 border-[#e2e2e2] bg-white p-4 shadow-[0_4px_0_rgba(0,0,0,0.08)]">
                <div className="flex justify-between text-sm font-black">
                  <span>{t(item.key)}</span>
                  <span style={{ color: item.color }}>{item.value}%</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#e7e7e7]">
                  <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black">{t("personalityTraits")}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_120px]">
            <article className="rounded-[1.5rem] border-2 border-[#e2e2e2] bg-surface-container-low p-5">
              <span className="material-symbols-outlined fill text-3xl text-primary">bolt</span>
              <h3 className="mt-2 text-xl font-black">{t("fastWolf")}</h3>
              <p className="mt-1 font-semibold text-on-surface-variant">{t("fastWolfBody")}</p>
            </article>
            <article className="grid place-items-center rounded-[1.5rem] border-4 border-[#0b6f9f] bg-[#50b9ef] p-5 text-center text-[#064468]">
              <p className="text-4xl font-black">A+</p>
              <p className="font-black">{t("resilienceScore")}</p>
            </article>
          </div>
        </section>
      </section>

      <aside className="space-y-5">
        <article className="rounded-[2rem] border-4 border-[#e2e2e2] bg-white p-5 shadow-[0_6px_0_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-4">
            <div className="grid h-20 w-20 place-items-center rounded-[1.5rem] bg-[#58cc02] text-primary">
              <span className="material-symbols-outlined fill text-5xl">account_tree</span>
            </div>
            <div>
              <h2 className="text-2xl font-black text-primary">{t("checkerStyleAnalysis")}</h2>
              <p className="font-semibold text-on-surface-variant">{t("checkerStyleBody")}</p>
              <p className="mt-2 font-black text-primary">{t("startNow")}</p>
            </div>
          </div>
        </article>

        <article className="rounded-[2rem] border-2 border-dashed border-[#d8d8d8] bg-surface-container-low p-5">
          <div className="flex items-center gap-4">
            <div className="grid h-20 w-20 place-items-center rounded-[1.5rem] bg-white text-on-surface-variant">
              <span className="material-symbols-outlined fill text-4xl">lock</span>
            </div>
            <div>
              <h2 className="text-xl font-black">{t("comingSoon")}</h2>
              <p className="font-semibold text-on-surface-variant">{t("moreAiComing")}</p>
            </div>
          </div>
        </article>

        <article className="relative overflow-hidden rounded-[2rem] bg-[#dff4df] p-6 text-center">
          <div className="absolute inset-x-0 bottom-0 h-24 bg-white/30 [clip-path:polygon(0_60%,20%_35%,40%_65%,65%_20%,100%_50%,100%_100%,0_100%)]" />
          <span className="material-symbols-outlined fill relative z-10 text-6xl text-[#58cc02]">rocket_launch</span>
          <p className="relative z-10 mt-3 text-sm font-black uppercase tracking-[0.2em] text-primary">{t("advancedAiPowered")}</p>
        </article>

        <article className="rounded-[2rem] bg-[#58cc02] p-5 text-[#235b00] shadow-[0_6px_0_#2b6c00]">
          <div className="flex gap-4">
            <span className="material-symbols-outlined fill rounded-2xl bg-[#baf7a8] p-3">support_agent</span>
            <div>
              <h2 className="font-black">{t("psychologyCoach")}</h2>
              <p className="text-sm font-semibold">{t("psychologyCoachBody")}</p>
            </div>
          </div>
        </article>
      </aside>
    </div>
  );
}

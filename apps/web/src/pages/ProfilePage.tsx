import type { UserProfileView } from "@draughtsone/shared";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { clearAuthSession, readAuthSession } from "../auth/session";
import { TactileButton } from "../components/TactileButton";
import { useLanguage } from "../i18n";

export function ProfilePage() {
  const { language, t } = useLanguage();
  const session = readAuthSession();
  const [profile, setProfile] = useState<UserProfileView>();
  const user = profile ?? session?.user;
  const gamesPlayed = profile?.gamesPlayed ?? 0;
  const wins = profile?.wins ?? 0;
  const losses = profile?.losses ?? 0;
  const winRate = gamesPlayed ? Math.round((wins / gamesPlayed) * 100) : 0;

  useEffect(() => {
    if (!session) return;
    void api.me().then((response) => {
      if (response.ok) setProfile(response.data);
    });
  }, [session?.accessToken]);

  async function logout() {
    await api.logout();
    clearAuthSession();
    window.location.assign("/login");
  }

  return (
    <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-[#fff8df] shadow-[0_8px_24px_rgba(45,47,47,0.06)]">
      <section className="bg-gradient-to-br from-[#70c978] to-[#d8e500] p-6 text-white sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-white/90 text-4xl font-black text-primary shadow-[0_4px_18px_rgba(0,0,0,0.12)]">
              {user?.displayName?.[0]?.toUpperCase() ?? (language === "zh" ? "棋" : "D")}
            </div>
            <div>
              <h1 className="text-3xl font-black">{user?.displayName ?? t("internationalDraughtsStudent")}</h1>
              <p className="mt-1 font-semibold opacity-95">{t("studentSubtitle")}</p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white/50 px-3 py-2 font-black text-primary">
                <span className="material-symbols-outlined fill text-lg">person_add</span>
                {user?.accountType === "guest" ? t("beginner") : t("registeredPlayer")}
              </div>
            </div>
          </div>
          {session ? (
            <TactileButton tone="surface" onClick={() => void logout()}>{t("logout")}</TactileButton>
          ) : (
            <Link to="/login" className="rounded-full bg-white px-5 py-3 font-black text-primary shadow-[0_5px_0_rgba(0,0,0,0.12)]">{t("login")}</Link>
          )}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl bg-white/45 p-5 text-center text-primary">
            <span className="material-symbols-outlined fill text-4xl text-[#ffc700]">star</span>
            <p className="mt-2 text-3xl font-black">{user?.rating ?? 0}</p>
            <p className="font-bold">{t("experience")}</p>
          </article>
          <article className="rounded-2xl bg-white/35 p-5 text-center text-primary">
            <span className="material-symbols-outlined fill text-4xl text-[#ffc700]">local_fire_department</span>
            <p className="mt-2 text-3xl font-black">{gamesPlayed.toString().padStart(5, "0")}</p>
            <p className="font-bold">{t("streakDays")}</p>
          </article>
          <article className="rounded-2xl bg-white/35 p-5 text-center text-primary">
            <span className="material-symbols-outlined fill text-4xl text-[#ffc700]">military_tech</span>
            <p className="mt-2 text-3xl font-black">{winRate.toFixed(2)}%</p>
            <p className="font-bold">{t("winRate")}</p>
          </article>
        </div>
      </section>

      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-[1.5rem] border border-[#f0d99d] bg-white/70 p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">{t("learningProgress")}</h2>
            <span className="text-sm font-black text-on-surface-variant">1/6</span>
          </div>
          <p className="mt-3 font-black text-primary">{t("chapterProgressDemo")}</p>
          <div className="mt-3 h-5 overflow-hidden rounded-full bg-[#e6e6ca]">
            <div className="h-full w-1/6 rounded-full bg-gradient-to-r from-[#d9d15f] to-[#fff27d]" />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <span key={step} className={`grid h-9 w-9 place-items-center rounded-full font-black ${step === 1 ? "bg-[#ffc94d] text-white" : "bg-[#dbe8c7] text-[#80905f]"}`}>{step}</span>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-4 rounded-2xl bg-[#e5e5ca] p-5">
            <span className="material-symbols-outlined text-5xl text-[#7c8069]">hourglass_bottom</span>
            <div>
              <p className="font-bold text-[#7c8069]">{t("currentLevel")}</p>
              <p className="text-xl font-black text-primary">{t("currentChapterDemo")}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-[#f0d99d] bg-white/70 p-5 lg:col-span-2">
          <h2 className="text-2xl font-black">{t("battleStats")}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl bg-[#e5e5ca] p-5 text-center">
              <span className="material-symbols-outlined text-5xl text-[#7c8069]">robot_2</span>
              <p className="mt-2 text-lg font-black text-primary">{t("aiBattle")}</p>
              <p className="mt-2 text-5xl font-black text-[#789100]">{winRate.toFixed(2)}%</p>
              <p className="font-black text-on-surface-variant">{t("winRate")}</p>
            </article>
            <article className="rounded-2xl bg-[#e5e5ca] p-5 text-center">
              <span className="material-symbols-outlined text-5xl text-[#7c8069]">person</span>
              <p className="mt-2 text-lg font-black text-primary">{t("onlineBattle")}</p>
              <p className="mt-2 text-5xl font-black text-[#789100]">{winRate.toFixed(2)}%</p>
              <p className="font-black text-on-surface-variant">{t("winRate")}</p>
            </article>
          </div>
        </section>

        <Link to="/matches" className="rounded-full border-t border-[#9bad5d] py-4 text-center font-black text-on-surface-variant lg:col-span-2">{t("viewHistory")}</Link>
      </div>
    </div>
  );
}

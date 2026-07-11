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
    <div className="mx-auto max-w-2xl">
      <section className="rounded-xl bg-surface-container-low p-6">
        <div className="flex items-center gap-5">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-primary-fixed text-3xl font-black text-primary">{user?.displayName?.[0]?.toUpperCase() ?? (language === "zh" ? "棋" : "D")}</div>
          <div>
            <h1 className="text-3xl font-black">{user?.displayName ?? t("demoPlayer")}</h1>
            <p className="font-semibold text-on-surface-variant">{user ? t("rating", { value: user.rating }) : t("profileStats")}</p>
            {user?.accountType === "guest" && <Link to="/login" className="mt-2 inline-block font-black text-primary">{t("createAccount")}</Link>}
          </div>
        </div>
        {profile && (
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-surface-container-lowest p-4">
              <p className="text-sm font-black uppercase text-primary">{t("games")}</p>
              <p className="text-2xl font-black">{profile.gamesPlayed}</p>
            </div>
            <div className="rounded-lg bg-surface-container-lowest p-4">
              <p className="text-sm font-black uppercase text-primary">{t("wins")}</p>
              <p className="text-2xl font-black">{profile.wins}</p>
            </div>
            <div className="rounded-lg bg-surface-container-lowest p-4">
              <p className="text-sm font-black uppercase text-primary">{t("losses")}</p>
              <p className="text-2xl font-black">{profile.losses}</p>
            </div>
          </div>
        )}
        {session && <TactileButton className="mt-6" tone="surface" onClick={() => void logout()}>{t("logout")}</TactileButton>}
      </section>
      <Link to="/matches" className="mt-6 block rounded-xl bg-surface-container-lowest p-5 font-black text-primary">{t("viewHistory")}</Link>
    </div>
  );
}

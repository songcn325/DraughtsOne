import { Link } from "react-router-dom";
import { useLanguage } from "../i18n";

export function ProfilePage() {
  const { language, t } = useLanguage();
  return (
    <div className="mx-auto max-w-2xl">
      <section className="rounded-xl bg-surface-container-low p-6">
        <div className="flex items-center gap-5">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-primary-fixed text-3xl font-black text-primary">{language === "zh" ? "棋" : "D"}</div>
          <div>
            <h1 className="text-3xl font-black">{t("demoPlayer")}</h1>
            <p className="font-semibold text-on-surface-variant">{t("profileStats")}</p>
          </div>
        </div>
      </section>
      <Link to="/matches" className="mt-6 block rounded-xl bg-surface-container-lowest p-5 font-black text-primary">{t("viewHistory")}</Link>
    </div>
  );
}

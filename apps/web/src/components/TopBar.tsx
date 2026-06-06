import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n";

export function TopBar() {
  const { language, setLanguage, t } = useLanguage();
  const [languageOpen, setLanguageOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link to="/learn" className="flex items-center gap-3 text-primary">
          <span className="material-symbols-outlined">menu</span>
          <span className="text-2xl font-black tracking-tight">DraughtsOne</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button type="button" onClick={() => setLanguageOpen((open) => !open)} className="grid h-10 w-10 place-items-center rounded-full bg-surface-container-lowest text-primary shadow-[0_4px_0_#dbdddd]" aria-label={t("language")} aria-expanded={languageOpen}>
              <span className="material-symbols-outlined">language</span>
            </button>
            {languageOpen && (
              <div className="absolute right-0 top-12 z-50 w-36 rounded-xl bg-surface-container-lowest p-2 shadow-[0_12px_32px_rgba(45,47,47,0.16)]">
                {(["en", "zh"] as const).map((option) => (
                  <button key={option} type="button" onClick={() => { setLanguage(option); setLanguageOpen(false); }} className={`w-full rounded-lg px-3 py-2 text-left text-sm font-black ${language === option ? "bg-primary-fixed text-primary" : "text-on-surface"}`}>
                    {option === "en" ? t("english") : t("chinese")}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link to="/profile" className="rounded-full bg-surface-container-lowest px-4 py-2 text-sm font-extrabold text-primary shadow-[0_4px_0_#dbdddd]">
            {t("me")}
          </Link>
        </div>
      </div>
    </header>
  );
}

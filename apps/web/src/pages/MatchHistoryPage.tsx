import { useLanguage, type TranslationKey } from "../i18n";

export function MatchHistoryPage() {
  const { t } = useLanguage();
  const results: TranslationKey[] = ["winResignation", "lossTimeout", "draw"];
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-black">{t("matchHistory")}</h1>
      <div className="mt-6 space-y-4">
        {results.map((result, index) => (
          <article key={result} className="rounded-xl bg-surface-container-low p-5">
            <p className="font-black">{t(result)}</p>
            <p className="text-sm font-semibold text-on-surface-variant">{t("replayAvailable", { value: index + 1 })}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

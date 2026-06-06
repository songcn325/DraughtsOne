import { useLanguage, type TranslationKey } from "../i18n";

export function AiProfilePage() {
  const { t } = useLanguage();
  const dimensions: TranslationKey[] = ["tactics", "openings", "endgames"];
  return (
    <div className="mx-auto max-w-2xl">
      <section className="rounded-xl bg-tertiary p-6 text-[#e9f4ff] shadow-[0_8px_0_#00557a]">
        <h1 className="text-3xl font-black">{t("aiProfile")}</h1>
        <p className="mt-2 font-semibold opacity-90">{t("aiPlaceholder")}</p>
      </section>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {dimensions.map((label, index) => (
          <div key={label} className="rounded-xl bg-surface-container-low p-5">
            <p className="text-sm font-black uppercase tracking-widest text-on-surface-variant">{t(label)}</p>
            <p className="mt-3 text-4xl font-black text-primary">{72 + index * 7}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

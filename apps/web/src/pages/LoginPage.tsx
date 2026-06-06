import { TactileButton } from "../components/TactileButton";
import { useLanguage } from "../i18n";

export function LoginPage() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-md">
      <section className="rounded-xl bg-surface-container-low p-6">
        <h1 className="text-3xl font-black">{t("login")}</h1>
        <div className="mt-6 space-y-4">
          <input className="w-full rounded-full bg-surface-container-lowest px-5 py-4 font-semibold outline-none" placeholder={t("username")} />
          <input className="w-full rounded-full bg-surface-container-lowest px-5 py-4 font-semibold outline-none" placeholder={t("password")} type="password" />
          <TactileButton className="w-full">{t("continue")}</TactileButton>
        </div>
      </section>
    </div>
  );
}

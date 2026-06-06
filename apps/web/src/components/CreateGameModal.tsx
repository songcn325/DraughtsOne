import { TactileButton } from "./TactileButton";
import { useLanguage, type TranslationKey } from "../i18n";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (timeControl: string) => void;
};

export function CreateGameModal({ open, onClose, onCreate }: Props) {
  const { t } = useLanguage();
  if (!open) return null;
  const controls = [
    { value: "10 minutes", label: "tenMinutes" },
    { value: "5 + 3 blitz", label: "fiveBlitz" },
    { value: "3 minutes", label: "threeMinutes" }
  ] as const;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-end bg-black/20 p-4 sm:place-items-center">
      <section className="w-full max-w-md rounded-lg bg-surface p-6 shadow-[0_24px_80px_rgba(45,47,47,0.18)]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-black">{t("createRoomTitle")}</h2>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-surface-container-low">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="space-y-3">
          {controls.map((control) => (
            <button key={control.value} onClick={() => onCreate(control.value)} className="w-full rounded-lg bg-surface-container-low p-4 text-left font-extrabold">
              {t("privateRoom", { control: t(control.label as TranslationKey) })}
            </button>
          ))}
        </div>
        <TactileButton className="mt-6 w-full" onClick={() => onCreate("10 minutes")}>
          <span className="material-symbols-outlined fill">add</span>
          {t("createLocalRoom")}
        </TactileButton>
      </section>
    </div>
  );
}

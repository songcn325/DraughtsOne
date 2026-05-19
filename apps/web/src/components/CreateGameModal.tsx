import { TactileButton } from "./TactileButton";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (timeControl: string) => void;
};

export function CreateGameModal({ open, onClose, onCreate }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-end bg-black/20 p-4 sm:place-items-center">
      <section className="w-full max-w-md rounded-lg bg-surface p-6 shadow-[0_24px_80px_rgba(45,47,47,0.18)]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-black">Create Room</h2>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-surface-container-low">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="space-y-3">
          {["10 minutes", "5 + 3 blitz", "3 minutes"].map((control) => (
            <button key={control} onClick={() => onCreate(control)} className="w-full rounded-lg bg-surface-container-low p-4 text-left font-extrabold">
              {control} · private room
            </button>
          ))}
        </div>
        <TactileButton className="mt-6 w-full" onClick={() => onCreate("10 minutes")}>
          <span className="material-symbols-outlined fill">add</span>
          Create local MVP room
        </TactileButton>
      </section>
    </div>
  );
}

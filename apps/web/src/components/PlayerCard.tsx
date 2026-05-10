type Props = {
  name: string;
  rating: number;
  clock: string;
  active?: boolean;
};

export function PlayerCard({ name, rating, clock, active }: Props) {
  return (
    <section className={`flex items-center justify-between rounded-xl p-4 ${active ? "bg-primary-fixed/25" : "bg-surface-container-low"}`}>
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-surface-container-lowest font-black text-primary">{name.slice(0, 1)}</div>
        <div>
          <h2 className="font-extrabold">{name}</h2>
          <p className="text-sm font-semibold text-on-surface-variant">{rating} rating</p>
        </div>
      </div>
      <div className="rounded-full bg-surface-container-lowest px-4 py-2 font-mono font-black">{clock}</div>
    </section>
  );
}


import { Link } from "react-router-dom";

export function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <section className="rounded-xl bg-surface-container-low p-6">
        <div className="flex items-center gap-5">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-primary-fixed text-3xl font-black text-primary">D</div>
          <div>
            <h1 className="text-3xl font-black">Demo Player</h1>
            <p className="font-semibold text-on-surface-variant">1188 rating · 5 day streak</p>
          </div>
        </div>
      </section>
      <Link to="/matches" className="mt-6 block rounded-xl bg-surface-container-lowest p-5 font-black text-primary">View match history</Link>
    </div>
  );
}


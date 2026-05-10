import { useState } from "react";
import { Link } from "react-router-dom";
import { CreateGameModal } from "../components/CreateGameModal";
import { TactileButton } from "../components/TactileButton";

export function PlayHallPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto max-w-2xl">
      <section className="rounded-xl bg-surface-container-low p-6">
        <p className="text-sm font-black uppercase tracking-widest text-primary">Game Hall</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Play real-person PK</h1>
        <p className="mt-3 font-semibold text-on-surface-variant">Create private rooms, join by code, or enter a simple quick-match queue.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <TactileButton onClick={() => setOpen(true)}>
            <span className="material-symbols-outlined fill">add</span>
            Create room
          </TactileButton>
          <TactileButton tone="secondary">
            <span className="material-symbols-outlined fill">bolt</span>
            Quick match
          </TactileButton>
        </div>
      </section>
      <section className="mt-6 rounded-xl bg-surface-container-lowest p-5">
        <h2 className="text-xl font-black">Developer route</h2>
        <p className="mt-2 font-semibold text-on-surface-variant">Use a mock game board while backend rooms are connected.</p>
        <Link to="/game/demo-game" className="mt-4 inline-flex font-black text-primary">Open demo board</Link>
      </section>
      <CreateGameModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}


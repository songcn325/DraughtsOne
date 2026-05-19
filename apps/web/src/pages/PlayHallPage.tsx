import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreateGameModal } from "../components/CreateGameModal";
import { TactileButton } from "../components/TactileButton";

export function PlayHallPage() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const roomCode = useMemo(() => `DO-${Math.floor(1000 + Math.random() * 9000)}`, []);

  function openRoom(timeControl: string) {
    setOpen(false);
    navigate(`/game/${encodeURIComponent(`${roomCode}-${timeControl.replaceAll(" ", "-")}`)}`);
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-lg bg-surface-container-low p-6">
        <p className="text-sm font-black uppercase text-primary">Game Hall</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Play 10x10 draughts now</h1>
        <p className="mt-3 font-semibold text-on-surface-variant">Create a private room, start a quick local match, or share a room code while the online backend is being hardened.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <TactileButton onClick={() => setOpen(true)}>
            <span className="material-symbols-outlined fill">add</span>
            Create room
          </TactileButton>
          <TactileButton tone="secondary" onClick={() => openRoom("quick match")}>
            <span className="material-symbols-outlined fill">bolt</span>
            Quick match
          </TactileButton>
        </div>
      </section>
      <section className="rounded-lg bg-surface-container-lowest p-5">
        <h2 className="text-xl font-black">MVP Room</h2>
        <p className="mt-2 font-semibold text-on-surface-variant">Room code</p>
        <p className="mt-2 rounded-lg bg-surface-container-low p-4 text-3xl font-black text-primary">{roomCode}</p>
        <div className="mt-5 grid gap-3">
          <Link to="/game/demo-game" className="rounded-full bg-surface-container-low px-5 py-3 text-center font-black text-primary shadow-[0_6px_0_#dbdddd]">Open demo board</Link>
          <Link to="/train" className="rounded-full bg-surface-container-low px-5 py-3 text-center font-black text-on-surface shadow-[0_6px_0_#dbdddd]">Warm up with training</Link>
        </div>
      </section>
      <CreateGameModal open={open} onClose={() => setOpen(false)} onCreate={openRoom} />
    </div>
  );
}

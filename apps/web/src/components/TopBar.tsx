import { Link } from "react-router-dom";

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link to="/learn" className="flex items-center gap-3 text-primary">
          <span className="material-symbols-outlined">menu</span>
          <span className="text-2xl font-black tracking-tight">DraughtsOne</span>
        </Link>
        <Link to="/profile" className="rounded-full bg-surface-container-lowest px-4 py-2 text-sm font-extrabold text-primary shadow-[0_4px_0_#dbdddd]">
          5 streak · 120 gems
        </Link>
      </div>
    </header>
  );
}


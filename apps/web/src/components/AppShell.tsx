import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { TopBar } from "./TopBar";

export function AppShell() {
  return (
    <div className="min-h-screen bg-surface pb-28 text-on-surface">
      <TopBar />
      <main className="mx-auto w-full max-w-5xl px-5 py-8">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}


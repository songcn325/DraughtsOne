import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { TopBar } from "./TopBar";

export function AppShell() {
  const { pathname } = useLocation();
  const isLearnPage = pathname === "/learn";

  return (
    <div className={`min-h-screen text-on-surface ${isLearnPage ? "bg-white pb-0" : "bg-surface pb-28"}`}>
      {!isLearnPage && <TopBar />}
      <main className={isLearnPage ? "mx-auto w-full max-w-[390px] bg-white" : "mx-auto w-full max-w-5xl px-5 py-8"}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

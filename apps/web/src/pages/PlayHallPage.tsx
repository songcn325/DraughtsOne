import type { MatchmakingStatusPayload } from "@draughtsone/shared";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CreateGameModal } from "../components/CreateGameModal";
import { TactileButton } from "../components/TactileButton";
import { useLanguage } from "../i18n";
import { getOrCreateGuestSession, storeOnlineColor } from "../auth/guestSession";
import { createGameSocket, type GameSocket } from "../socket/gameSocket";

export function PlayHallPage() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [matchmakingStatus, setMatchmakingStatus] = useState<"idle" | "connecting" | "searching" | "delayed" | "timedOut">("idle");
  const [queueInfo, setQueueInfo] = useState<MatchmakingStatusPayload>();
  const [matchmakingError, setMatchmakingError] = useState<string>();
  const socketRef = useRef<GameSocket>();
  const autoMatchStartedRef = useRef(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const autoMatch = searchParams.get("match") === "online";
  const roomCode = useMemo(() => `DO-${Math.floor(1000 + Math.random() * 9000)}`, []);

  useEffect(() => () => {
    socketRef.current?.disconnect();
  }, []);

  function openRoom(timeControl: string) {
    setOpen(false);
    navigate(`/game/${encodeURIComponent(`${roomCode}-${timeControl.replaceAll(" ", "-")}`)}`);
  }

  async function startMatchmaking() {
    socketRef.current?.disconnect();
    setMatchmakingStatus("connecting");
    setMatchmakingError(undefined);
    setQueueInfo(undefined);
    try {
      const session = await getOrCreateGuestSession();
      const socket = createGameSocket(session.accessToken);
      socketRef.current = socket;
      socket.on("connect", () => {
        socket.emit("matchmaking:join", { timeControl: { initialSeconds: 600, incrementSeconds: 0 } });
      });
      socket.on("matchmaking:status", (status) => {
        setQueueInfo(status);
        setMatchmakingStatus(status.status);
      });
      socket.on("matchmaking:timedOut", (status) => {
        setQueueInfo(status);
        setMatchmakingStatus("timedOut");
        socket.disconnect();
      });
      socket.on("matchmaking:matched", ({ game, assignedColor }) => {
        storeOnlineColor(game.id, assignedColor);
        socket.disconnect();
        navigate(`/online-game/${game.id}`);
      });
      socket.on("connect_error", () => {
        setMatchmakingError(t("connectionLost"));
        setMatchmakingStatus("idle");
      });
      socket.connect();
    } catch {
      setMatchmakingError(t("connectionLost"));
      setMatchmakingStatus("idle");
    }
  }

  useEffect(() => {
    if (!autoMatch || autoMatchStartedRef.current) return;
    autoMatchStartedRef.current = true;
    void startMatchmaking();
  }, [autoMatch]);

  function cancelMatchmaking() {
    socketRef.current?.emit("matchmaking:cancel");
    socketRef.current?.disconnect();
    socketRef.current = undefined;
    setMatchmakingStatus("idle");
    setQueueInfo(undefined);
  }

  const waiting = matchmakingStatus === "connecting" || matchmakingStatus === "searching" || matchmakingStatus === "delayed";
  const elapsed = formatElapsed(queueInfo?.waitedSeconds ?? 0);

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-lg bg-surface-container-low p-6">
        <p className="text-sm font-black uppercase text-primary">{t("gameHall")}</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">{t("playNow")}</h1>
        <p className="mt-3 font-semibold text-on-surface-variant">{t("hallDescription")}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <TactileButton onClick={() => setOpen(true)}>
            <span className="material-symbols-outlined fill">add</span>
            {t("createRoom")}
          </TactileButton>
          <TactileButton tone="secondary" onClick={() => void startMatchmaking()} disabled={waiting}>
            <span className="material-symbols-outlined fill">bolt</span>
            {t("onlineMatch")}
          </TactileButton>
        </div>
      </section>
      <section className="rounded-lg bg-surface-container-lowest p-5">
        <h2 className="text-xl font-black">{t("mvpRoom")}</h2>
        <p className="mt-2 font-semibold text-on-surface-variant">{t("roomCode")}</p>
        <p className="mt-2 rounded-lg bg-surface-container-low p-4 text-3xl font-black text-primary">{roomCode}</p>
        <div className="mt-5 grid gap-3">
          <Link to="/game/demo-game" className="rounded-full bg-surface-container-low px-5 py-3 text-center font-black text-primary shadow-[0_6px_0_#dbdddd]">{t("openDemo")}</Link>
          <Link to="/train" className="rounded-full bg-surface-container-low px-5 py-3 text-center font-black text-on-surface shadow-[0_6px_0_#dbdddd]">{t("warmUp")}</Link>
        </div>
      </section>
      <CreateGameModal open={open} onClose={() => setOpen(false)} onCreate={openRoom} />
      {(waiting || matchmakingStatus === "timedOut") && (
        <div className="fixed inset-0 z-[70] grid place-items-end bg-black/25 p-4 sm:place-items-center">
          <section className="w-full max-w-md rounded-lg bg-surface p-6 shadow-[0_24px_80px_rgba(45,47,47,0.2)]">
            <p className="text-sm font-black uppercase text-primary">{t("waitingRoom")}</p>
            {matchmakingStatus === "timedOut" ? (
              <>
                <h2 className="mt-2 text-2xl font-black">{t("noOpponent")}</h2>
                <p className="mt-3 font-semibold text-on-surface-variant">{t("guestIdentityNote")}</p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <TactileButton onClick={() => void startMatchmaking()}>{t("tryAgain")}</TactileButton>
                  <TactileButton tone="surface" onClick={cancelMatchmaking}>{t("cancel")}</TactileButton>
                </div>
              </>
            ) : (
              <>
                <h2 className="mt-2 text-3xl font-black">{t("searchingOpponent")}</h2>
                <p className="mt-3 font-mono text-lg font-black text-primary">{t("searchingElapsed", { time: elapsed })}</p>
                {matchmakingStatus === "delayed" && (
                  <p className="mt-4 rounded-lg bg-secondary-fixed/35 p-4 font-semibold text-on-surface-variant">{t("delayedSearch")}</p>
                )}
                <p className="mt-4 text-sm font-semibold text-on-surface-variant">{t("guestIdentityNote")}</p>
                <TactileButton className="mt-6 w-full" tone="surface" onClick={cancelMatchmaking}>{t("cancelSearch")}</TactileButton>
              </>
            )}
          </section>
        </div>
      )}
      {matchmakingError && <p className="fixed bottom-24 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-error px-5 py-3 font-bold text-white">{matchmakingError}</p>}
    </div>
  );
}

function formatElapsed(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

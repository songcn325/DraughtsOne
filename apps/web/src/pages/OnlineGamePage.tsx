import { generateLegalMoves } from "@draughtsone/draughts-engine";
import type { BoardPoint, Game, GameMove, PlayerColor } from "@draughtsone/shared";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrCreateGuestSession } from "../auth/guestSession";
import { DraughtsBoard } from "../components/DraughtsBoard";
import { PlayerCard } from "../components/PlayerCard";
import { TactileButton } from "../components/TactileButton";
import { useLanguage } from "../i18n";
import { createGameSocket, type GameSocket } from "../socket/gameSocket";
import { createClientMoveId } from "../utils/clientId";
import { buildOnlinePdn, displayedClockSeconds } from "../utils/onlineGame";

function samePoint(a: BoardPoint, b: BoardPoint) {
  return a.row === b.row && a.col === b.col;
}

function formatClock(seconds = 0) {
  return `${Math.floor(seconds / 60)}:${String(Math.max(0, seconds % 60)).padStart(2, "0")}`;
}

export function OnlineGamePage() {
  const { gameId = "" } = useParams();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game>();
  const [playerId, setPlayerId] = useState<string>();
  const [selected, setSelected] = useState<BoardPoint>();
  const [latestMove, setLatestMove] = useState<GameMove>();
  const [moveHistory, setMoveHistory] = useState<GameMove[]>([]);
  const [pendingMove, setPendingMove] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState(t("connectingGame"));
  const [moveError, setMoveError] = useState<string>();
  const [nowMs, setNowMs] = useState(Date.now());
  const [resignConfirmOpen, setResignConfirmOpen] = useState(false);
  const [exitBlockedOpen, setExitBlockedOpen] = useState(false);
  const [pdnDialogOpen, setPdnDialogOpen] = useState(false);
  const socketRef = useRef<GameSocket>();

  useEffect(() => {
    let disposed = false;
    void getOrCreateGuestSession()
      .then((session) => {
        if (disposed) return;
        setPlayerId(session.user.id);
        const socket = createGameSocket(session.accessToken);
        socketRef.current = socket;
        socket.on("connect", () => {
          setConnectionMessage("");
          socket.emit("game:ready", { gameId });
        });
        socket.on("disconnect", () => setConnectionMessage(t("connectionLost")));
        socket.on("game:state", ({ game: nextGame, moves = [] }) => {
          setGame(nextGame);
          setMoveHistory(moves);
          setLatestMove(moves[moves.length - 1]);
        });
        socket.on("game:moveAccepted", ({ game: nextGame, move }) => {
          setGame(nextGame);
          setLatestMove(move);
          setMoveHistory((history) => [...history.filter((item) => item.id !== move.id), move]);
          setSelected(undefined);
          setPendingMove(false);
          setMoveError(undefined);
        });
        socket.on("game:moveRejected", ({ error }) => {
          setPendingMove(false);
          setMoveError(error.message || t("moveRejected"));
        });
        socket.on("game:ended", ({ game: nextGame }) => {
          setGame(nextGame);
          setPendingMove(false);
        });
        socket.on("connect_error", () => setConnectionMessage(t("connectionLost")));
        socket.connect();
      })
      .catch(() => setConnectionMessage(t("connectionLost")));

    return () => {
      disposed = true;
      socketRef.current?.disconnect();
    };
  }, [gameId]);

  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const playerColor: PlayerColor | undefined = game?.playerWhiteId === playerId ? "white" : game?.playerBlackId === playerId ? "black" : undefined;
  const legalMoves = useMemo(() => game ? generateLegalMoves(game.state) : [], [game]);
  const selectedMoves = selected ? legalMoves.filter((move) => samePoint(move.from, selected)) : [];
  const canMove = Boolean(game && playerColor === game.state.turn && !game.state.winner && !pendingMove);
  const captureIsMandatory = canMove && legalMoves.some((move) => move.captures.length > 0);
  const whitePlayer = game?.players?.find((player) => player.color === "white");
  const blackPlayer = game?.players?.find((player) => player.color === "black");
  const pdnText = useMemo(() => game ? buildOnlinePdn(game, moveHistory) : "", [game, moveHistory]);

  function handleSquareClick(point: BoardPoint) {
    if (!game || !canMove) return;
    const piece = game.state.board[point.row][point.col];
    if (piece?.color === playerColor) {
      setSelected(point);
      const options = legalMoves.filter((move) => samePoint(move.from, point));
      if (captureIsMandatory && options.length === 0) setMoveError(t("captureRequiredOnline"));
      else setMoveError(undefined);
      return;
    }
    if (!selected) return;
    const move = selectedMoves.find((candidate) => samePoint(candidate.to, point));
    if (!move) return;
    const socket = socketRef.current;
    if (!socket?.connected) {
      setMoveError(t("connectionLost"));
      return;
    }
    try {
      setPendingMove(true);
      socket.emit("game:move", {
        gameId,
        move: { from: move.from, to: move.to, path: move.path, clientMoveId: createClientMoveId() }
      });
    } catch {
      setPendingMove(false);
      setMoveError(t("moveRejected"));
    }
  }

  if (!game) {
    return <section className="mx-auto max-w-lg rounded-lg bg-surface-container-low p-8 text-center text-xl font-black">{connectionMessage || t("connectingGame")}</section>;
  }

  const winnerText = game.state.winner ? t("sideWins", { side: t(game.state.winner === "white" ? "white" : "black") }) : undefined;
  const whiteClock = displayedClockSeconds(game, "white", nowMs);
  const blackClock = displayedClockSeconds(game, "black", nowMs);
  const gameHasEnded = Boolean(game.state.winner || game.status === "ended");

  function exitGame() {
    if (!gameHasEnded) {
      setExitBlockedOpen(true);
      return;
    }
    navigate("/play");
  }

  function startNewOnlineGame() {
    navigate("/play?match=online");
  }

  function confirmResign() {
    socketRef.current?.emit("game:resign", { gameId });
    setResignConfirmOpen(false);
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(320px,520px)_1fr]">
      <section className="space-y-4">
        <PlayerCard
          name={blackPlayer?.displayName ?? t("blackSide")}
          rating={blackPlayer?.rating ?? 1200}
          clock={formatClock(blackClock)}
          active={game.state.turn === "black"}
        />
        <DraughtsBoard
          state={game.state}
          selected={selected}
          legalTargets={canMove ? selectedMoves.map((move) => move.to) : []}
          latestMove={latestMove?.payload}
          onSquareClick={handleSquareClick}
        />
        <PlayerCard
          name={whitePlayer?.displayName ?? t("whiteSide")}
          rating={whitePlayer?.rating ?? 1200}
          clock={formatClock(whiteClock)}
          active={game.state.turn === "white"}
        />
      </section>
      <aside className="space-y-4">
        <section className="rounded-lg bg-surface-container-low p-5">
          <p className="text-sm font-black uppercase text-primary">{t("onlineGame")}</p>
          <h1 className="mt-1 text-2xl font-black">{game.roomCode}</h1>
          <p className="mt-3 font-bold text-on-surface-variant">
            {playerColor ? t("youAre", { side: t(playerColor === "white" ? "white" : "black") }) : ""}
          </p>
          <p className="mt-2 rounded-lg bg-surface-container-lowest p-4 text-lg font-black text-primary">
            {winnerText ?? (canMove ? t("yourTurn") : t("opponentTurn"))}
          </p>
          {captureIsMandatory && (
            <p className="mt-3 rounded-lg bg-secondary-fixed/40 p-3 font-black text-[#644c00]">{t("captureRequiredOnline")}</p>
          )}
          {moveError && <p className="mt-3 rounded-lg bg-error/10 p-3 font-bold text-error">{moveError}</p>}
          {connectionMessage && <p className="mt-3 rounded-lg bg-secondary-fixed/35 p-3 font-bold">{connectionMessage}</p>}
          <div className="mt-5 grid grid-cols-2 gap-3">
            {!gameHasEnded ? (
              <TactileButton tone="danger" onClick={() => setResignConfirmOpen(true)}>{t("resign")}</TactileButton>
            ) : (
              <TactileButton onClick={startNewOnlineGame}>{t("newOnlineGame")}</TactileButton>
            )}
            <TactileButton tone="surface" onClick={exitGame}>{t("exitGame")}</TactileButton>
          </div>
        </section>
        <section className="rounded-lg bg-surface-container-lowest p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black">{t("moveList")}</h2>
            <button type="button" onClick={() => setPdnDialogOpen(true)} className="rounded-full bg-surface-container-low px-4 py-2 text-sm font-black text-primary">
              {t("exportMoves")}
            </button>
          </div>
          <p className="mt-3 font-semibold text-on-surface-variant">
            {moveHistory.length === 0 ? t("noMoves") : moveHistory.map((move) => (
              <span key={move.id} className="mb-2 block rounded-lg bg-surface-container-low px-3 py-2">
                {move.moveNumber}. {move.payload.from.row + 1},{move.payload.from.col + 1} → {move.payload.to.row + 1},{move.payload.to.col + 1}
              </span>
            ))}
          </p>
        </section>
      </aside>
      {resignConfirmOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-end bg-black/25 p-4 sm:place-items-center">
          <section className="w-full max-w-sm rounded-lg bg-surface p-6 shadow-[0_24px_80px_rgba(45,47,47,0.2)]">
            <h2 className="text-2xl font-black">{t("confirmResignOnline")}</h2>
            <p className="mt-3 font-semibold text-on-surface-variant">{t("confirmResignOnlineBody")}</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <TactileButton tone="surface" onClick={() => setResignConfirmOpen(false)}>{t("cancel")}</TactileButton>
              <TactileButton tone="danger" onClick={confirmResign}>{t("confirm")}</TactileButton>
            </div>
          </section>
        </div>
      )}
      {exitBlockedOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-end bg-black/25 p-4 sm:place-items-center">
          <section className="w-full max-w-sm rounded-lg bg-surface p-6 shadow-[0_24px_80px_rgba(45,47,47,0.2)]">
            <h2 className="text-2xl font-black">{t("activeGameExitTitle")}</h2>
            <p className="mt-3 font-semibold text-on-surface-variant">{t("activeGameExitBody")}</p>
            <TactileButton className="mt-6 w-full" onClick={() => setExitBlockedOpen(false)}>{t("continuePlaying")}</TactileButton>
          </section>
        </div>
      )}
      {pdnDialogOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-end bg-black/25 p-4 sm:place-items-center">
          <section className="w-full max-w-lg rounded-lg bg-surface p-6 shadow-[0_24px_80px_rgba(45,47,47,0.2)]">
            <h2 className="text-2xl font-black">{t("pdnExport")}</h2>
            <p className="mt-2 font-semibold text-on-surface-variant">{t("pdnDescription")}</p>
            <textarea className="mt-4 h-64 w-full resize-none rounded-lg bg-surface-container-low p-4 font-mono text-sm font-bold outline-none" readOnly value={pdnText} />
            <div className="mt-5 grid grid-cols-2 gap-3">
              <TactileButton onClick={() => void navigator.clipboard?.writeText(pdnText)}>{t("copy")}</TactileButton>
              <TactileButton tone="surface" onClick={() => setPdnDialogOpen(false)}>{t("close")}</TactileButton>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

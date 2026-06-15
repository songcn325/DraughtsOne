import { generateLegalMoves } from "@draughtsone/draughts-engine";
import type { BoardPoint, Game, GameMove, PlayerColor } from "@draughtsone/shared";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrCreateGuestSession } from "../auth/guestSession";
import { DraughtsBoard } from "../components/DraughtsBoard";
import { PlayerCard } from "../components/PlayerCard";
import { TactileButton } from "../components/TactileButton";
import { useLanguage } from "../i18n";
import { createGameSocket, type GameSocket } from "../socket/gameSocket";

function samePoint(a: BoardPoint, b: BoardPoint) {
  return a.row === b.row && a.col === b.col;
}

function formatClock(seconds = 0) {
  return `${Math.floor(seconds / 60)}:${String(Math.max(0, seconds % 60)).padStart(2, "0")}`;
}

export function OnlineGamePage() {
  const { gameId = "" } = useParams();
  const { t } = useLanguage();
  const [game, setGame] = useState<Game>();
  const [playerId, setPlayerId] = useState<string>();
  const [selected, setSelected] = useState<BoardPoint>();
  const [latestMove, setLatestMove] = useState<GameMove>();
  const [moveHistory, setMoveHistory] = useState<GameMove[]>([]);
  const [pendingMove, setPendingMove] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState(t("connectingGame"));
  const [moveError, setMoveError] = useState<string>();
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

  const playerColor: PlayerColor | undefined = game?.playerWhiteId === playerId ? "white" : game?.playerBlackId === playerId ? "black" : undefined;
  const legalMoves = useMemo(() => game ? generateLegalMoves(game.state) : [], [game]);
  const selectedMoves = selected ? legalMoves.filter((move) => samePoint(move.from, selected)) : [];
  const canMove = Boolean(game && playerColor === game.state.turn && !game.state.winner && !pendingMove);
  const whitePlayer = game?.players?.find((player) => player.color === "white");
  const blackPlayer = game?.players?.find((player) => player.color === "black");

  function handleSquareClick(point: BoardPoint) {
    if (!game || !canMove) return;
    const piece = game.state.board[point.row][point.col];
    if (piece?.color === playerColor) {
      setSelected(point);
      return;
    }
    if (!selected) return;
    const move = selectedMoves.find((candidate) => samePoint(candidate.to, point));
    if (!move) return;
    setPendingMove(true);
    socketRef.current?.emit("game:move", {
      gameId,
      move: { from: move.from, to: move.to, path: move.path, clientMoveId: crypto.randomUUID() }
    });
  }

  if (!game) {
    return <section className="mx-auto max-w-lg rounded-lg bg-surface-container-low p-8 text-center text-xl font-black">{connectionMessage || t("connectingGame")}</section>;
  }

  const winnerText = game.state.winner ? t("sideWins", { side: t(game.state.winner === "white" ? "white" : "black") }) : undefined;
  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(320px,520px)_1fr]">
      <section className="space-y-4">
        <PlayerCard
          name={blackPlayer?.displayName ?? t("blackSide")}
          rating={blackPlayer?.rating ?? 1200}
          clock={formatClock(game.state.clock?.blackSecondsRemaining)}
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
          clock={formatClock(game.state.clock?.whiteSecondsRemaining)}
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
          {moveError && <p className="mt-3 rounded-lg bg-error/10 p-3 font-bold text-error">{moveError}</p>}
          {connectionMessage && <p className="mt-3 rounded-lg bg-secondary-fixed/35 p-3 font-bold">{connectionMessage}</p>}
          {!game.state.winner && (
            <TactileButton className="mt-5 w-full" tone="danger" onClick={() => socketRef.current?.emit("game:resign", { gameId })}>
              {t("resign")}
            </TactileButton>
          )}
        </section>
        <section className="rounded-lg bg-surface-container-lowest p-5">
          <h2 className="text-xl font-black">{t("moveList")}</h2>
          <p className="mt-3 font-semibold text-on-surface-variant">
            {moveHistory.length === 0 ? t("noMoves") : moveHistory.map((move) => (
              <span key={move.id} className="mb-2 block rounded-lg bg-surface-container-low px-3 py-2">
                {move.moveNumber}. {move.payload.from.row + 1},{move.payload.from.col + 1} → {move.payload.to.row + 1},{move.payload.to.col + 1}
              </span>
            ))}
          </p>
        </section>
      </aside>
    </div>
  );
}

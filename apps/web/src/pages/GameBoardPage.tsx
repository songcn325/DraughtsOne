import { applyMove, createInitialGameState, generateLegalMoves } from "@draughtsone/draughts-engine";
import type { LegalMove } from "@draughtsone/draughts-engine";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import type { AiBestMoveView, BoardPoint, GameState } from "@draughtsone/shared";
import { api } from "../api/client";
import { DraughtsBoard } from "../components/DraughtsBoard";
import { PlayerCard } from "../components/PlayerCard";
import { TactileButton } from "../components/TactileButton";
import { useLanguage, type TranslationKey } from "../i18n";

function samePoint(a: BoardPoint, b: BoardPoint) {
  return a.row === b.row && a.col === b.col;
}

function initialClockSeconds(gameId: string) {
  const normalized = gameId.toLowerCase();
  if (normalized.includes("3-minutes")) return 3 * 60;
  if (normalized.includes("5-+-3") || normalized.includes("5-%2b-3")) return 5 * 60;
  if (normalized.includes("10-minutes")) return 10 * 60;
  return 10 * 60;
}

function formatClock(seconds: number) {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function formatEvaluation(
  score: number | undefined,
  analyzedTurn: GameState["turn"] | undefined,
  colorLabel: (color: GameState["turn"]) => string,
  notAvailable: string,
  equal: string
) {
  if (score === undefined || !analyzedTurn) return notAvailable;
  if (Math.abs(score) < 0.01) return equal;
  const favored = score > 0 ? analyzedTurn : analyzedTurn === "white" ? "black" : "white";
  return `${colorLabel(favored)} +${Math.abs(score).toFixed(2)}`;
}

function formatNodes(nodes: number | undefined, language: "en" | "zh") {
  if (nodes === undefined) return "—";
  return new Intl.NumberFormat(language === "zh" ? "zh-CN" : "en", { notation: "compact", maximumFractionDigits: 1 }).format(nodes);
}

function squareNumber(point: BoardPoint) {
  return point.row * 5 + Math.floor(point.col / 2) + 1;
}

function moveToPdn(move: LegalMove) {
  const separator = move.captures.length > 0 ? "x" : "-";
  const points = move.path && move.path.length > 1 ? move.path : [move.from, move.to];
  return points.map(squareNumber).join(separator);
}

function resultToPdn(state: GameState) {
  if (state.winner === "white") return "2-0";
  if (state.winner === "black") return "0-2";
  return "*";
}

function buildPdn(gameId: string, history: LegalMove[], state: GameState) {
  const result = resultToPdn(state);
  const movePairs: string[] = [];
  for (let index = 0; index < history.length; index += 2) {
    const whiteMove = moveToPdn(history[index]);
    const blackMove = history[index + 1] ? ` ${moveToPdn(history[index + 1])}` : "";
    movePairs.push(`${Math.floor(index / 2) + 1}. ${whiteMove}${blackMove}`);
  }

  return [
    '[Event "DraughtsOne local MVP"]',
    '[Site "DraughtsOne"]',
    `[Date "${new Date().toISOString().slice(0, 10)}"]`,
    `[Round "${gameId}"]`,
    '[White "White side"]',
    '[Black "Black side"]',
    `[Result "${result}"]`,
    "",
    `${movePairs.join(" ")} ${result}`.trim()
  ].join("\n");
}

export function GameBoardPage() {
  const { language, t } = useLanguage();
  const colorLabel = (color: GameState["turn"]) => t(color === "white" ? "white" : "black");
  const { gameId = "local-room" } = useParams();
  const startingSeconds = useMemo(() => initialClockSeconds(gameId), [gameId]);
  const [state, setState] = useState<GameState>(() => createInitialGameState());
  const [selected, setSelected] = useState<BoardPoint>();
  const [messageKey, setMessageKey] = useState<TranslationKey>("initialMessage");
  const [messageValues, setMessageValues] = useState<Record<string, string | number>>({});
  const [history, setHistory] = useState<LegalMove[]>([]);
  const [clocks, setClocks] = useState(() => ({ white: startingSeconds, black: startingSeconds }));
  const [resignConfirmOpen, setResignConfirmOpen] = useState(false);
  const [ruleReminderOpen, setRuleReminderOpen] = useState(false);
  const [captureReminderOpen, setCaptureReminderOpen] = useState(false);
  const [learnerInfoOpen, setLearnerInfoOpen] = useState(false);
  const [winnerDialogOpen, setWinnerDialogOpen] = useState(false);
  const [pdnDialogOpen, setPdnDialogOpen] = useState(false);
  const [learnerMode, setLearnerMode] = useState(true);
  const [analysis, setAnalysis] = useState<AiBestMoveView>();
  const [analysisTurn, setAnalysisTurn] = useState<GameState["turn"]>();
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string>();
  const [analysisEnabled, setAnalysisEnabled] = useState(false);
  const [showBestMoveArrow, setShowBestMoveArrow] = useState(false);
  const analysisRequestId = useRef(0);
  const analysisAbortController = useRef<AbortController>();
  const legalMoves = useMemo(() => generateLegalMoves(state), [state]);
  const selectedMoves = selected ? legalMoves.filter((move) => samePoint(move.from, selected)) : [];
  const captureIsMandatory = legalMoves.some((move) => move.captures.length > 0);
  const latestMove = history[history.length - 1];
  const pdnText = useMemo(() => buildPdn(gameId, history, state), [gameId, history, state]);
  const message = t(messageKey, messageValues);

  useEffect(() => {
    if (state.winner) return;
    if (history.length === 0 && state.turn === "white") {
      setMessageKey("initialMessage");
      setMessageValues({});
    } else {
      setMessageKey("turnMessage");
      setMessageValues({ side: colorLabel(state.turn) });
    }
  }, [language]);

  useEffect(() => {
    if (state.winner) return;
    const timer = window.setInterval(() => {
      setClocks((current) => {
        const activeSeconds = current[state.turn];
        if (activeSeconds <= 0) return current;
        const nextSeconds = activeSeconds - 1;
        const next = { ...current, [state.turn]: nextSeconds };
        if (nextSeconds === 0) {
          const winner = state.turn === "white" ? "black" : "white";
          setState((currentState) => ({ ...currentState, winner, resultReason: "timeout" }));
          setMessageKey("timeoutMessage");
          setMessageValues({ side: colorLabel(state.turn), winner: colorLabel(winner) });
          setWinnerDialogOpen(true);
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [state.turn, state.winner, language]);

  useEffect(() => {
    if (!analysisEnabled || state.winner) return;

    const requestId = analysisRequestId.current + 1;
    const controller = new AbortController();
    analysisRequestId.current = requestId;
    analysisAbortController.current?.abort();
    analysisAbortController.current = controller;
    setAnalysisLoading(true);
    setAnalysisError(undefined);

    void api.analyzePosition({ state, moveTimeMs: 3000 }, controller.signal)
      .then((response) => {
        if (analysisRequestId.current !== requestId || controller.signal.aborted) return;
        if (!response.ok) {
          setAnalysisError(t("analysisUnavailable"));
          return;
        }
        setAnalysis(response.data);
        setAnalysisTurn(state.turn);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || analysisRequestId.current !== requestId) return;
        setAnalysisError(t("analysisUnavailable"));
      })
      .finally(() => {
        if (analysisRequestId.current === requestId && !controller.signal.aborted) setAnalysisLoading(false);
      });

    return () => controller.abort();
  }, [analysisEnabled, state, language]);

  useEffect(() => {
    if (!state.winner || !analysisEnabled) return;
    analysisRequestId.current += 1;
    analysisAbortController.current?.abort();
    setAnalysisEnabled(false);
    setAnalysisLoading(false);
  }, [analysisEnabled, state.winner]);

  function handleSquareClick(point: BoardPoint) {
    if (state.winner) return;
    const piece = state.board[point.row][point.col];
    if (piece && piece.color !== state.turn) {
      setSelected(undefined);
      if (learnerMode && history.length === 0 && state.turn === "white") setRuleReminderOpen(true);
      if (history.length === 0 && state.turn === "white") {
        setMessageKey("whiteFirstMessage");
        setMessageValues({});
      } else {
        setMessageKey("turnSelectMessage");
        setMessageValues({ side: colorLabel(state.turn), color: colorLabel(state.turn) });
      }
      return;
    }

    if (piece?.color === state.turn) {
      setSelected(point);
      const options = legalMoves.filter((move) => samePoint(move.from, point));
      if (learnerMode && options.length === 0 && captureIsMandatory) setCaptureReminderOpen(true);
      if (options.length > 0) {
        setMessageKey("legalOptions");
        setMessageValues({ side: colorLabel(piece.color), count: options.length });
      } else {
        setMessageKey(captureIsMandatory ? "mustCapturePiece" : "noPieceMove");
        setMessageValues({});
      }
      return;
    }

    if (!selected) {
      setMessageKey("selectPieceFirst");
      setMessageValues({ color: colorLabel(state.turn) });
      return;
    }

    const move = selectedMoves.find((candidate) => samePoint(candidate.to, point));
    if (!move) {
      if (learnerMode && captureIsMandatory) setCaptureReminderOpen(true);
      setMessageKey(captureIsMandatory ? "illegalCapture" : "illegalDestination");
      setMessageValues({});
      return;
    }

    const nextState = applyMove(state, move);
    analysisRequestId.current += 1;
    analysisAbortController.current?.abort();
    setState(nextState);
    setHistory((moves) => [...moves, move]);
    setAnalysis(undefined);
    setAnalysisTurn(undefined);
    setAnalysisError(undefined);
    setSelected(undefined);
    if (nextState.winner) setWinnerDialogOpen(true);
    if (nextState.winner) {
      setMessageKey("winMessage");
      setMessageValues({
        side: colorLabel(nextState.winner),
        reason: t(`reason${nextState.resultReason?.[0].toUpperCase()}${nextState.resultReason?.slice(1)}` as TranslationKey)
      });
    } else {
      setMessageKey("turnMessage");
      setMessageValues({ side: colorLabel(nextState.turn) });
    }
  }

  function resetGame() {
    analysisRequestId.current += 1;
    analysisAbortController.current?.abort();
    setState(createInitialGameState());
    setSelected(undefined);
    setHistory([]);
    setClocks({ white: startingSeconds, black: startingSeconds });
    setResignConfirmOpen(false);
    setRuleReminderOpen(false);
    setCaptureReminderOpen(false);
    setLearnerInfoOpen(false);
    setWinnerDialogOpen(false);
    setPdnDialogOpen(false);
    setAnalysis(undefined);
    setAnalysisTurn(undefined);
    setAnalysisLoading(false);
    setAnalysisError(undefined);
    setAnalysisEnabled(false);
    setShowBestMoveArrow(false);
    setMessageKey("initialMessage");
    setMessageValues({});
  }

  function confirmResign() {
    analysisRequestId.current += 1;
    analysisAbortController.current?.abort();
    setAnalysisEnabled(false);
    setAnalysisLoading(false);
    const winner = state.turn === "white" ? "black" : "white";
    setState((current) => ({ ...current, winner, resultReason: "resignation" }));
    setSelected(undefined);
    setResignConfirmOpen(false);
    setWinnerDialogOpen(true);
    setMessageKey("resignedMessage");
    setMessageValues({ side: colorLabel(state.turn), winner: colorLabel(winner) });
  }

  function startAnalysis() {
    setAnalysisEnabled(true);
    setAnalysisError(undefined);
  }

  function stopAnalysis() {
    analysisRequestId.current += 1;
    analysisAbortController.current?.abort();
    setAnalysisEnabled(false);
    setAnalysisLoading(false);
    setAnalysisError(undefined);
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(320px,520px)_1fr]">
      <section className="space-y-4">
        <PlayerCard name={t("blackSide")} rating={1240} clock={formatClock(clocks.black)} active={state.turn === "black"} />
        <DraughtsBoard
          state={state}
          selected={selected}
          legalTargets={learnerMode ? selectedMoves.map((move) => move.to) : []}
          latestMove={latestMove}
          bestMove={showBestMoveArrow ? analysis : undefined}
          onSquareClick={handleSquareClick}
        />
        <PlayerCard name={t("whiteSide")} rating={1188} clock={formatClock(clocks.white)} active={state.turn === "white"} />
      </section>
      <aside className="space-y-4">
        <section className="rounded-lg bg-surface-container-low p-5">
          <p className="text-sm font-black uppercase text-primary">{t("room")}</p>
          <h1 className="mt-1 break-words text-2xl font-black">{gameId}</h1>
          <p className="mt-3 font-semibold text-on-surface-variant">{message}</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <TactileButton tone="surface" onClick={resetGame}>{t("newGame")}</TactileButton>
            <TactileButton tone="danger" onClick={() => setResignConfirmOpen(true)}>{t("resign")}</TactileButton>
          </div>
        </section>
        <section className="rounded-lg bg-surface-container-lowest p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black">{t("learnerMode")}</h2>
                <button
                  type="button"
                  onClick={() => setLearnerInfoOpen(true)}
                  className="grid h-7 w-7 place-items-center rounded-full bg-surface-container-low text-sm font-black text-primary"
                  aria-label={t("explainLearner")}
                >
                  ?
                </button>
              </div>
              <p className="mt-1 text-sm font-semibold text-on-surface-variant">{t(learnerMode ? "learnerOn" : "learnerOff")}</p>
            </div>
            <button
              type="button"
              onClick={() => setLearnerMode((current) => !current)}
              className={`relative h-8 w-14 rounded-full p-1 transition ${learnerMode ? "bg-primary" : "bg-surface-container-highest"}`}
              aria-pressed={learnerMode}
              aria-label={t("toggleLearner")}
            >
              <span className={`block h-6 w-6 rounded-full bg-white shadow transition ${learnerMode ? "translate-x-6" : "translate-x-0"}`} />
            </button>
          </div>
        </section>
        <section className="rounded-lg bg-surface-container-lowest p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-wider text-primary">{t("scanEngine")}</p>
              <h2 className="mt-1 text-xl font-black">{t("positionAnalysis")}</h2>
              <p className="mt-1 text-sm font-semibold text-on-surface-variant">{t("analysisDescription")}</p>
            </div>
            <TactileButton
              tone={analysisEnabled ? "danger" : "secondary"}
              className="shrink-0 px-4 py-2 text-sm disabled:cursor-wait disabled:opacity-60"
              disabled={!analysisEnabled && Boolean(state.winner)}
              onClick={analysisEnabled ? stopAnalysis : startAnalysis}
            >
              {t(analysisEnabled ? "stopAnalysis" : "analyze")}
            </TactileButton>
          </div>

          {analysisError && <p className="mt-4 rounded-lg bg-error/10 p-3 text-sm font-bold text-error">{analysisError}</p>}
          {analysisEnabled && (
            <p className="mt-4 rounded-lg bg-tertiary-fixed/40 p-3 text-sm font-bold text-tertiary">
              {analysisLoading ? t("analyzing") : t("continuousAnalysisOn")}
            </p>
          )}

          {analysis ? (
            <>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-surface-container-low p-3">
                  <p className="text-xs font-black uppercase text-on-surface-variant">{t("evaluation")}</p>
                  <p className="mt-1 font-black text-primary">{formatEvaluation(analysis.score, analysisTurn, colorLabel, t("notAvailable"), t("equal"))}</p>
                </div>
                <div className="rounded-lg bg-surface-container-low p-3">
                  <p className="text-xs font-black uppercase text-on-surface-variant">{t("depth")}</p>
                  <p className="mt-1 font-black">{analysis.depth ?? "—"}</p>
                </div>
                <div className="rounded-lg bg-surface-container-low p-3">
                  <p className="text-xs font-black uppercase text-on-surface-variant">{t("nodes")}</p>
                  <p className="mt-1 font-black">{formatNodes(analysis.nodes, language)}</p>
                </div>
              </div>
              <div className="mt-3 rounded-lg bg-primary-fixed/35 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-black uppercase text-primary">{t("bestMove")}</span>
                  <span className="rounded-full bg-white px-3 py-1 font-mono text-lg font-black text-primary">{analysis.notation}</span>
                </div>
                <p className="mt-3 break-words font-mono text-sm font-bold text-on-surface-variant">
                  {analysis.principalVariation.length > 0 ? analysis.principalVariation.join(" ") : analysis.notation}
                </p>
                <p className="mt-2 text-xs font-bold text-on-surface-variant">
                  {analysis.timeSeconds?.toFixed(2) ?? "—"}s · {analysis.nodesPerSecondMillions?.toFixed(1) ?? "—"} MN/s
                </p>
              </div>
            </>
          ) : (
            !analysisLoading &&
            !analysisError && <p className="mt-4 rounded-lg bg-surface-container-low p-3 text-sm font-semibold text-on-surface-variant">{t("noAnalysis")}</p>
          )}

          <div className="mt-4 flex items-center justify-between gap-4 border-t border-outline-variant/30 pt-4">
            <div>
              <p className="font-black">{t("bestMoveArrow")}</p>
              <p className="text-sm font-semibold text-on-surface-variant">
                {t(analysisEnabled ? "showRecommendation" : "analyzeFirst")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowBestMoveArrow((current) => !current)}
              disabled={!analysis}
              className={`relative h-8 w-14 shrink-0 rounded-full p-1 transition disabled:cursor-not-allowed disabled:opacity-40 ${showBestMoveArrow && analysis ? "bg-primary" : "bg-surface-container-highest"}`}
              aria-pressed={showBestMoveArrow}
              aria-label={t("toggleBestMove")}
            >
              <span className={`block h-6 w-6 rounded-full bg-white shadow transition ${showBestMoveArrow && analysis ? "translate-x-6" : "translate-x-0"}`} />
            </button>
          </div>
        </section>
        <section className="rounded-lg bg-surface-container-lowest p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black">{t("moveList")}</h2>
            <button type="button" onClick={() => setPdnDialogOpen(true)} className="rounded-full bg-surface-container-low px-4 py-2 text-sm font-black text-primary">
              {t("exportPdn")}
            </button>
          </div>
          <div className="mt-3 max-h-72 space-y-2 overflow-auto">
            {history.length === 0 ? (
              <p className="font-semibold text-on-surface-variant">{t("noMoves")}</p>
            ) : (
              history.map((move, index) => (
                <p key={`${move.from.row}-${move.from.col}-${index}`} className="rounded-lg bg-surface-container-low px-3 py-2 font-bold">
                  {t("moveLine", { number: index + 1, fromRow: move.from.row + 1, fromCol: move.from.col + 1, toRow: move.to.row + 1, toCol: move.to.col + 1 })}
                </p>
              ))
            )}
          </div>
        </section>
      </aside>
      {resignConfirmOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-end bg-black/25 p-4 sm:place-items-center">
          <section className="w-full max-w-sm rounded-lg bg-surface p-6 shadow-[0_24px_80px_rgba(45,47,47,0.2)]">
            <h2 className="text-2xl font-black">{t("resignTitle")}</h2>
            <p className="mt-3 font-semibold text-on-surface-variant">{t("resignDescription", { side: colorLabel(state.turn) })}</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <TactileButton tone="surface" onClick={() => setResignConfirmOpen(false)}>{t("cancel")}</TactileButton>
              <TactileButton tone="danger" onClick={confirmResign}>{t("confirm")}</TactileButton>
            </div>
          </section>
        </div>
      )}
      {winnerDialogOpen && state.winner && (
        <div className="fixed inset-0 z-[70] grid place-items-end bg-black/25 p-4 sm:place-items-center">
          <section className="w-full max-w-sm rounded-lg bg-surface p-6 shadow-[0_24px_80px_rgba(45,47,47,0.2)]">
            <p className="text-sm font-black uppercase text-primary">{t("gameOver")}</p>
            <h2 className="mt-2 text-3xl font-black">{t("sideWins", { side: colorLabel(state.winner) })}</h2>
            <p className="mt-3 font-semibold text-on-surface-variant">{t("finalBoard")}</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <TactileButton tone="primary" onClick={resetGame}>{t("newGame")}</TactileButton>
              <TactileButton tone="surface" onClick={() => setWinnerDialogOpen(false)}>{t("close")}</TactileButton>
            </div>
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
              <TactileButton tone="primary" onClick={() => void navigator.clipboard?.writeText(pdnText)}>{t("copy")}</TactileButton>
              <TactileButton tone="surface" onClick={() => setPdnDialogOpen(false)}>{t("close")}</TactileButton>
            </div>
          </section>
        </div>
      )}
      {ruleReminderOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-end bg-black/25 p-4 sm:place-items-center">
          <section className="w-full max-w-sm rounded-lg bg-surface p-6 shadow-[0_24px_80px_rgba(45,47,47,0.2)]">
            <h2 className="text-2xl font-black">{t("whiteMovesFirstTitle")}</h2>
            <p className="mt-3 font-semibold text-on-surface-variant">{t("whiteMovesFirstBody")}</p>
            <TactileButton className="mt-6 w-full" onClick={() => setRuleReminderOpen(false)}>{t("gotIt")}</TactileButton>
          </section>
        </div>
      )}
      {captureReminderOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-end bg-black/25 p-4 sm:place-items-center">
          <section className="w-full max-w-sm rounded-lg bg-surface p-6 shadow-[0_24px_80px_rgba(45,47,47,0.2)]">
            <h2 className="text-2xl font-black">{t("captureMandatoryTitle")}</h2>
            <p className="mt-3 font-semibold text-on-surface-variant">{t("captureMandatoryBody")}</p>
            <TactileButton className="mt-6 w-full" onClick={() => setCaptureReminderOpen(false)}>{t("gotIt")}</TactileButton>
          </section>
        </div>
      )}
      {learnerInfoOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-end bg-black/25 p-4 sm:place-items-center">
          <section className="w-full max-w-sm rounded-lg bg-surface p-6 shadow-[0_24px_80px_rgba(45,47,47,0.2)]">
            <h2 className="text-2xl font-black">{t("learnerMode")}</h2>
            <p className="mt-3 font-semibold text-on-surface-variant">{t("learnerBody")}</p>
            <TactileButton className="mt-6 w-full" onClick={() => setLearnerInfoOpen(false)}>{t("gotIt")}</TactileButton>
          </section>
        </div>
      )}
    </div>
  );
}

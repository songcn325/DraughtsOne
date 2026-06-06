import type { ApiEndpoint, EmptyRequest, ID, ISODateTime } from "../common.js";
import type { BoardPoint, GameState } from "../game/game-state.contract.js";

export type PlayStyleDimension = {
  key: "tactics" | "openings" | "endgames" | "risk" | "time_management";
  label: string;
  scorePercent: number;
  trend: "up" | "flat" | "down";
};

export type AiInsight = {
  id: ID;
  title: string;
  body: string;
  severity: "info" | "opportunity" | "warning";
};

export type AiProfileAnalysisView = {
  generatedAt: ISODateTime;
  confidence: "low" | "medium" | "high";
  styleLabel: string;
  summary: string;
  dimensions: PlayStyleDimension[];
  insights: AiInsight[];
};

export type AiBestMoveRequest = {
  state: GameState;
  moveTimeMs?: number;
};

export type AiBestMoveView = {
  notation: string;
  from: BoardPoint;
  to: BoardPoint;
  path: BoardPoint[];
  ponder?: string;
};

export type AiAnalysisApiContract = {
  "GET /ai/profile": ApiEndpoint<EmptyRequest, AiProfileAnalysisView>;
  "POST /ai/best-move": ApiEndpoint<AiBestMoveRequest, AiBestMoveView>;
};

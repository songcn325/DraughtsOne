import type { ApiEndpoint, EmptyRequest, ID, ISODateTime } from "../common";

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

export type AiAnalysisApiContract = {
  "GET /ai/profile": ApiEndpoint<EmptyRequest, AiProfileAnalysisView>;
};


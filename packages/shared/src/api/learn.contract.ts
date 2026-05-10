import type { ApiEndpoint, EmptyRequest, ID, ISODateTime } from "../common";

export type LessonNodeStatus = "locked" | "available" | "completed";

export type LessonNode = {
  id: ID;
  unitId: ID;
  title: string;
  subtitle?: string;
  status: LessonNodeStatus;
  icon: string;
  progressPercent: number;
  estimatedMinutes?: number;
};

export type LearnUnit = {
  id: ID;
  title: string;
  subtitle: string;
  nodes: LessonNode[];
};

export type LearnPath = {
  streakDays: number;
  gems: number;
  currentLessonId?: ID;
  units: LearnUnit[];
};

export type CompleteLessonRequest = {
  score?: number;
  completedAt?: ISODateTime;
};

export type CompleteLessonResult = {
  lessonId: ID;
  status: "completed";
  completedAt: ISODateTime;
  nextLessonId?: ID;
  awardedGems: number;
};

export type LearnApiContract = {
  "GET /learn/path": ApiEndpoint<EmptyRequest, LearnPath>;
  "POST /learn/lessons/:lessonId/complete": ApiEndpoint<CompleteLessonRequest, CompleteLessonResult>;
};


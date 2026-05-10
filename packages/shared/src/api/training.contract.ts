import type { ApiEndpoint, EmptyRequest, ID, ISODate, ISODateTime } from "../common";
import type { GameState } from "../game/game-state.contract";
import type { MovePayload } from "../game/moves.contract";

export type TrainingTaskType = "puzzle" | "drill" | "endgame";
export type TrainingDifficulty = "beginner" | "intermediate" | "advanced";

export type TrainingTask = {
  id: ID;
  type: TrainingTaskType;
  title: string;
  description?: string;
  boardPosition: GameState;
  solution: MovePayload[];
  difficulty: TrainingDifficulty;
  activeDate: ISODate;
  rewardGems: number;
  completedByViewer: boolean;
};

export type DailyTrainingView = {
  activeDate: ISODate;
  streakDays: number;
  completedCount: number;
  totalCount: number;
  tasks: TrainingTask[];
};

export type TrainingAttemptRequest = {
  movePayloads: MovePayload[];
  elapsedMs: number;
};

export type TrainingAttemptResult = {
  taskId: ID;
  result: "success" | "failed";
  attemptCount: number;
  correctMoveCount: number;
  completedAt?: ISODateTime;
  awardedGems: number;
};

export type TrainingApiContract = {
  "GET /train/daily": ApiEndpoint<EmptyRequest, DailyTrainingView>;
  "POST /train/tasks/:taskId/attempt": ApiEndpoint<TrainingAttemptRequest, TrainingAttemptResult>;
};


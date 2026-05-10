import { createInitialGameState } from "@draughtsone/draughts-engine";
import type { FastifyInstance } from "fastify";
import type { TrainingAttemptRequest, TrainingTask } from "@draughtsone/shared";

const dailyTasks: TrainingTask[] = [
  {
    id: "daily-1",
    type: "puzzle",
    title: "Find the forced capture",
    boardPosition: createInitialGameState(),
    solution: [],
    difficulty: "beginner",
    activeDate: new Date().toISOString().slice(0, 10)
  }
];

export function registerTrainRoutes(app: FastifyInstance) {
  app.get("/train/daily", async () => ({ ok: true, data: dailyTasks }));

  app.post<{ Params: { taskId: string }; Body: TrainingAttemptRequest }>("/train/tasks/:taskId/attempt", async () => ({
    ok: true,
    data: { result: "success", attemptCount: 1, completedAt: new Date().toISOString() }
  }));
}


import { createInitialGameState } from "@draughtsone/draughts-engine";
import type { TrainingTask } from "@draughtsone/shared";

export const mockTrainingTasks: TrainingTask[] = [
  {
    id: "daily-1",
    type: "puzzle",
    title: "Find the forced capture",
    boardPosition: createInitialGameState(),
    solution: [{ from: { row: 6, col: 1 }, to: { row: 5, col: 0 } }],
    difficulty: "beginner",
    activeDate: new Date().toISOString().slice(0, 10),
    rewardGems: 8,
    completedByViewer: false
  },
  {
    id: "daily-2",
    type: "drill",
    title: "King lane control",
    boardPosition: createInitialGameState(),
    solution: [],
    difficulty: "intermediate",
    activeDate: new Date().toISOString().slice(0, 10),
    rewardGems: 12,
    completedByViewer: false
  }
];

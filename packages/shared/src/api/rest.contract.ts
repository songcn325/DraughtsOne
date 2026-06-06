import type { AiAnalysisApiContract } from "./ai-analysis.contract.js";
import type { AuthApiContract } from "./auth.contract.js";
import type { GamesApiContract } from "./games.contract.js";
import type { LearnApiContract } from "./learn.contract.js";
import type { TrainingApiContract } from "./training.contract.js";
import type { UsersApiContract } from "./users.contract.js";

export type RestApiContract = AuthApiContract &
  UsersApiContract &
  LearnApiContract &
  TrainingApiContract &
  AiAnalysisApiContract &
  GamesApiContract;

export type RestApiRoute = keyof RestApiContract;


import type { AiAnalysisApiContract } from "./ai-analysis.contract";
import type { AuthApiContract } from "./auth.contract";
import type { GamesApiContract } from "./games.contract";
import type { LearnApiContract } from "./learn.contract";
import type { TrainingApiContract } from "./training.contract";
import type { UsersApiContract } from "./users.contract";

export type RestApiContract = AuthApiContract &
  UsersApiContract &
  LearnApiContract &
  TrainingApiContract &
  AiAnalysisApiContract &
  GamesApiContract;

export type RestApiRoute = keyof RestApiContract;


import type { AiProfileAnalysisView } from "../api/ai-analysis.contract";
import type {
  LoginRequest,
  RegisterRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  SendVerificationCodeRequest,
  VerificationCodeLoginRequest
} from "../api/auth.contract";
import type { GameDetailView, GameHallView } from "../api/games.contract";
import type { LearnPath } from "../api/learn.contract";
import type { DailyTrainingView } from "../api/training.contract";
import type { UserProfileView } from "../api/users.contract";
import type { ErrorPageView } from "../errors";

export type PageLoadState = "idle" | "loading" | "ready" | "error";

export type LoginPageContract = {
  route: "/login";
  forms: {
    login: LoginRequest;
    sendVerificationCode: SendVerificationCodeRequest;
    verificationCodeLogin: VerificationCodeLoginRequest;
    register: RegisterRequest;
    requestPasswordReset: RequestPasswordResetRequest;
    resetPassword: ResetPasswordRequest;
  };
};

export type LearnPageContract = {
  route: "/learn";
  data: LearnPath;
};

export type DailyTrainingPageContract = {
  route: "/train";
  data: DailyTrainingView;
};

export type PlayHallPageContract = {
  route: "/play";
  data: GameHallView;
};

export type GamePageContract = {
  route: "/game/:gameId";
  data: GameDetailView;
};

export type AiAnalysisPageContract = {
  route: "/ai";
  data: AiProfileAnalysisView;
};

export type ProfilePageContract = {
  route: "/profile";
  data: UserProfileView;
};

export type ErrorPageContract = {
  route: "/error";
  data: ErrorPageView;
};

export type WebPageContracts =
  | LoginPageContract
  | LearnPageContract
  | DailyTrainingPageContract
  | PlayHallPageContract
  | GamePageContract
  | AiAnalysisPageContract
  | ProfilePageContract
  | ErrorPageContract;

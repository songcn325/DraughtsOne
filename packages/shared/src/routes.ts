export const REST_ROUTES = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    sendVerificationCode: "/auth/verification-code/send",
    verificationCodeLogin: "/auth/verification-code/login",
    requestPasswordReset: "/auth/password-reset/request",
    confirmPasswordReset: "/auth/password-reset/confirm",
    logout: "/auth/logout"
  },
  me: {
    get: "/me",
    update: "/me"
  },
  learn: {
    path: "/learn/path",
    completeLesson: "/learn/lessons/:lessonId/complete"
  },
  training: {
    daily: "/train/daily",
    attemptTask: "/train/tasks/:taskId/attempt"
  },
  aiAnalysis: {
    profile: "/ai/profile"
  },
  games: {
    hall: "/games/hall",
    create: "/games",
    join: "/games/join",
    detail: "/games/:gameId",
    history: "/games/history",
    submitMove: "/games/:gameId/moves",
    resign: "/games/:gameId/resign"
  }
} as const;

export const WEB_ROUTES = {
  login: "/login",
  learn: "/learn",
  train: "/train",
  playHall: "/play",
  game: "/game/:gameId",
  aiAnalysis: "/ai",
  profile: "/profile",
  matchHistory: "/matches",
  error: "/error"
} as const;

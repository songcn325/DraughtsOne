import type { AiBestMoveRequest, AiBestMoveView, ApiResponse, AuthSession, DailyTrainingView, GuestSessionRequest, LearnPath, LoginRequest, RegisterRequest, RequestPasswordResetRequest, RequestPasswordResetResult, UserProfileView } from "@draughtsone/shared";
import { authHeader } from "../auth/session";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "http://localhost:4000" : "/api");

export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...authHeader() }
  });
  return response.json();
}

export async function apiPost<TRequest, TResponse>(path: string, body: TRequest, signal?: AbortSignal): Promise<ApiResponse<TResponse>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(body),
    signal
  });
  return response.json();
}

export const api = {
  guestSession: (request: GuestSessionRequest = {}) => apiPost<GuestSessionRequest, AuthSession>("/auth/guest", request),
  register: (request: RegisterRequest) => apiPost<RegisterRequest, AuthSession>("/auth/register", request),
  login: (request: LoginRequest) => apiPost<LoginRequest, AuthSession>("/auth/login", request),
  requestPasswordReset: (request: RequestPasswordResetRequest) => apiPost<RequestPasswordResetRequest, RequestPasswordResetResult>("/auth/password-reset/request", request),
  logout: () => apiPost<Record<string, never>, { loggedOut: true }>("/auth/logout", {}),
  me: () => apiGet<UserProfileView>("/me"),
  learnPath: () => apiGet<LearnPath>("/learn/path"),
  dailyTraining: () => apiGet<DailyTrainingView>("/train/daily"),
  analyzePosition: (request: AiBestMoveRequest, signal?: AbortSignal) => apiPost<AiBestMoveRequest, AiBestMoveView>("/ai/best-move", request, signal)
};

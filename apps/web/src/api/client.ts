import type { AiBestMoveRequest, AiBestMoveView, ApiResponse, DailyTrainingView, LearnPath, UserProfileView } from "@draughtsone/shared";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "http://localhost:4000" : "/api");

export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" }
  });
  return response.json();
}

export async function apiPost<TRequest, TResponse>(path: string, body: TRequest, signal?: AbortSignal): Promise<ApiResponse<TResponse>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal
  });
  return response.json();
}

export const api = {
  me: () => apiGet<UserProfileView>("/me"),
  learnPath: () => apiGet<LearnPath>("/learn/path"),
  dailyTraining: () => apiGet<DailyTrainingView>("/train/daily"),
  analyzePosition: (request: AiBestMoveRequest, signal?: AbortSignal) => apiPost<AiBestMoveRequest, AiBestMoveView>("/ai/best-move", request, signal)
};

import type { ApiResponse, DailyTrainingView, LearnPath, UserProfileView } from "@draughtsone/shared";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" }
  });
  return response.json();
}

export const api = {
  me: () => apiGet<UserProfileView>("/me"),
  learnPath: () => apiGet<LearnPath>("/learn/path"),
  dailyTraining: () => apiGet<DailyTrainingView>("/train/daily")
};

import type { AuthSession } from "@draughtsone/shared";
import { api } from "../api/client";

const STORAGE_KEY = "draughtsone-guest-session";

export function readGuestSession(): AuthSession | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const session = JSON.parse(raw) as AuthSession;
    if (Date.parse(session.expiresAt) <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return undefined;
    }
    return session;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return undefined;
  }
}

export async function getOrCreateGuestSession(displayName?: string): Promise<AuthSession> {
  const existing = readGuestSession();
  if (existing) return existing;
  const response = await api.guestSession({ displayName });
  if (!response.ok) throw new Error(response.error.message);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data));
  return response.data;
}

export function storeOnlineColor(gameId: string, color: "white" | "black") {
  localStorage.setItem(`draughtsone-online-color:${gameId}`, color);
}

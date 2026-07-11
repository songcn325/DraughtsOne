import type { AuthSession } from "@draughtsone/shared";
import { api } from "../api/client";
import { readAuthSession, saveAuthSession } from "./session";

export function readGuestSession(): AuthSession | undefined {
  return readAuthSession();
}

export async function getOrCreateGuestSession(displayName?: string): Promise<AuthSession> {
  const existing = readGuestSession();
  if (existing) return existing;
  const response = await api.guestSession({ displayName });
  if (!response.ok) throw new Error(response.error.message);
  saveAuthSession(response.data);
  return response.data;
}

export function storeOnlineColor(gameId: string, color: "white" | "black") {
  localStorage.setItem(`draughtsone-online-color:${gameId}`, color);
}

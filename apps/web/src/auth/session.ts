import type { AuthSession } from "@draughtsone/shared";

const STORAGE_KEY = "draughtsone-session";
const LEGACY_GUEST_KEY = "draughtsone-guest-session";

export function readAuthSession(): AuthSession | undefined {
  const session = readStoredSession(STORAGE_KEY) ?? readStoredSession(LEGACY_GUEST_KEY);
  if (!session) return undefined;
  if (Date.parse(session.expiresAt) <= Date.now()) {
    clearAuthSession();
    return undefined;
  }
  return session;
}

export function saveAuthSession(session: AuthSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  localStorage.removeItem(LEGACY_GUEST_KEY);
}

export function clearAuthSession() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_GUEST_KEY);
}

export function authHeader(): Record<string, string> {
  const token = readAuthSession()?.accessToken;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function readStoredSession(key: string): AuthSession | undefined {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as AuthSession : undefined;
  } catch {
    localStorage.removeItem(key);
    return undefined;
  }
}

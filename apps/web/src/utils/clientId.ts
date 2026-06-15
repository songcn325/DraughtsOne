export function createClientMoveId() {
  return globalThis.crypto?.randomUUID?.() ?? `move-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

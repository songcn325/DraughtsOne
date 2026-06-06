import { io, type Socket } from "socket.io-client";
import type { SocketClientEvents, SocketServerEvents } from "@draughtsone/shared";

export type GameSocket = Socket<SocketServerEvents, SocketClientEvents>;

export function createGameSocket(token?: string): GameSocket {
  const socketUrl = import.meta.env.VITE_SOCKET_URL ?? (import.meta.env.DEV ? "http://localhost:4000" : window.location.origin);
  return io(socketUrl, {
    auth: token ? { token } : undefined,
    autoConnect: false
  });
}

import { io, type Socket } from "socket.io-client";
import type { SocketClientEvents, SocketServerEvents } from "@draughtsone/shared";

export type GameSocket = Socket<SocketServerEvents, SocketClientEvents>;

export function createGameSocket(token?: string): GameSocket {
  return io(import.meta.env.VITE_SOCKET_URL ?? "http://localhost:4000", {
    auth: token ? { token } : undefined,
    autoConnect: false
  });
}


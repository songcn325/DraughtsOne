import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";
import { createServer } from "node:http";
import { Server } from "socket.io";
import type { SocketClientEvents, SocketServerEvents } from "@draughtsone/shared";
import { registerAuthRoutes } from "./auth/routes.js";
import { registerGameRoutes } from "./games/routes.js";
import { registerLearnRoutes } from "./learn/routes.js";
import { registerRealtimeHandlers } from "./realtime/socket.js";
import { InMemoryRoomStore } from "./room-store/InMemoryRoomStore.js";
import { registerTrainRoutes } from "./train/routes.js";
import { registerUserRoutes } from "./users/routes.js";

const app = Fastify({ logger: true });
const httpServer = createServer(app.server);
const io = new Server<SocketClientEvents, SocketServerEvents>(httpServer, {
  cors: { origin: process.env.WEB_ORIGIN ?? "http://localhost:5173" }
});
const roomStore = new InMemoryRoomStore();

await app.register(cors, { origin: process.env.WEB_ORIGIN ?? "http://localhost:5173" });
await app.register(rateLimit, { max: 100, timeWindow: "1 minute" });
await app.register(jwt, { secret: process.env.JWT_SECRET ?? "dev-secret" });

registerAuthRoutes(app);
registerUserRoutes(app);
registerLearnRoutes(app);
registerTrainRoutes(app);
registerGameRoutes(app, roomStore);
registerRealtimeHandlers(io, roomStore);

app.get("/health", async () => ({ ok: true, service: "draughtsone-server" }));

const port = Number(process.env.PORT ?? 4000);
httpServer.listen({ port, host: "0.0.0.0" }, () => {
  app.log.info(`DraughtsOne API listening on ${port}`);
});


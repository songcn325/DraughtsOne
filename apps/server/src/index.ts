import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";
import { Server } from "socket.io";
import type { SocketClientEvents, SocketServerEvents } from "@draughtsone/shared";
import { registerAiRoutes } from "./ai/routes.js";
import { registerAuthRoutes } from "./auth/routes.js";
import { registerGameRoutes } from "./games/routes.js";
import { registerLearnRoutes } from "./learn/routes.js";
import { registerRealtimeHandlers } from "./realtime/socket.js";
import { PrismaRoomStore } from "./room-store/PrismaRoomStore.js";
import { prisma } from "./db/prisma.js";
import { registerTrainRoutes } from "./train/routes.js";
import { registerUserRoutes } from "./users/routes.js";

const app = Fastify({ logger: true });
const io = new Server<SocketClientEvents, SocketServerEvents>(app.server, {
  cors: { origin: process.env.WEB_ORIGIN ?? "http://localhost:5173" }
});
const roomStore = new PrismaRoomStore();

await app.register(cors, { origin: process.env.WEB_ORIGIN ?? "http://localhost:5173" });
await app.register(rateLimit, { max: 100, timeWindow: "1 minute" });
await app.register(jwt, { secret: process.env.JWT_SECRET ?? "dev-secret" });

io.use(async (socket, next) => {
  try {
    const token = typeof socket.handshake.auth?.token === "string" ? socket.handshake.auth.token : "";
    const payload = app.jwt.verify<{ sub: string }>(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return next(new Error("UNAUTHORIZED"));
    socket.data.userId = user.id;
    socket.data.rating = user.rating;
    await prisma.user.update({ where: { id: user.id }, data: { lastSeenAt: new Date() } });
    next();
  } catch {
    next(new Error("UNAUTHORIZED"));
  }
});

registerAuthRoutes(app);
registerAiRoutes(app);
registerUserRoutes(app);
registerLearnRoutes(app);
registerTrainRoutes(app);
registerGameRoutes(app, roomStore);
registerRealtimeHandlers(io, roomStore);

app.get("/health", async () => ({ ok: true, service: "draughtsone-server" }));

const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? "0.0.0.0";
await app.listen({ port, host });

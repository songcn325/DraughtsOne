import type { FastifyInstance } from "fastify";
import type { PatchMeRequest, UserProfileView } from "@draughtsone/shared";
import { prisma } from "../db/prisma.js";
import { userView } from "../auth/userView.js";

export function registerUserRoutes(app: FastifyInstance) {
  app.get("/me", async (request, reply) => {
    const userId = authenticatedUserId(app, request.headers.authorization);
    if (!userId) {
      reply.code(401);
      return { ok: false, error: { code: "AUTH_REQUIRED", message: "Please log in first." } };
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      reply.code(401);
      return { ok: false, error: { code: "AUTH_REQUIRED", message: "Please log in first." } };
    }

    return { ok: true, data: await profileView(user) };
  });

  app.patch<{ Body: PatchMeRequest }>("/me", async (request, reply) => {
    const userId = authenticatedUserId(app, request.headers.authorization);
    if (!userId) {
      reply.code(401);
      return { ok: false, error: { code: "AUTH_REQUIRED", message: "Please log in first." } };
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        displayName: request.body.displayName?.trim().slice(0, 40),
        avatarUrl: request.body.avatarUrl?.trim()
      }
    });
    return { ok: true, data: await profileView(user) };
  });
}

function authenticatedUserId(app: FastifyInstance, authorization: string | undefined) {
  const token = authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : "";
  if (!token) return undefined;
  try {
    return app.jwt.verify<{ sub: string }>(token).sub;
  } catch {
    return undefined;
  }
}

async function profileView(user: Parameters<typeof userView>[0]): Promise<UserProfileView> {
  const [gamesPlayed, wins, losses] = await Promise.all([
    prisma.game.count({ where: { OR: [{ playerWhiteId: user.id }, { playerBlackId: user.id }] } }),
    prisma.game.count({ where: { winnerId: user.id } }),
    prisma.game.count({
      where: {
        OR: [{ playerWhiteId: user.id }, { playerBlackId: user.id }],
        winnerId: { not: null },
        NOT: { winnerId: user.id }
      }
    })
  ]);

  return {
    ...userView(user),
    gamesPlayed,
    wins,
    losses,
    draws: 0,
    learningStreakDays: 0,
    gems: 0
  };
}

import type { FastifyInstance } from "fastify";
import type { PatchMeRequest, User } from "@draughtsone/shared";

let demoUser: User = {
  id: "demo-user",
  emailOrPhone: "demo@draughtsone.app",
  displayName: "Demo Player",
  rating: 1200,
  createdAt: new Date().toISOString()
};

export function registerUserRoutes(app: FastifyInstance) {
  app.get("/me", async () => ({ ok: true, data: demoUser }));

  app.patch<{ Body: PatchMeRequest }>("/me", async (request) => {
    demoUser = { ...demoUser, ...request.body };
    return { ok: true, data: demoUser };
  });
}


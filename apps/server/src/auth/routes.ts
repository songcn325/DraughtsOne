import type { FastifyInstance } from "fastify";
import type { AuthSession, LoginRequest, RegisterRequest, User } from "@draughtsone/shared";

const demoUser: User = {
  id: "demo-user",
  emailOrPhone: "demo@draughtsone.app",
  displayName: "Demo Player",
  rating: 1200,
  createdAt: new Date().toISOString()
};

export function registerAuthRoutes(app: FastifyInstance) {
  app.post<{ Body: RegisterRequest }>("/auth/register", async (request) => {
    const user = { ...demoUser, emailOrPhone: request.body.emailOrPhone, displayName: request.body.displayName };
    const token = app.jwt.sign({ sub: user.id });
    return { ok: true, data: { user, accessToken: token } satisfies AuthSession };
  });

  app.post<{ Body: LoginRequest }>("/auth/login", async () => {
    const token = app.jwt.sign({ sub: demoUser.id });
    return { ok: true, data: { user: demoUser, accessToken: token } satisfies AuthSession };
  });
}


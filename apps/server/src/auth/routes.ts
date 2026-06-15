import type { FastifyInstance } from "fastify";
import type {
  AuthSession,
  GuestSessionRequest,
  LoginRequest,
  RegisterRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  SendVerificationCodeRequest,
  VerificationCodeLoginRequest,
  User
} from "@draughtsone/shared";
import { prisma } from "../db/prisma.js";

const demoUser: User = {
  id: "demo-user",
  accountType: "guest",
  username: "demo",
  email: "demo@draughtsone.app",
  emailVerified: true,
  phoneVerified: false,
  displayName: "Demo Player",
  rating: 1200,
  createdAt: new Date().toISOString()
};

export function registerAuthRoutes(app: FastifyInstance) {
  app.post<{ Body: GuestSessionRequest }>("/auth/guest", async (request) => {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    const displayName = request.body?.displayName?.trim().slice(0, 30) || `Guest ${suffix}`;
    const user = await prisma.user.create({
      data: {
        accountType: "guest",
        displayName,
        rating: 1200,
        ratingDeviation: 350
      }
    });
    const token = app.jwt.sign({ sub: user.id, kind: "guest" }, { expiresIn: "30d" });
    return {
      ok: true,
      data: {
        user: {
          id: user.id,
          accountType: "guest",
          displayName: user.displayName,
          avatarUrl: user.avatarUrl ?? undefined,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
          rating: user.rating,
          createdAt: user.createdAt.toISOString()
        },
        accessToken: token,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      } satisfies AuthSession
    };
  });

  app.post<{ Body: RegisterRequest }>("/auth/register", async (request) => {
    const user = {
      ...demoUser,
      username: request.body.username,
      email: request.body.email,
      phoneNumber: request.body.phoneNumber,
      emailVerified: request.body.verification?.channel === "email",
      phoneVerified: request.body.verification?.channel === "sms",
      displayName: request.body.displayName
    };
    const token = app.jwt.sign({ sub: user.id });
    return { ok: true, data: { user, accessToken: token, expiresAt: oneDayFromNow() } satisfies AuthSession };
  });

  app.post<{ Body: LoginRequest }>("/auth/login", async () => {
    const token = app.jwt.sign({ sub: demoUser.id });
    return { ok: true, data: { user: demoUser, accessToken: token, expiresAt: oneDayFromNow() } satisfies AuthSession };
  });

  app.post<{ Body: SendVerificationCodeRequest }>("/auth/verification-code/send", async (request) => ({
    ok: true,
    data: {
      channel: request.body.channel,
      deliveryTarget: maskDeliveryTarget(request.body.target),
      expiresInSeconds: 300,
      resendAvailableInSeconds: 60,
      supportedInCurrentMvp: request.body.channel === "email"
    }
  }));

  app.post<{ Body: VerificationCodeLoginRequest }>("/auth/verification-code/login", async (request) => {
    const token = app.jwt.sign({ sub: demoUser.id });
    const user =
      request.body.channel === "email"
        ? { ...demoUser, email: request.body.target, emailVerified: true }
        : { ...demoUser, phoneNumber: request.body.target, phoneVerified: true };
    return { ok: true, data: { user, accessToken: token, expiresAt: oneDayFromNow() } satisfies AuthSession };
  });

  app.post<{ Body: RequestPasswordResetRequest }>("/auth/password-reset/request", async (request) => ({
    ok: true,
    data: {
      channel: "email",
      deliveryTarget: maskDeliveryTarget(request.body.email ?? demoUser.email ?? "demo@draughtsone.app"),
      expiresInSeconds: 300,
      resendAvailableInSeconds: 60
    }
  }));

  app.post<{ Body: ResetPasswordRequest }>("/auth/password-reset/confirm", async () => ({
    ok: true,
    data: { passwordReset: true }
  }));

  app.post("/auth/logout", async () => ({
    ok: true,
    data: { loggedOut: true }
  }));
}

function oneDayFromNow(): string {
  return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
}

function maskDeliveryTarget(value: string): string {
  if (value.includes("@")) {
    const [name, domain] = value.split("@");
    return `${name.slice(0, 2)}***@${domain}`;
  }
  return `${value.slice(0, 3)}****${value.slice(-2)}`;
}

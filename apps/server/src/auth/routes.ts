import type { FastifyInstance } from "fastify";
import type {
  AuthSession,
  GuestSessionRequest,
  LoginRequest,
  RegisterRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  SendVerificationCodeRequest,
  VerificationCodeLoginRequest
} from "@draughtsone/shared";
import { prisma } from "../db/prisma.js";
import { hashPassword, verifyPassword } from "./password.js";
import { userView } from "./userView.js";

const SESSION_DAYS = 30;

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
    return { ok: true, data: createSession(app, user, "guest") };
  });

  app.post<{ Body: RegisterRequest }>("/auth/register", async (request, reply) => {
    const username = normalizeUsername(request.body.username);
    const email = normalizeEmail(request.body.email);
    const displayName = request.body.displayName?.trim().slice(0, 40);
    const password = request.body.password ?? "";
    const fieldErrors: Record<string, string> = {};

    if (!username || username.length < 3) fieldErrors.username = "Username must be at least 3 characters.";
    if (!email || !email.includes("@")) fieldErrors.email = "Enter a valid email address.";
    if (!displayName) fieldErrors.displayName = "Display name is required.";
    if (password.length < 8) fieldErrors.password = "Password must be at least 8 characters.";

    if (Object.keys(fieldErrors).length > 0) {
      reply.code(400);
      return { ok: false, error: { code: "VALIDATION_ERROR", message: "Please check the registration form.", fieldErrors } };
    }

    const existing = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });
    if (existing) {
      reply.code(409);
      return {
        ok: false,
        error: {
          code: "ACCOUNT_ALREADY_EXISTS",
          message: existing.username === username ? "This username is already taken." : "This email is already registered.",
          fieldErrors: existing.username === username ? { username: "Already taken." } : { email: "Already registered." }
        }
      };
    }

    const passwordHash = await hashPassword(password);
    const guestUserId = await readAuthenticatedUserId(app, request.headers.authorization);
    const guestUser = guestUserId ? await prisma.user.findUnique({ where: { id: guestUserId } }) : undefined;
    const data = {
      accountType: "registered",
      username,
      email,
      phoneNumber: request.body.phoneNumber?.trim() || null,
      emailVerified: request.body.verification?.channel === "email",
      phoneVerified: request.body.verification?.channel === "sms",
      passwordHash,
      displayName
    };

    const user = guestUser?.accountType === "guest"
      ? await prisma.user.update({ where: { id: guestUser.id }, data })
      : await prisma.user.create({ data: { ...data, rating: 1200, ratingDeviation: 350 } });

    return { ok: true, data: createSession(app, user, "registered") };
  });

  app.post<{ Body: LoginRequest }>("/auth/login", async (request, reply) => {
    const identity = request.body.username.trim().toLowerCase();
    const user = await prisma.user.findFirst({
      where: {
        accountType: "registered",
        OR: [{ username: identity }, { email: identity }]
      }
    });

    if (!user || !(await verifyPassword(request.body.password, user.passwordHash))) {
      reply.code(401);
      return { ok: false, error: { code: "INVALID_CREDENTIALS", message: "Username or password is incorrect." } };
    }

    await prisma.user.update({ where: { id: user.id }, data: { lastSeenAt: new Date() } });
    return { ok: true, data: createSession(app, user, "registered") };
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
    const target = request.body.target.trim().toLowerCase();
    const user = await prisma.user.upsert({
      where: request.body.channel === "email" ? { email: target } : { phoneNumber: target },
      update: request.body.channel === "email" ? { emailVerified: true } : { phoneVerified: true },
      create: {
        accountType: "registered",
        displayName: target.includes("@") ? target.split("@")[0] : `User ${target.slice(-4)}`,
        email: request.body.channel === "email" ? target : null,
        phoneNumber: request.body.channel === "sms" ? target : null,
        emailVerified: request.body.channel === "email",
        phoneVerified: request.body.channel === "sms"
      }
    });
    return { ok: true, data: createSession(app, user, "registered") };
  });

  app.post<{ Body: RequestPasswordResetRequest }>("/auth/password-reset/request", async (request) => ({
    ok: true,
    data: {
      channel: "email",
      deliveryTarget: maskDeliveryTarget(request.body.email ?? "account@draughtsone.app"),
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

function createSession(app: FastifyInstance, user: Parameters<typeof userView>[0], kind: "guest" | "registered"): AuthSession {
  const accessToken = app.jwt.sign({ sub: user.id, kind }, { expiresIn: `${SESSION_DAYS}d` });
  return {
    user: userView(user),
    accessToken,
    expiresAt: new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString()
  };
}

async function readAuthenticatedUserId(app: FastifyInstance, authorization: string | undefined) {
  const token = authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : "";
  if (!token) return undefined;
  try {
    return app.jwt.verify<{ sub: string }>(token).sub;
  } catch {
    return undefined;
  }
}

function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function maskDeliveryTarget(value: string): string {
  if (value.includes("@")) {
    const [name, domain] = value.split("@");
    return `${name.slice(0, 2)}***@${domain}`;
  }
  return `${value.slice(0, 3)}****${value.slice(-2)}`;
}

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
import { sendEmail } from "./email.js";
import { hashPassword, verifyPassword } from "./password.js";
import { userView } from "./userView.js";
import { consumeVerificationCode, createVerificationCode, normalizeVerificationTarget, storeVerificationCode } from "./verification.js";

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
    if (!isStrongPassword(password)) fieldErrors.password = "Password must be at least 8 characters and include uppercase, lowercase, and a number.";
    if (request.body.verification?.channel !== "email" || normalizeVerificationTarget(request.body.verification.target) !== email) {
      fieldErrors.verification = "Please verify this email address first.";
    }

    if (Object.keys(fieldErrors).length > 0) {
      reply.code(400);
      return { ok: false, error: { code: "VALIDATION_ERROR", message: "Please check the registration form.", fieldErrors } };
    }

    const existing = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });
    if (existing) {
      const emailExists = existing.email === email;
      reply.code(409);
      return {
        ok: false,
        error: {
          code: "ACCOUNT_ALREADY_EXISTS",
          message: emailExists ? "You already have an account with this email. Please log in instead." : "This username is already taken.",
          fieldErrors: emailExists ? { email: "Already registered. Please log in instead." } : { username: "Already taken." },
          details: emailExists ? { loginInstead: true, email } : undefined
        }
      };
    }

    const verified = await consumeVerificationCode(email, "register", request.body.verification?.code ?? "");
    if (!verified) {
      reply.code(400);
      return { ok: false, error: { code: "VALIDATION_ERROR", message: "The email verification code is invalid or expired.", fieldErrors: { verification: "Invalid or expired code." } } };
    }

    const passwordHash = await hashPassword(password);
    const guestUserId = await readAuthenticatedUserId(app, request.headers.authorization);
    const guestUser = guestUserId ? await prisma.user.findUnique({ where: { id: guestUserId } }) : undefined;
    const data = {
      accountType: "registered",
      username,
      email,
      phoneNumber: request.body.phoneNumber?.trim() || null,
      emailVerified: true,
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

  app.post<{ Body: SendVerificationCodeRequest }>("/auth/verification-code/send", async (request, reply) => {
    if (request.body.channel !== "email") {
      reply.code(400);
      return { ok: false, error: { code: "VALIDATION_ERROR", message: "Only email verification is supported right now." } };
    }
    const target = normalizeEmail(request.body.target);
    if (!target.includes("@")) {
      reply.code(400);
      return { ok: false, error: { code: "VALIDATION_ERROR", message: "Enter a valid email address." } };
    }

    const code = createVerificationCode();
    await storeVerificationCode(target, request.body.purpose === "reset_password" ? "reset_password" : "register", code);
    const delivered = await sendEmail({
      to: target,
      subject: request.body.purpose === "reset_password" ? "Reset your DraughtsOne password" : "Verify your DraughtsOne email",
      text: `Your DraughtsOne verification code is ${code}. It expires in 10 minutes.`
    });

    return {
      ok: true,
      data: {
        channel: "email",
        deliveryTarget: maskDeliveryTarget(target),
        expiresInSeconds: 600,
        resendAvailableInSeconds: 60,
        supportedInCurrentMvp: delivered
      }
    };
  });

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

  app.post<{ Body: RequestPasswordResetRequest }>("/auth/password-reset/request", async (request) => {
    const identity = (request.body.email ?? request.body.username).trim().toLowerCase();
    const user = await prisma.user.findFirst({ where: { OR: [{ email: identity }, { username: identity }] } });
    const target = user?.email;
    let delivered = false;
    if (target) {
      const code = createVerificationCode();
      await storeVerificationCode(target, "reset_password", code);
      delivered = await sendEmail({
        to: target,
        subject: "Reset your DraughtsOne password",
        text: `Your DraughtsOne password reset code is ${code}. It expires in 10 minutes.`
      });
    }
    return {
      ok: true,
      data: {
        channel: "email",
        deliveryTarget: target ? maskDeliveryTarget(target) : maskDeliveryTarget("your account email"),
        expiresInSeconds: 600,
        resendAvailableInSeconds: 60,
        supportedInCurrentMvp: delivered
      }
    };
  });

  app.post<{ Body: ResetPasswordRequest }>("/auth/password-reset/confirm", async (request, reply) => {
    const identity = (request.body.email ?? request.body.username).trim().toLowerCase();
    const user = await prisma.user.findFirst({ where: { OR: [{ email: identity }, { username: identity }] } });
    if (!user?.email || !isStrongPassword(request.body.newPassword)) {
      reply.code(400);
      return { ok: false, error: { code: "VALIDATION_ERROR", message: "The reset request is invalid." } };
    }
    const verified = await consumeVerificationCode(user.email, "reset_password", request.body.code);
    if (!verified) {
      reply.code(400);
      return { ok: false, error: { code: "VALIDATION_ERROR", message: "The password reset code is invalid or expired." } };
    }
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(request.body.newPassword) } });
    return { ok: true, data: { passwordReset: true } };
  });

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

function isStrongPassword(value: string) {
  return value.length >= 8 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value);
}

function maskDeliveryTarget(value: string): string {
  if (value.includes("@")) {
    const [name, domain] = value.split("@");
    return `${name.slice(0, 2)}***@${domain}`;
  }
  return `${value.slice(0, 3)}****${value.slice(-2)}`;
}

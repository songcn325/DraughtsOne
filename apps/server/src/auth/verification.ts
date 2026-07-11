import { randomInt } from "node:crypto";
import { prisma } from "../db/prisma.js";
import { hashPassword, verifyPassword } from "./password.js";

export type VerificationPurpose = "register" | "reset_password";

export function normalizeVerificationTarget(target: string) {
  return target.trim().toLowerCase();
}

export function createVerificationCode() {
  return String(randomInt(100000, 1000000));
}

export async function storeVerificationCode(target: string, purpose: VerificationPurpose, code: string) {
  return prisma.emailVerificationCode.create({
    data: {
      target: normalizeVerificationTarget(target),
      purpose,
      codeHash: await hashPassword(code),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    }
  });
}

export async function consumeVerificationCode(target: string, purpose: VerificationPurpose, code: string) {
  const normalizedTarget = normalizeVerificationTarget(target);
  const candidates = await prisma.emailVerificationCode.findMany({
    where: {
      target: normalizedTarget,
      purpose,
      consumedAt: null,
      expiresAt: { gt: new Date() }
    },
    orderBy: { createdAt: "desc" },
    take: 5
  });

  for (const candidate of candidates) {
    if (await verifyPassword(code, candidate.codeHash)) {
      await prisma.emailVerificationCode.update({ where: { id: candidate.id }, data: { consumedAt: new Date() } });
      return true;
    }
    await prisma.emailVerificationCode.update({ where: { id: candidate.id }, data: { attempts: { increment: 1 } } });
  }

  return false;
}

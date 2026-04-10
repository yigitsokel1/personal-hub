import bcrypt from "bcrypt";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin/session-constants";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type AdminSessionPayload = {
  isAdmin: true;
  createdAt: number;
  expiresAt: number;
};

function getRequiredEnv(name: "ADMIN_PASSWORD_HASH" | "ADMIN_SESSION_SECRET"): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required for admin authentication.`);
  }

  return value;
}

function createSignature(value: string): string {
  const secret = getRequiredEnv("ADMIN_SESSION_SECRET");
  return createHmac("sha256", secret).update(value).digest("hex");
}

function encodePayload(payload: AdminSessionPayload): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function decodePayload(value: string): AdminSessionPayload | null {
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Partial<AdminSessionPayload>;
    if (parsed.isAdmin !== true) {
      return null;
    }
    if (!Number.isFinite(parsed.createdAt) || !Number.isFinite(parsed.expiresAt)) {
      return null;
    }
    return {
      isAdmin: true,
      createdAt: Number(parsed.createdAt),
      expiresAt: Number(parsed.expiresAt),
    };
  } catch {
    return null;
  }
}

function parseSessionValue(raw: string): { payloadEncoded: string; payload: AdminSessionPayload; signature: string } | null {
  const [payloadEncoded, signature] = raw.split(".");
  if (!payloadEncoded || !signature) {
    return null;
  }

  const payload = decodePayload(payloadEncoded);
  if (!payload) {
    return null;
  }

  return { payloadEncoded, payload, signature };
}

export function getSessionPayloadFromCookieValue(raw: string): AdminSessionPayload | null {
  const parsed = parseSessionValue(raw);
  if (!parsed) {
    return null;
  }
  const expectedSignature = createSignature(parsed.payloadEncoded);
  try {
    const isValid = timingSafeEqual(
      Buffer.from(parsed.signature, "utf8"),
      Buffer.from(expectedSignature, "utf8"),
    );
    return isValid ? parsed.payload : null;
  } catch {
    return null;
  }
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const expectedHash = getRequiredEnv("ADMIN_PASSWORD_HASH");
  try {
    return await bcrypt.compare(password, expectedHash);
  } catch {
    return false;
  }
}

export async function createAdminSession(): Promise<void> {
  const createdAt = Math.floor(Date.now() / 1000);
  const payload: AdminSessionPayload = {
    isAdmin: true,
    createdAt,
    expiresAt: createdAt + SESSION_TTL_SECONDS,
  };
  const payloadEncoded = encodePayload(payload);
  const signature = createSignature(payloadEncoded);
  const value = `${payloadEncoded}.${signature}`;
  const store = await cookies();

  store.set(ADMIN_SESSION_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const raw = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!raw) {
    return false;
  }

  const parsed = parseSessionValue(raw);
  if (!parsed) {
    return false;
  }

  if (parsed.payload.expiresAt <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  return getSessionPayloadFromCookieValue(raw) !== null;
}

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function getRequiredEnv(name: "ADMIN_PASSWORD" | "ADMIN_SESSION_SECRET"): string {
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

function parseSessionValue(raw: string): { expiresAt: number; signature: string } | null {
  const [expiresRaw, signature] = raw.split(".");
  if (!expiresRaw || !signature) {
    return null;
  }

  const expiresAt = Number(expiresRaw);
  if (!Number.isFinite(expiresAt)) {
    return null;
  }

  return { expiresAt, signature };
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const expected = getRequiredEnv("ADMIN_PASSWORD");
  return password === expected;
}

export async function createAdminSession(): Promise<void> {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const signature = createSignature(String(expiresAt));
  const value = `${expiresAt}.${signature}`;
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

  if (parsed.expiresAt <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  const expectedSignature = createSignature(String(parsed.expiresAt));
  try {
    return timingSafeEqual(
      Buffer.from(parsed.signature, "utf8"),
      Buffer.from(expectedSignature, "utf8"),
    );
  } catch {
    return false;
  }
}

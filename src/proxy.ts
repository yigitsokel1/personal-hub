import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin/session-constants";

type SessionPayload = {
  isAdmin: true;
  createdAt: number;
  expiresAt: number;
};

function toSafeNextPath(pathname: string, search: string): string {
  if (!pathname.startsWith("/") || pathname.startsWith("//")) {
    return "/admin/settings";
  }
  return `${pathname}${search}`;
}

function decodePayload(payloadBase64url: string): SessionPayload | null {
  try {
    const base64 = payloadBase64url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = `${base64}${"=".repeat((4 - (base64.length % 4)) % 4)}`;
    const decoded = atob(padded);
    const parsed = JSON.parse(decoded) as Partial<SessionPayload>;
    if (parsed.isAdmin !== true) return null;
    if (!Number.isFinite(parsed.createdAt) || !Number.isFinite(parsed.expiresAt)) return null;
    return {
      isAdmin: true,
      createdAt: Number(parsed.createdAt),
      expiresAt: Number(parsed.expiresAt),
    };
  } catch {
    return null;
  }
}

function isSessionValid(raw: string | undefined): boolean {
  if (!raw) return false;
  const [payload] = raw.split(".");
  if (!payload) return false;
  const parsed = decodePayload(payload);
  if (!parsed) return false;
  return parsed.expiresAt > Math.floor(Date.now() / 1000);
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const raw = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (isSessionValid(raw)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", toSafeNextPath(pathname, search));
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};

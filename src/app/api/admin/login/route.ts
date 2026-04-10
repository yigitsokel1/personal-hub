import { NextRequest, NextResponse } from "next/server";
import { createAdminSession, verifyAdminPassword } from "@/lib/admin/auth";
import { clearLoginAttemptWindow, consumeLoginAttempt } from "@/lib/admin/rate-limit";

function toSafeNextPath(value: string): string | null {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return null;
  }
  return value;
}

function getClientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
  const ua = request.headers.get("user-agent") || "unknown";
  return `${ip}:${ua}`;
}

export async function POST(request: NextRequest) {
  let password = "";
  let requestedNext = "";
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as { password?: string; next?: string };
    password = String(body.password ?? "");
    requestedNext = String(body.next ?? "");
  } else {
    const form = await request.formData();
    password = String(form.get("password") ?? "");
    requestedNext = String(form.get("next") ?? "");
  }

  const nextPath = toSafeNextPath(requestedNext) ?? "/admin/settings";
  if (!password) {
    return NextResponse.json({ error: "missing_password" }, { status: 400 });
  }

  const key = getClientKey(request);
  const rateLimit = consumeLoginAttempt(key);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "rate_limited" },
      {
        status: 429,
        headers: rateLimit.retryAfterSeconds ? { "Retry-After": String(rateLimit.retryAfterSeconds) } : undefined,
      },
    );
  }

  const isValid = await verifyAdminPassword(password);
  if (!isValid) {
    return NextResponse.json({ error: "invalid_password" }, { status: 401 });
  }

  await createAdminSession();
  clearLoginAttemptWindow(key);
  return NextResponse.json({ ok: true, redirectTo: nextPath });
}

import { NextRequest, NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/admin/auth";

export async function POST(request: NextRequest) {
  await clearAdminSession();
  const accept = request.headers.get("accept") ?? "";
  if (accept.includes("text/html")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { getContentHealthSurface } from "@/lib/content/health-surface";

export async function GET() {
  const enabled = process.env.NODE_ENV !== "production" && process.env.ENABLE_DEV_ENDPOINTS === "1";
  if (!enabled) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const report = await getContentHealthSurface();
  return NextResponse.json(report);
}

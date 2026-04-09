import { NextResponse } from "next/server";
import { getContentHealthSurface } from "@/lib/content/health-surface";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const report = await getContentHealthSurface();
  return NextResponse.json(report);
}

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { PrismaClient } from "@prisma/client";

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "_legacy", "labs");
const LAB_STATUSES = new Set(["idea", "exploring", "building", "paused", "completed"]);

function asString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.map(asString).filter(Boolean);
}

function toSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function mapLegacyStatus(value) {
  if (LAB_STATUSES.has(value)) return value;
  if (value === "draft") return "idea";
  if (value === "published") return "completed";
  return "exploring";
}

function parseLab(filePath) {
  const source = fs.readFileSync(filePath, "utf-8");
  const parsed = matter(source);
  const data = parsed.data;
  const body = parsed.content.trim();

  const title = asString(data.title);
  const slug = asString(data.slug) ?? (title ? toSlug(title) : undefined);
  const summary = asString(data.summary);
  const tags = asStringArray(data.tags).slice(0, 3);
  const publishedAtRaw = asString(data.publishedAt);
  const featured = Boolean(data.featured);
  const published = data.status === "draft" ? false : true;
  const status = mapLegacyStatus(asString(data.status));

  const errors = [];
  if (!title) errors.push("title is required");
  if (!slug) errors.push("slug is required");
  if (!summary) errors.push("summary is required");
  if (!body) errors.push("body is required");
  if (!status || !LAB_STATUSES.has(status)) {
    errors.push("status must be one of idea|exploring|building|paused|completed");
  }
  if (tags.length > 3) errors.push("tags max is 3");
  if (published && !publishedAtRaw) errors.push("publishedAt is required for published entries");

  return {
    filePath,
    errors,
    value: {
      title: title ?? "",
      slug: slug ?? "",
      summary: summary ?? "",
      body,
      tags,
      status,
      featured,
      published,
      publishedAt: publishedAtRaw ? new Date(publishedAtRaw) : null,
    },
  };
}

async function main() {
  const prisma = new PrismaClient();
  try {
    if (!fs.existsSync(CONTENT_DIR)) {
      throw new Error("No labs MDX directory found at src/content/_legacy/labs.");
    }

    const files = fs
      .readdirSync(CONTENT_DIR)
      .filter((name) => name.endsWith(".mdx"))
      .map((name) => path.join(CONTENT_DIR, name));
    if (files.length === 0) {
      throw new Error("No labs MDX files found in src/content/_legacy/labs.");
    }

    const parsed = files.map(parseLab);
    const invalid = parsed.filter((entry) => entry.errors.length > 0);
    if (invalid.length > 0) {
      console.error("Validation failed for labs migration:");
      for (const entry of invalid) {
        console.error(`- ${path.basename(entry.filePath)}: ${entry.errors.join("; ")}`);
      }
      process.exitCode = 1;
      return;
    }

    let upserted = 0;
    for (const entry of parsed) {
      await prisma.lab.upsert({
        where: { slug: entry.value.slug },
        update: entry.value,
        create: entry.value,
      });
      upserted += 1;
    }

    const dbCount = await prisma.lab.count();
    console.log(`Labs migration complete. Upserted ${upserted} entries. DB now has ${dbCount} labs.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Labs migration failed:", error);
  process.exitCode = 1;
});

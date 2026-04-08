// NOTE:
// This script is intended for one-time migration from MDX to DB.
// It is idempotent based on slug.
// Not used in runtime.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { PrismaClient } from "@prisma/client";

const CONTENT_DIRS = [
  path.join(process.cwd(), "src", "content", "work"),
  path.join(process.cwd(), "src", "content", "_legacy", "work"),
];
const ENGAGEMENT_TYPES = new Set(["freelance", "contract", "full-time"]);
const CONFIDENTIALITY_LEVELS = new Set(["public", "limited"]);

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

function parseWork(filePath) {
  const source = fs.readFileSync(filePath, "utf-8");
  const parsed = matter(source);
  const data = parsed.data;
  const body = parsed.content.trim();

  const title = asString(data.title);
  const slug = asString(data.slug) ?? (title ? toSlug(title) : undefined);
  const summary = asString(data.summary);
  const client = asString(data.client);
  const engagementType = asString(data.engagementType);
  const role = asString(data.role);
  const timeline = asString(data.timeline) ?? null;
  const confidentialityLevel = asString(data.confidentialityLevel) ?? null;
  const tags = asStringArray(data.tags).slice(0, 3);
  const scope = asStringArray(data.scope);
  const responsibilities = asStringArray(data.responsibilities);
  const constraints = asStringArray(data.constraints);
  const impact = asStringArray(data.impact);
  const publishedAtRaw = asString(data.publishedAt);
  const featured = Boolean(data.featured);
  const published = data.status === "draft" ? false : true;

  const errors = [];
  if (!title) errors.push("title is required");
  if (!slug) errors.push("slug is required");
  if (!summary) errors.push("summary is required");
  if (!body) errors.push("body is required");
  if (!client) errors.push("client is required");
  if (!engagementType) errors.push("engagementType is required");
  if (engagementType && !ENGAGEMENT_TYPES.has(engagementType)) {
    errors.push("engagementType must be freelance|contract|full-time");
  }
  if (!role) errors.push("role is required");
  if (scope.length === 0) errors.push("scope must include at least one item");
  if (responsibilities.length === 0) errors.push("responsibilities must include at least one item");
  if (published && !publishedAtRaw) errors.push("publishedAt is required for published entries");
  if (
    confidentialityLevel &&
    !CONFIDENTIALITY_LEVELS.has(confidentialityLevel)
  ) {
    errors.push("confidentialityLevel must be public|limited");
  }

  return {
    filePath,
    errors,
    value: {
      title: title ?? "",
      slug: slug ?? "",
      summary: summary ?? "",
      body,
      tags,
      featured,
      published,
      publishedAt: publishedAtRaw ? new Date(publishedAtRaw) : null,
      client: client ?? "",
      engagementType: engagementType ?? "contract",
      role: role ?? "",
      timeline,
      confidentialityLevel,
      scope,
      responsibilities,
      constraints,
      impact,
    },
  };
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const checkedDirs = CONTENT_DIRS.map((dir) => path.resolve(dir));
    const files = CONTENT_DIRS.flatMap((dir) => {
      if (!fs.existsSync(dir)) return [];
      return fs
        .readdirSync(dir)
        .filter((name) => name.endsWith(".mdx"))
        .map((name) => path.join(dir, name));
    });

    if (files.length === 0) {
      throw new Error(`No work MDX files found. Checked directories: ${checkedDirs.join(", ")}`);
    }

    const parsed = files.map(parseWork);
    const invalid = parsed.filter((entry) => entry.errors.length > 0);
    if (invalid.length > 0) {
      console.error("Validation failed for work migration:");
      for (const entry of invalid) {
        console.error(`- ${path.basename(entry.filePath)}: ${entry.errors.join("; ")}`);
      }
      process.exitCode = 1;
      return;
    }

    const slugToFiles = new Map();
    for (const entry of parsed) {
      const slug = entry.value.slug;
      const list = slugToFiles.get(slug) ?? [];
      list.push(path.basename(entry.filePath));
      slugToFiles.set(slug, list);
    }
    const duplicateSlugEntries = [...slugToFiles.entries()].filter(([, list]) => list.length > 1);
    if (duplicateSlugEntries.length > 0) {
      console.error("Duplicate work slugs found in source files:");
      for (const [slug, list] of duplicateSlugEntries) {
        console.error(`- ${slug}: ${list.join(", ")}`);
      }
      process.exitCode = 1;
      return;
    }

    let upserted = 0;
    for (const entry of parsed) {
      await prisma.work.upsert({
        where: { slug: entry.value.slug },
        update: entry.value,
        create: entry.value,
      });
      upserted += 1;
    }

    const dbCount = await prisma.work.count();
    console.log(`Work migration complete. Upserted ${upserted} entries. DB now has ${dbCount} work rows.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Work migration failed:", error);
  process.exitCode = 1;
});

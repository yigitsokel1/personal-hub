// NOTE:
// This script is intended for one-time migration from MDX to DB.
// It is idempotent based on slug.
// Not used in runtime.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { PrismaClient } from "@prisma/client";

const CONTENT_DIRS = [
  path.join(process.cwd(), "src", "content", "projects"),
  path.join(process.cwd(), "src", "content", "_legacy", "projects"),
];

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

function isValidUrl(value) {
  if (!value) return true;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function parseProject(filePath) {
  const source = fs.readFileSync(filePath, "utf-8");
  const parsed = matter(source);
  const data = parsed.data;
  const body = parsed.content.trim();

  const title = asString(data.title);
  const slug = asString(data.slug) ?? (title ? toSlug(title) : undefined);
  const summary = asString(data.summary);
  const role = asString(data.role);
  const problem = asString(data.problem);
  const solution = asString(data.solution);
  const tags = asStringArray(data.tags).slice(0, 3);
  const stack = asStringArray(data.stack);
  const architectureHighlights = asStringArray(data.architectureHighlights);
  const decisions = asStringArray(data.decisions);
  const outcomes = asStringArray(data.outcomes);
  const repoUrl = asString(data.repoUrl);
  const liveUrl = asString(data.liveUrl);
  const publishedAtRaw = asString(data.publishedAt);
  const featured = Boolean(data.featured);
  const published = data.status === "draft" ? false : true;

  const errors = [];
  if (!title) errors.push("title is required");
  if (!slug) errors.push("slug is required");
  if (!summary) errors.push("summary is required");
  if (!body) errors.push("body is required");
  if (!role) errors.push("role is required");
  if (!problem) errors.push("problem is required");
  if (!solution) errors.push("solution is required");
  if (stack.length === 0) errors.push("stack must include at least one item");
  if (published && !publishedAtRaw) errors.push("publishedAt is required for published entries");
  if (!isValidUrl(repoUrl)) errors.push("repoUrl must be a valid http(s) URL");
  if (!isValidUrl(liveUrl)) errors.push("liveUrl must be a valid http(s) URL");

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
      role: role ?? "",
      stack,
      platform: asString(data.platform) ?? null,
      problem: problem ?? "",
      solution: solution ?? "",
      architectureHighlights,
      decisions,
      outcomes,
      repoUrl: repoUrl ?? null,
      liveUrl: liveUrl ?? null,
      timeline: asString(data.timeline) ?? null,
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
      throw new Error(
        `No project MDX files found. Checked directories: ${checkedDirs.join(", ")}`
      );
    }

    const parsed = files.map(parseProject);
    const invalid = parsed.filter((entry) => entry.errors.length > 0);
    if (invalid.length > 0) {
      console.error("Validation failed for project migration:");
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
      console.error("Duplicate project slugs found in source files:");
      for (const [slug, list] of duplicateSlugEntries) {
        console.error(`- ${slug}: ${list.join(", ")}`);
      }
      process.exitCode = 1;
      return;
    }

    let upserted = 0;
    for (const entry of parsed) {
      await prisma.project.upsert({
        where: { slug: entry.value.slug },
        update: entry.value,
        create: entry.value,
      });
      upserted += 1;
    }

    const dbCount = await prisma.project.count();
    console.log(
      `Projects migration complete. Upserted ${upserted} entries. DB now has ${dbCount} projects.`
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Projects migration failed:", error);
  process.exitCode = 1;
});

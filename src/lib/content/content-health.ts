import { getSiteMetadataBase } from "@/lib/seo/build-metadata";
import { getPublishedLabs } from "@/lib/content-source/get-labs";
import { getPublishedProjects } from "@/lib/content-source/get-projects";
import { getPublishedWork } from "@/lib/content-source/get-work";
import { getPublishedWriting } from "@/lib/content-source/get-writing";
import { normalizeTag } from "./tags";
import type { ContentEntry, ContentType } from "./types";

const TYPES: ContentType[] = ["project", "work", "writing", "lab"];

/** Allow clock skew / timezone when comparing publishedAt to "now". */
const FUTURE_GRACE_MS = 24 * 60 * 60 * 1000;

function isStrict(): boolean {
  return (
    process.env.CONTENT_HEALTH_STRICT === "1" ||
    process.env.CI === "true"
  );
}

async function allPublishedEntries(): Promise<ContentEntry[]> {
  const [projects, work, writing, labs] = await Promise.all([
    getPublishedProjects(),
    getPublishedWork(),
    getPublishedWriting(),
    getPublishedLabs(),
  ]);
  return [...projects.value, ...work.value, ...writing.value, ...labs.value];
}

export type ContentHealthReport = {
  /** Duplicate slug/id, bad dates, tag collisions — fail build when strict. */
  blocking: string[];
  /** Config and polish — always warn, never fail strict. */
  advisory: string[];
};

/**
 * Non-throwing scan of published content. Used by sitemap generation and optional strict builds.
 */
export async function collectContentHealthReport(): Promise<ContentHealthReport> {
  const blocking: string[] = [];
  const advisory: string[] = [];

  if (!getSiteMetadataBase()) {
    advisory.push(
      "NEXT_PUBLIC_SITE_URL is unset or invalid; canonical URLs, sitemap absolute URLs, RSS item links, and JSON-LD urls need a public origin in production."
    );
  }

  const allEntries = await allPublishedEntries();
  for (const type of TYPES) {
    const entries = allEntries.filter((entry) => entry.type === type);
    const slugCounts = new Map<string, string[]>();
    for (const e of entries) {
      const list = slugCounts.get(e.slug) ?? [];
      list.push(e.id);
      slugCounts.set(e.slug, list);
    }
    for (const [slug, ids] of slugCounts) {
      if (ids.length > 1) {
        blocking.push(
          `Duplicate slug "${slug}" in ${type} (${ids.length} entries: ${ids.join(", ")}).`
        );
      }
    }
  }

  const idCounts = new Map<string, ContentType[]>();
  for (const e of allEntries) {
    const types = idCounts.get(e.id) ?? [];
    types.push(e.type);
    idCounts.set(e.id, types);
  }
  for (const [id, types] of idCounts) {
    if (types.length > 1) {
      blocking.push(
        `Duplicate id "${id}" (${types.length} entries, types: ${types.join(", ")}).`
      );
    }
  }

  const now = Date.now();
  for (const e of allEntries) {
    const t = new Date(e.publishedAt).getTime();
    if (Number.isNaN(t)) {
      blocking.push(
        `[${e.type} ${e.slug}] Invalid publishedAt: ${JSON.stringify(e.publishedAt)}`
      );
      continue;
    }
    if (t > now + FUTURE_GRACE_MS) {
      blocking.push(
        `[${e.type} ${e.slug}] publishedAt is in the future (${e.publishedAt}).`
      );
    }
  }

  for (const e of allEntries) {
    const tags = e.tags ?? [];
    const norms = tags.map((t) => normalizeTag(t)).filter((n) => n.length > 0);

    const normCounts = new Map<string, number>();
    for (const n of norms) {
      normCounts.set(n, (normCounts.get(n) ?? 0) + 1);
    }
    for (const [n, count] of normCounts) {
      if (count > 1) {
        blocking.push(
          `[${e.type} ${e.slug}] Duplicate tag after normalization: "${n}".`
        );
      }
    }

    if (e.cover?.src && (e.cover.alt === undefined || e.cover.alt === "")) {
      advisory.push(
        `[${e.type} ${e.slug}] cover has src but no alt; add alt text or document as decorative.`
      );
    }
  }

  return { blocking, advisory };
}

/**
 * Run during sitemap (build). Warns or throws based on env.
 */
export async function reportContentHealthAtBuild(): Promise<void> {
  const { blocking, advisory } = await collectContentHealthReport();
  if (advisory.length > 0) {
    console.warn(
      `Content health (advisory):\n${advisory.map((l) => `  - ${l}`).join("\n")}`
    );
  }
  if (blocking.length === 0) return;

  const message = `Content health (blocking):\n${blocking.map((l) => `  - ${l}`).join("\n")}`;

  if (isStrict()) {
    throw new Error(message);
  }

  console.warn(message);
}

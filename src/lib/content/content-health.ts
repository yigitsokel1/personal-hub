import { getSiteMetadataBase } from "@/lib/seo/build-metadata";
import { getPublishedContentEntries } from "./get-content";
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

function allPublishedEntries(): ContentEntry[] {
  const out: ContentEntry[] = [];
  for (const type of TYPES) {
    out.push(...getPublishedContentEntries(type));
  }
  return out;
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
export function collectContentHealthReport(): ContentHealthReport {
  const blocking: string[] = [];
  const advisory: string[] = [];

  if (!getSiteMetadataBase()) {
    advisory.push(
      "NEXT_PUBLIC_SITE_URL is unset or invalid; canonical URLs, sitemap absolute URLs, RSS item links, and JSON-LD urls need a public origin in production."
    );
  }

  for (const type of TYPES) {
    const entries = getPublishedContentEntries(type);
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
  for (const e of allPublishedEntries()) {
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
  for (const e of allPublishedEntries()) {
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

  for (const e of allPublishedEntries()) {
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

    const byLower = new Map<string, Set<string>>();
    for (const n of norms) {
      const low = n.toLowerCase();
      let variants = byLower.get(low);
      if (!variants) {
        variants = new Set();
        byLower.set(low, variants);
      }
      variants.add(n);
    }
    for (const variants of byLower.values()) {
      if (variants.size > 1) {
        blocking.push(
          `[${e.type} ${e.slug}] Tags differ only by case: ${[...variants].join(" vs ")}.`
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
export function reportContentHealthAtBuild(): void {
  const { blocking, advisory } = collectContentHealthReport();
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

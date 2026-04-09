import { normalizeTag } from "@/lib/tags/normalize-tag";
import type { RelatedCandidate, RelatedResult } from "@/lib/content-intelligence/types";

const RELATED_LIMIT = 3;
const RECENCY_WINDOW_DAYS = 180;
const RECENCY_BONUS_MAX = 2;
const FEATURED_BONUS = 0.15;

function parsePublishedAt(value: string): number {
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : 0;
}

function buildNormalizedTagSet(tags: string[] | undefined): Set<string> {
  return new Set((tags ?? []).map((tag) => normalizeTag(tag)).filter(Boolean));
}

function computeRecencyBonus(publishedAt: string): number {
  const publishedAtMs = parsePublishedAt(publishedAt);
  if (!publishedAtMs) return 0;

  const ageDays = (Date.now() - publishedAtMs) / (1000 * 60 * 60 * 24);
  if (ageDays <= 0) return RECENCY_BONUS_MAX;
  if (ageDays >= RECENCY_WINDOW_DAYS) return 0;

  return ((RECENCY_WINDOW_DAYS - ageDays) / RECENCY_WINDOW_DAYS) * RECENCY_BONUS_MAX;
}

export function rankRelatedContent(
  currentSlug: string,
  currentTags: string[] | undefined,
  candidates: RelatedCandidate[],
  limit = RELATED_LIMIT
): RelatedResult[] {
  const normalizedCurrentTags = buildNormalizedTagSet(currentTags);
  const pool = candidates.filter((entry) => entry.slug !== currentSlug && entry.published !== false);

  const scored = pool.map((entry) => {
    const entryTags = buildNormalizedTagSet(entry.tags);
    let sharedTags = 0;

    for (const tag of normalizedCurrentTags) {
      if (entryTags.has(tag)) sharedTags += 1;
    }

    const score =
      sharedTags + computeRecencyBonus(entry.publishedAt) + (entry.featured ? FEATURED_BONUS : 0);

    return { entry, sharedTags, score };
  });

  const withSharedTags = scored
    .filter((entry) => entry.sharedTags > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return parsePublishedAt(b.entry.publishedAt) - parsePublishedAt(a.entry.publishedAt);
    });

  const baseSelection = withSharedTags.slice(0, limit).map(({ entry }) => entry);
  if (baseSelection.length === limit) {
    return baseSelection.map((entry) => ({ slug: entry.slug, title: entry.title }));
  }

  const selectedSlugs = new Set(baseSelection.map((entry) => entry.slug));
  const fallback = pool
    .filter((entry) => !selectedSlugs.has(entry.slug))
    .sort((a, b) => parsePublishedAt(b.publishedAt) - parsePublishedAt(a.publishedAt))
    .slice(0, Math.max(limit - baseSelection.length, 0));

  return [...baseSelection, ...fallback].slice(0, limit).map((entry) => ({
    slug: entry.slug,
    title: entry.title,
  }));
}

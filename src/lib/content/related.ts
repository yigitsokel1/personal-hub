import { getPublishedContentEntries } from "./get-content";
import { normalizeTag } from "./tags";
import type { ContentType } from "./types";

const RELATED_LIMIT = 3;

export type RelatedPreview = {
  id: string;
  slug: string;
  title: string;
  summary: string;
};

export function getRelatedInDomain(
  type: ContentType,
  slug: string,
  tags: string[] | undefined
): RelatedPreview[] {
  const currentTags = new Set(
    (tags ?? []).map((t) => normalizeTag(t)).filter(Boolean)
  );
  if (currentTags.size === 0) {
    return [];
  }

  const candidates = getPublishedContentEntries(type).filter(
    (e) => e.slug !== slug
  );

  return candidates
    .map((entry) => {
      const entryTags = new Set(
        (entry.tags ?? []).map((t) => normalizeTag(t)).filter(Boolean)
      );
      let shared = 0;
      for (const t of currentTags) {
        if (entryTags.has(t)) shared += 1;
      }
      return { entry, shared };
    })
    .filter((x) => x.shared > 0)
    .sort((a, b) => {
      if (b.shared !== a.shared) return b.shared - a.shared;
      return (
        new Date(b.entry.publishedAt).getTime() -
        new Date(a.entry.publishedAt).getTime()
      );
    })
    .slice(0, RELATED_LIMIT)
    .map(({ entry }) => ({
      id: entry.id,
      slug: entry.slug,
      title: entry.title,
      summary: entry.summary,
    }));
}

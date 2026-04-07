import { getPublishedContentEntries } from "./get-content";
import type { ContentType } from "./types";

const ALL_TYPES: ContentType[] = ["project", "work", "writing", "lab"];

export function normalizeTag(tag: string): string {
  return tag.trim();
}

export function tagPathSegment(tag: string): string {
  return encodeURIComponent(normalizeTag(tag));
}

/** Decode a dynamic `[tag]` route param and normalize for lookup. */
export function tagFromPathSegment(segment: string): string {
  return normalizeTag(decodeURIComponent(segment));
}

export type TagListedEntry = {
  id: string;
  type: ContentType;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
};

export function getPublishedEntriesByTag(
  normalizedTag: string
): TagListedEntry[] {
  const needle = normalizeTag(normalizedTag);
  if (!needle) return [];

  const out: TagListedEntry[] = [];
  for (const type of ALL_TYPES) {
    for (const entry of getPublishedContentEntries(type)) {
      const tags = entry.tags ?? [];
      if (!tags.some((t) => normalizeTag(t) === needle)) continue;
      out.push({
        id: entry.id,
        type,
        slug: entry.slug,
        title: entry.title,
        summary: entry.summary,
        publishedAt: entry.publishedAt,
      });
    }
  }

  return out.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/** For each tag, which content types use it (for /tags index hints). */
export function getTagDomainsMap(): Map<string, Set<ContentType>> {
  const map = new Map<string, Set<ContentType>>();
  for (const type of ALL_TYPES) {
    for (const entry of getPublishedContentEntries(type)) {
      for (const tag of entry.tags ?? []) {
        const n = normalizeTag(tag);
        if (!n) continue;
        let set = map.get(n);
        if (!set) {
          set = new Set();
          map.set(n, set);
        }
        set.add(type);
      }
    }
  }
  return map;
}

/** For each tag, count all published entries using it across domains. */
export function getTagCountsMap(): Map<string, number> {
  const map = new Map<string, number>();
  for (const type of ALL_TYPES) {
    for (const entry of getPublishedContentEntries(type)) {
      for (const tag of entry.tags ?? []) {
        const n = normalizeTag(tag);
        if (!n) continue;
        map.set(n, (map.get(n) ?? 0) + 1);
      }
    }
  }
  return map;
}

function collectTagsFromEntries(
  entries: { tags?: string[] }[]
): Set<string> {
  const set = new Set<string>();
  for (const entry of entries) {
    for (const tag of entry.tags ?? []) {
      const normalized = normalizeTag(tag);
      if (normalized) set.add(normalized);
    }
  }
  return set;
}

export function getTagsByType(type: ContentType): string[] {
  const entries = getPublishedContentEntries(type);
  return [...collectTagsFromEntries(entries)].sort((a, b) =>
    a.localeCompare(b)
  );
}

export function getAllTags(): string[] {
  const set = new Set<string>();
  for (const type of ALL_TYPES) {
    const entries = getPublishedContentEntries(type);
    for (const tag of collectTagsFromEntries(entries)) {
      set.add(tag);
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

import { getPublishedContentEntries } from "./get-content";
import type { ContentType } from "./types";

const ALL_TYPES: ContentType[] = ["project", "work", "writing", "lab"];

function normalizeTag(tag: string): string {
  return tag.trim();
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

import { normalizeTag } from "@/lib/tags/normalize-tag";
import type { ContentType } from "@/lib/content/types";
import type {
  DomainCollection,
  GroupedTagEntries,
  TagListEntry,
  TaggedEntry,
} from "@/lib/content-intelligence/types";

const DOMAIN_ORDER: ContentType[] = ["writing", "project", "work", "lab"];

function toDisplayTag(tag: string): string {
  return tag
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function emptyGroups(): Record<ContentType, TaggedEntry[]> {
  return {
    writing: [],
    project: [],
    work: [],
    lab: [],
  };
}

function compareByPublishedAtDesc(a: TaggedEntry, b: TaggedEntry): number {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}

export function buildTagIndex(input: DomainCollection<TaggedEntry>): TagListEntry[] {
  const aggregate = new Map<string, TagListEntry>();

  const register = (entry: TaggedEntry) => {
    const seenPerEntry = new Set<string>();
    for (const rawTag of entry.tags ?? []) {
      const tag = normalizeTag(rawTag);
      if (!tag || seenPerEntry.has(tag)) continue;
      seenPerEntry.add(tag);

      const existing = aggregate.get(tag);
      if (!existing) {
        aggregate.set(tag, {
          tag,
          displayTag: toDisplayTag(tag),
          totalCount: 1,
          domains: { [entry.type]: 1 },
        });
        continue;
      }

      existing.totalCount += 1;
      existing.domains[entry.type] = (existing.domains[entry.type] ?? 0) + 1;
    }
  };

  for (const entry of input.writing) register(entry);
  for (const entry of input.projects) register(entry);
  for (const entry of input.work) register(entry);
  for (const entry of input.labs) register(entry);

  return [...aggregate.values()].sort((a, b) => {
    if (b.totalCount !== a.totalCount) return b.totalCount - a.totalCount;
    return a.tag.localeCompare(b.tag);
  });
}

export function groupEntriesByTag(
  label: string,
  input: DomainCollection<TaggedEntry>
): GroupedTagEntries | null {
  const needle = normalizeTag(label);
  if (!needle) return null;

  const groups = emptyGroups();

  const register = (entry: TaggedEntry) => {
    const tags = new Set((entry.tags ?? []).map((tag) => normalizeTag(tag)).filter(Boolean));
    if (tags.has(needle)) {
      groups[entry.type].push(entry);
    }
  };

  for (const entry of input.writing) register(entry);
  for (const entry of input.projects) register(entry);
  for (const entry of input.work) register(entry);
  for (const entry of input.labs) register(entry);

  for (const domain of DOMAIN_ORDER) {
    groups[domain].sort(compareByPublishedAtDesc);
  }

  const totalCount = DOMAIN_ORDER.reduce((sum, domain) => sum + groups[domain].length, 0);
  if (totalCount === 0) return null;

  return {
    tag: needle,
    displayTag: toDisplayTag(needle),
    totalCount,
    groups,
  };
}

export function formatTagDisplay(label: string): string {
  return toDisplayTag(normalizeTag(label));
}

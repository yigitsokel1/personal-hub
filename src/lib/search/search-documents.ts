import { normalizeTag } from "@/lib/tags/normalize-tag";
import type { ContentEntry } from "@/lib/content/types";
import type { ContentWithBody } from "@/lib/content-source/types";
import type { SearchDocument } from "@/lib/content-intelligence/types";

function toSearchableText(entry: ContentWithBody<ContentEntry>): string {
  return [entry.summary, entry.body, ...(entry.tags ?? [])].filter(Boolean).join(" ").toLowerCase();
}

function toSearchDocument(entry: ContentWithBody<ContentEntry>): SearchDocument {
  return {
    id: entry.id,
    domain: entry.type,
    slug: entry.slug,
    title: entry.title,
    summary: entry.summary,
    tags: (entry.tags ?? []).map((tag) => normalizeTag(tag)).filter(Boolean),
    searchableText: toSearchableText(entry),
  };
}

export function buildSearchDocuments(
  entries: ContentWithBody<ContentEntry>[]
): SearchDocument[] {
  return entries.map(toSearchDocument);
}

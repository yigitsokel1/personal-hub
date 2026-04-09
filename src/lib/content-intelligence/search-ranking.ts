import { normalizeTag } from "@/lib/tags/normalize-tag";
import type { SearchDocument } from "@/lib/content-intelligence/types";

type RankedSearchResult = {
  document: SearchDocument;
  score: number;
};

const TITLE_EXACT = 300;
const TITLE_CONTAINS = 160;
const TAG_EXACT = 120;
const TAG_CONTAINS = 80;
const SUMMARY_CONTAINS = 40;
const BODY_CONTAINS = 20;

function normalizeQuery(input: string): string {
  return input.trim().toLowerCase();
}

export function rankSearchDocuments(documents: SearchDocument[], query: string): RankedSearchResult[] {
  const normalizedQuery = normalizeQuery(query);
  if (!normalizedQuery) return [];

  const normalizedTagNeedle = normalizeTag(normalizedQuery);

  return documents
    .map((document) => {
      const title = document.title.toLowerCase();
      const summary = document.summary.toLowerCase();
      const body = document.searchableText.toLowerCase();
      const tags = document.tags.map((tag) => normalizeTag(tag));

      let score = 0;

      if (title === normalizedQuery) score += TITLE_EXACT;
      else if (title.includes(normalizedQuery)) score += TITLE_CONTAINS;

      if (tags.some((tag) => tag === normalizedTagNeedle)) score += TAG_EXACT;
      else if (tags.some((tag) => tag.includes(normalizedTagNeedle))) score += TAG_CONTAINS;

      if (summary.includes(normalizedQuery)) score += SUMMARY_CONTAINS;
      if (body.includes(normalizedQuery)) score += BODY_CONTAINS;

      return { document, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.document.title.localeCompare(b.document.title));
}

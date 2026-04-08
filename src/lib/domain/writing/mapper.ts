import type { WritingFormInput, WritingInput } from "@/lib/domain/writing/types";

export const MAX_WRITING_TAGS = 3;

export function parseTags(tagsRaw: string): string[] {
  return Array.from(
    new Set(
      tagsRaw
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
  );
}

export function toWritingInput(form: WritingFormInput): WritingInput {
  const readingTime = Number(form.readingTime);
  return {
    title: form.title.trim(),
    slug: (form.slug.trim() || slugifyTitle(form.title)).toLowerCase(),
    summary: form.summary.trim(),
    body: form.body.trim(),
    tags: parseTags(form.tagsRaw),
    category: form.category.trim() || undefined,
    series: form.series.trim() || undefined,
    featured: form.featured,
    published: form.published,
    readingTime: Number.isFinite(readingTime) && readingTime > 0 ? readingTime : undefined,
    publishedAt: form.publishedAt.trim() || undefined,
  };
}

export function serializeTags(tags: string[]): string {
  return tags.join(", ");
}

export function slugifyTitle(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

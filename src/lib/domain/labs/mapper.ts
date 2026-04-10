import type { LabFormInput, LabInput } from "@/lib/domain/labs/types";
import { parseTags } from "@/lib/tags/normalize-tag";

export const MAX_LAB_TAGS = 3;

export function serializeCommaList(items: string[]): string {
  return items.join(", ");
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

export function toLabInput(form: LabFormInput): LabInput {
  return {
    title: form.title.trim(),
    slug: (form.slug.trim() || slugifyTitle(form.title)).toLowerCase(),
    summary: form.summary.trim(),
    body: form.body.trim(),
    tags: parseTags(form.tagsRaw),
    status: form.status,
    featured: form.featured,
    published: form.published,
    publishedAt: form.publishedAt.trim() || undefined,
    liveUrl: form.liveUrl.trim() || undefined,
  };
}

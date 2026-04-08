import type { WorkConfidentialityLevel, WorkFormInput, WorkInput } from "@/lib/domain/work/types";

export const MAX_WORK_TAGS = 3;
export const MAX_FEATURED_WORK = 2;

export const WORK_ENGAGEMENT_TYPES = ["freelance", "contract", "full-time"] as const;
export const WORK_CONFIDENTIALITY_LEVELS = ["public", "limited"] as const;

export function parseCommaList(raw: string): string[] {
  return Array.from(
    new Set(
      raw
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );
}

export function parseLineList(raw: string): string[] {
  return Array.from(
    new Set(
      raw
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );
}

export function serializeCommaList(items: string[]): string {
  return items.join(", ");
}

export function serializeLineList(items: string[]): string {
  return items.join("\n");
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

function parseConfidentialityLevel(
  value: WorkFormInput["confidentialityLevel"]
): WorkConfidentialityLevel | undefined {
  if (!value) return undefined;
  return value;
}

export function toWorkInput(form: WorkFormInput): WorkInput {
  return {
    title: form.title.trim(),
    slug: (form.slug.trim() || slugifyTitle(form.title)).toLowerCase(),
    summary: form.summary.trim(),
    body: form.body.trim(),
    tags: parseCommaList(form.tagsRaw),
    featured: form.featured,
    published: form.published,
    publishedAt: form.publishedAt.trim() || undefined,
    client: form.client.trim(),
    engagementType: form.engagementType,
    role: form.role.trim(),
    timeline: form.timeline.trim() || undefined,
    confidentialityLevel: parseConfidentialityLevel(form.confidentialityLevel),
    scope: parseLineList(form.scopeRaw),
    responsibilities: parseLineList(form.responsibilitiesRaw),
    constraints: parseLineList(form.constraintsRaw),
    impact: parseLineList(form.impactRaw),
  };
}

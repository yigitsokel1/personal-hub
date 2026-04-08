import type { ProjectFormInput, ProjectInput } from "@/lib/domain/projects/types";

export const MAX_PROJECT_TAGS = 3;
export const MAX_FEATURED_PROJECTS = 2;

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

export function toProjectInput(form: ProjectFormInput): ProjectInput {
  return {
    title: form.title.trim(),
    slug: (form.slug.trim() || slugifyTitle(form.title)).toLowerCase(),
    summary: form.summary.trim(),
    body: form.body.trim(),
    tags: parseCommaList(form.tagsRaw),
    featured: form.featured,
    published: form.published,
    publishedAt: form.publishedAt.trim() || undefined,
    role: form.role.trim(),
    stack: parseCommaList(form.stackRaw),
    platform: form.platform.trim() || undefined,
    problem: form.problem.trim(),
    solution: form.solution.trim(),
    architectureHighlights: parseLineList(form.architectureHighlightsRaw),
    decisions: parseLineList(form.decisionsRaw),
    outcomes: parseLineList(form.outcomesRaw),
    repoUrl: form.repoUrl.trim() || undefined,
    liveUrl: form.liveUrl.trim() || undefined,
    timeline: form.timeline.trim() || undefined,
  };
}

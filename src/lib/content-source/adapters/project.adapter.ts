import type { Project as PrismaProject } from "@prisma/client";
import type { ContentWithBody } from "@/lib/content/get-content";
import type { ProjectContent } from "@/lib/content/types";

export type DbProjectItem = ContentWithBody<ProjectContent> & {
  dbId: string;
  published: boolean;
};

export function adaptDbProject(record: PrismaProject): DbProjectItem {
  const tags = Array.isArray(record.tags) ? record.tags.filter(Boolean) : [];
  const stack = Array.isArray(record.stack) ? record.stack.filter(Boolean) : [];
  const architectureHighlights = Array.isArray(record.architectureHighlights)
    ? record.architectureHighlights.filter(Boolean)
    : [];
  const decisions = Array.isArray(record.decisions) ? record.decisions.filter(Boolean) : [];
  const outcomes = Array.isArray(record.outcomes) ? record.outcomes.filter(Boolean) : [];
  if (record.published && !record.publishedAt) {
    throw new Error(`Published project entry "${record.slug}" is missing publishedAt.`);
  }

  return {
    dbId: record.id,
    id: record.id,
    type: "project",
    title: record.title.trim(),
    slug: record.slug.trim(),
    summary: record.summary.trim(),
    body: record.body,
    tags,
    featured: Boolean(record.featured),
    status: record.published ? "published" : "draft",
    publishedAt: (record.publishedAt ?? record.createdAt).toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    role: record.role.trim(),
    stack,
    platform: record.platform ?? undefined,
    problem: record.problem.trim(),
    solution: record.solution.trim(),
    architectureHighlights,
    decisions,
    outcomes,
    repoUrl: record.repoUrl ?? undefined,
    liveUrl: record.liveUrl ?? undefined,
    timeline: record.timeline ?? undefined,
    published: record.published,
  };
}

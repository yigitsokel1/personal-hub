import type { Work as PrismaWork } from "@prisma/client";
import type { ContentWithBody } from "@/lib/content/get-content";
import type { WorkContent } from "@/lib/content/types";

export type DbWorkItem = ContentWithBody<WorkContent> & {
  dbId: string;
  published: boolean;
};

export function adaptDbWork(record: PrismaWork): DbWorkItem {
  const tags = Array.isArray(record.tags) ? record.tags.filter(Boolean) : [];
  const scope = Array.isArray(record.scope) ? record.scope.filter(Boolean) : [];
  const responsibilities = Array.isArray(record.responsibilities)
    ? record.responsibilities.filter(Boolean)
    : [];
  const constraints = Array.isArray(record.constraints) ? record.constraints.filter(Boolean) : [];
  const impact = Array.isArray(record.impact) ? record.impact.filter(Boolean) : [];
  if (record.published && !record.publishedAt) {
    throw new Error(`Published work entry "${record.slug}" is missing publishedAt.`);
  }

  return {
    dbId: record.id,
    id: record.id,
    type: "work",
    title: record.title.trim(),
    slug: record.slug.trim(),
    summary: record.summary.trim(),
    body: record.body,
    tags,
    featured: Boolean(record.featured),
    status: record.published ? "published" : "draft",
    publishedAt: (record.publishedAt ?? record.createdAt).toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    client: record.client.trim(),
    engagementType: record.engagementType as WorkContent["engagementType"],
    role: record.role.trim(),
    timeline: record.timeline ?? undefined,
    confidentialityLevel:
      (record.confidentialityLevel as WorkContent["confidentialityLevel"]) ?? undefined,
    scope,
    responsibilities,
    constraints,
    impact,
    published: record.published,
  };
}

import type { Lab as PrismaLab } from "@prisma/client";
import type { ContentWithBody } from "@/lib/content/get-content";
import type { LabContent } from "@/lib/content/types";

export type DbLabItem = ContentWithBody<LabContent> & {
  dbId: string;
  published: boolean;
};

export function adaptDbLab(record: PrismaLab): DbLabItem {
  const tags = Array.isArray(record.tags) ? record.tags.filter(Boolean) : [];

  return {
    dbId: record.id,
    id: record.id,
    type: "lab",
    title: record.title.trim(),
    slug: record.slug.trim(),
    summary: record.summary.trim(),
    body: record.body,
    tags,
    status: record.status as LabContent["status"],
    featured: Boolean(record.featured),
    publishedAt: (record.publishedAt ?? record.createdAt).toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    published: record.published,
  };
}

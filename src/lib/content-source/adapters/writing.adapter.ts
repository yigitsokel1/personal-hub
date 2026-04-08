import type { Writing as PrismaWriting } from "@prisma/client";
import type { ContentWithBody } from "@/lib/content/get-content";
import type { WritingContent } from "@/lib/content/types";

export type DbWritingItem = ContentWithBody<WritingContent> & {
  dbId: string;
  published: boolean;
};

export function adaptDbWriting(record: PrismaWriting): DbWritingItem {
  const tags = Array.isArray(record.tags) ? record.tags.filter(Boolean) : [];

  return {
    dbId: record.id,
    id: record.id,
    type: "writing",
    title: record.title.trim(),
    slug: record.slug.trim(),
    summary: record.summary.trim(),
    excerpt: record.summary.trim(),
    body: record.body,
    tags,
    category: record.category ?? undefined,
    series: record.series ?? undefined,
    featured: Boolean(record.featured),
    status: record.published ? "published" : "draft",
    publishedAt: (record.publishedAt ?? record.createdAt).toISOString(),
    readingTime: record.readingTime ?? undefined,
    updatedAt: record.updatedAt.toISOString(),
    published: record.published,
  };
}

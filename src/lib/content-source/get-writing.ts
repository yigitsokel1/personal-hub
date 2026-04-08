import { prisma } from "@/lib/db/prisma";
import type { ContentWithBody } from "@/lib/content/get-content";
import type { WritingContent } from "@/lib/content/types";
import { adaptDbWriting, type DbWritingItem } from "@/lib/content-source/adapters/writing.adapter";
import type { WritingInput } from "@/lib/domain/writing/types";

type WritingSource = "database";

function sortByPublishedDateDesc<T extends { publishedAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

export async function listAdminWriting(): Promise<DbWritingItem[]> {
  const rows = await prisma.writing.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  return rows.map(adaptDbWriting);
}

export async function getAdminWritingById(id: string): Promise<DbWritingItem | null> {
  const row = await prisma.writing.findUnique({
    where: { id },
  });

  return row ? adaptDbWriting(row) : null;
}

export async function createWriting(input: WritingInput): Promise<DbWritingItem> {
  const created = await prisma.writing.create({
    data: {
      title: input.title,
      slug: input.slug,
      summary: input.summary,
      body: input.body,
      tags: input.tags,
      category: input.category,
      series: input.series,
      featured: input.featured,
      published: input.published,
      readingTime: input.readingTime,
      publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
    },
  });

  return adaptDbWriting(created);
}

export async function updateWriting(id: string, input: WritingInput): Promise<DbWritingItem> {
  const updated = await prisma.writing.update({
    where: { id },
    data: {
      title: input.title,
      slug: input.slug,
      summary: input.summary,
      body: input.body,
      tags: input.tags,
      category: input.category,
      series: input.series,
      featured: input.featured,
      published: input.published,
      readingTime: input.readingTime,
      publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
    },
  });

  return adaptDbWriting(updated);
}

export async function countOtherFeaturedWriting(excludeId?: string): Promise<number> {
  return prisma.writing.count({
    where: {
      featured: true,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
  });
}

export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const existing = await prisma.writing.findFirst({
    where: {
      slug,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
    select: { id: true },
  });

  return Boolean(existing);
}

export async function deleteWritingById(id: string): Promise<{
  ok: boolean;
  slug?: string;
}> {
  const existing = await prisma.writing.findUnique({
    where: { id },
    select: { id: true, slug: true },
  });

  if (!existing) {
    return { ok: false };
  }

  await prisma.writing.delete({
    where: { id },
  });

  return { ok: true, slug: existing.slug };
}

export async function getPublishedWriting(): Promise<{
  source: WritingSource;
  value: ContentWithBody<WritingContent>[];
}> {
  const rows = await prisma.writing.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

  return {
    source: "database",
    value: sortByPublishedDateDesc(rows.map(adaptDbWriting)),
  };
}

export async function getWritingBySlug(slug: string): Promise<ContentWithBody<WritingContent> | null> {
  const dbRow = await prisma.writing.findFirst({
    where: {
      slug,
      published: true,
    },
  });
  if (dbRow) {
    return adaptDbWriting(dbRow);
  }

  return null;
}

export async function getWritingNeighbors(slug: string): Promise<{
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}> {
  const { value } = await getPublishedWriting();
  const asc = [...value].sort((a, b) => {
    return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
  });
  const index = asc.findIndex((entry) => entry.slug === slug);
  if (index === -1) {
    return { prev: null, next: null };
  }

  const prev = index > 0 ? { slug: asc[index - 1]!.slug, title: asc[index - 1]!.title } : null;
  const next =
    index < asc.length - 1 ? { slug: asc[index + 1]!.slug, title: asc[index + 1]!.title } : null;

  return { prev, next };
}

export async function getRelatedWriting(
  slug: string,
  tags: string[] | undefined
): Promise<{ slug: string; title: string }[]> {
  const currentTags = new Set((tags ?? []).map((tag) => tag.toLowerCase()).filter(Boolean));
  if (currentTags.size === 0) {
    return [];
  }

  const { value } = await getPublishedWriting();
  return value
    .filter((entry) => entry.slug !== slug)
    .map((entry) => {
      const entryTags = new Set((entry.tags ?? []).map((tag) => tag.toLowerCase()).filter(Boolean));
      let shared = 0;
      for (const tag of currentTags) {
        if (entryTags.has(tag)) shared += 1;
      }
      return { entry, shared };
    })
    .filter((entry) => entry.shared > 0)
    .sort((a, b) => {
      if (b.shared !== a.shared) return b.shared - a.shared;
      return new Date(b.entry.publishedAt).getTime() - new Date(a.entry.publishedAt).getTime();
    })
    .slice(0, 3)
    .map(({ entry }) => ({
      slug: entry.slug,
      title: entry.title,
    }));
}

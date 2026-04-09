import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { cache } from "react";
import type { ContentWithBody } from "@/lib/content-source/types";
import type { WritingContent } from "@/lib/content/types";
import { adaptDbWriting, type DbWritingItem } from "@/lib/content-source/adapters/writing.adapter";
import type { WritingInput } from "@/lib/domain/writing/types";
import { rankRelatedContent } from "@/lib/content-intelligence/related-ranking";

type WritingSource = "database";

function isMissingWritingTableError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2021" &&
    String(error.meta?.table ?? "").includes("writing")
  );
}

function toPublishedAtDate(published: boolean, publishedAt?: string): Date | null {
  if (!published) return publishedAt ? new Date(publishedAt) : null;
  if (!publishedAt) {
    throw new Error("publishedAt is required when published is true.");
  }
  return new Date(publishedAt);
}

export async function listAdminWriting(): Promise<DbWritingItem[]> {
  try {
    const rows = await prisma.writing.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
    return rows.map(adaptDbWriting);
  } catch (error) {
    if (isMissingWritingTableError(error)) return [];
    throw error;
  }
}

export async function getAdminWritingById(id: string): Promise<DbWritingItem | null> {
  try {
    const row = await prisma.writing.findUnique({
      where: { id },
    });
    return row ? adaptDbWriting(row) : null;
  } catch (error) {
    if (isMissingWritingTableError(error)) return null;
    throw error;
  }
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
      publishedAt: toPublishedAtDate(input.published, input.publishedAt),
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
      publishedAt: toPublishedAtDate(input.published, input.publishedAt),
    },
  });

  return adaptDbWriting(updated);
}

export async function countOtherFeaturedWriting(excludeId?: string): Promise<number> {
  try {
    return await prisma.writing.count({
      where: {
        featured: true,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
  } catch (error) {
    if (isMissingWritingTableError(error)) return 0;
    throw error;
  }
}

export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  try {
    const existing = await prisma.writing.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });
    return Boolean(existing);
  } catch (error) {
    if (isMissingWritingTableError(error)) return false;
    throw error;
  }
}

export async function deleteWritingById(id: string): Promise<{
  ok: boolean;
  slug?: string;
  tags?: string[];
  published?: boolean;
  featured?: boolean;
}> {
  const existing = await prisma.writing.findUnique({
    where: { id },
    select: { id: true, slug: true, tags: true, published: true, featured: true },
  });

  if (!existing) {
    return { ok: false };
  }

  await prisma.writing.delete({
    where: { id },
  });

  return {
    ok: true,
    slug: existing.slug,
    tags: existing.tags,
    published: existing.published,
    featured: existing.featured,
  };
}

export const getPublishedWriting = cache(async function getPublishedWriting(): Promise<{
  source: WritingSource;
  value: ContentWithBody<WritingContent>[];
}> {
  try {
    const rows = await prisma.writing.findMany({
      where: { published: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });

    return {
      source: "database",
      value: rows.map(adaptDbWriting),
    };
  } catch (error) {
    if (isMissingWritingTableError(error)) {
      return { source: "database", value: [] };
    }
    throw error;
  }
});

export async function getWritingBySlug(
  slug: string,
  options?: { includeUnpublished?: boolean }
): Promise<ContentWithBody<WritingContent> | null> {
  try {
    const dbRow = await prisma.writing.findFirst({
      where: {
        slug,
        ...(options?.includeUnpublished ? {} : { published: true }),
      },
    });
    if (dbRow) {
      return adaptDbWriting(dbRow);
    }
    return null;
  } catch (error) {
    if (isMissingWritingTableError(error)) return null;
    throw error;
  }
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
  const { value } = await getPublishedWriting();
  return rankRelatedContent(slug, tags, value);
}

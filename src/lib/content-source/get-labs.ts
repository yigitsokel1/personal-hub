import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { cache } from "react";
import type { ContentWithBody } from "@/lib/content-source/types";
import type { LabContent } from "@/lib/content/types";
import { adaptDbLab, type DbLabItem } from "@/lib/content-source/adapters/lab.adapter";
import type { LabInput } from "@/lib/domain/labs/types";
import { normalizeTag } from "@/lib/tags/normalize-tag";

type LabSource = "database";

function isMissingLabsTableError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2021" &&
    String(error.meta?.table ?? "").includes("labs")
  );
}

function toPublishedAtDate(published: boolean, publishedAt?: string): Date | null {
  if (!published) return publishedAt ? new Date(publishedAt) : null;
  if (!publishedAt) {
    throw new Error("publishedAt is required when published is true.");
  }
  return new Date(publishedAt);
}

export async function listAdminLabs(): Promise<DbLabItem[]> {
  try {
    const rows = await prisma.lab.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
    return rows.map(adaptDbLab);
  } catch (error) {
    if (isMissingLabsTableError(error)) return [];
    throw error;
  }
}

export async function getAdminLabById(id: string): Promise<DbLabItem | null> {
  try {
    const row = await prisma.lab.findUnique({
      where: { id },
    });
    return row ? adaptDbLab(row) : null;
  } catch (error) {
    if (isMissingLabsTableError(error)) return null;
    throw error;
  }
}

export async function createLab(input: LabInput): Promise<DbLabItem> {
  const created = await prisma.lab.create({
    data: {
      title: input.title,
      slug: input.slug,
      summary: input.summary,
      body: input.body,
      tags: input.tags,
      status: input.status,
      featured: input.featured,
      published: input.published,
      publishedAt: toPublishedAtDate(input.published, input.publishedAt),
    },
  });

  return adaptDbLab(created);
}

export async function updateLab(id: string, input: LabInput): Promise<DbLabItem> {
  const updated = await prisma.lab.update({
    where: { id },
    data: {
      title: input.title,
      slug: input.slug,
      summary: input.summary,
      body: input.body,
      tags: input.tags,
      status: input.status,
      featured: input.featured,
      published: input.published,
      publishedAt: toPublishedAtDate(input.published, input.publishedAt),
    },
  });

  return adaptDbLab(updated);
}

export async function deleteLabById(id: string): Promise<{
  ok: boolean;
  slug?: string;
  tags?: string[];
  published?: boolean;
  featured?: boolean;
}> {
  const existing = await prisma.lab.findUnique({
    where: { id },
    select: { id: true, slug: true, tags: true, published: true, featured: true },
  });

  if (!existing) {
    return { ok: false };
  }

  await prisma.lab.delete({
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

export async function isLabSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  try {
    const existing = await prisma.lab.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });
    return Boolean(existing);
  } catch (error) {
    if (isMissingLabsTableError(error)) return false;
    throw error;
  }
}

export async function countOtherFeaturedLabs(excludeId?: string): Promise<number> {
  try {
    return await prisma.lab.count({
      where: {
        featured: true,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
  } catch (error) {
    if (isMissingLabsTableError(error)) return 0;
    throw error;
  }
}

export const getPublishedLabs = cache(async function getPublishedLabs(): Promise<{
  source: LabSource;
  value: ContentWithBody<LabContent>[];
}> {
  try {
    const rows = await prisma.lab.findMany({
      where: { published: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });

    return {
      source: "database",
      value: rows.map(adaptDbLab),
    };
  } catch (error) {
    if (isMissingLabsTableError(error)) {
      return { source: "database", value: [] };
    }
    throw error;
  }
});

export async function getLabBySlug(
  slug: string,
  options?: { includeUnpublished?: boolean }
): Promise<ContentWithBody<LabContent> | null> {
  try {
    const row = await prisma.lab.findFirst({
      where: {
        slug,
        ...(options?.includeUnpublished ? {} : { published: true }),
      },
    });
    return row ? adaptDbLab(row) : null;
  } catch (error) {
    if (isMissingLabsTableError(error)) return null;
    throw error;
  }
}

export async function getRelatedLabs(
  slug: string,
  tags: string[] | undefined
): Promise<{ slug: string; title: string }[]> {
  const currentTags = new Set((tags ?? []).map((tag) => normalizeTag(tag)).filter(Boolean));
  if (currentTags.size === 0) {
    return [];
  }

  const { value } = await getPublishedLabs();
  return value
    .filter((entry) => entry.slug !== slug)
    .map((entry) => {
      const entryTags = new Set((entry.tags ?? []).map((tag) => normalizeTag(tag)).filter(Boolean));
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

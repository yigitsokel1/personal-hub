import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { cache } from "react";
import type { ContentWithBody } from "@/lib/content-source/types";
import type { WorkContent } from "@/lib/content/types";
import { adaptDbWork, type DbWorkItem } from "@/lib/content-source/adapters/work.adapter";
import type { WorkInput } from "@/lib/domain/work/types";
import { rankRelatedContent } from "@/lib/content-intelligence/related-ranking";
import {
  normalizeDateOnlyInput,
  parseDateOnlyToUtc,
  todayDateOnlyInTurkey,
} from "@/lib/datetime/published-at";

type WorkSource = "database";

function isMissingWorkTableError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2021" &&
    String(error.meta?.table ?? "").includes("work")
  );
}

function toPublishedAtDate(
  published: boolean,
  publishedAt?: string,
  existingPublishedAt?: Date | null
): Date | null {
  const normalized = normalizeDateOnlyInput(publishedAt);
  if (!published) return normalized ? parseDateOnlyToUtc(normalized) : null;
  if (normalized) return parseDateOnlyToUtc(normalized);
  if (existingPublishedAt) return existingPublishedAt;
  return parseDateOnlyToUtc(todayDateOnlyInTurkey());
}

export async function listAdminWork(): Promise<DbWorkItem[]> {
  try {
    const rows = await prisma.work.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
    return rows.map(adaptDbWork);
  } catch (error) {
    if (isMissingWorkTableError(error)) return [];
    throw error;
  }
}

export async function getAdminWorkById(id: string): Promise<DbWorkItem | null> {
  try {
    const row = await prisma.work.findUnique({
      where: { id },
    });
    return row ? adaptDbWork(row) : null;
  } catch (error) {
    if (isMissingWorkTableError(error)) return null;
    throw error;
  }
}

export async function createWork(input: WorkInput): Promise<DbWorkItem> {
  const created = await prisma.work.create({
    data: {
      title: input.title,
      slug: input.slug,
      summary: input.summary,
      body: input.body,
      tags: input.tags,
      featured: input.featured,
      published: input.published,
      publishedAt: toPublishedAtDate(input.published, input.publishedAt),
      client: input.client,
      engagementType: input.engagementType,
      role: input.role,
      timeline: input.timeline,
      projectUrl: input.liveUrl,
      confidentialityLevel: input.confidentialityLevel,
      scope: input.scope,
      responsibilities: input.responsibilities,
      constraints: input.constraints,
      impact: input.impact,
    },
  });

  return adaptDbWork(created);
}

export async function updateWork(id: string, input: WorkInput): Promise<DbWorkItem> {
  const existing = await prisma.work.findUnique({
    where: { id },
    select: { publishedAt: true },
  });
  const updated = await prisma.work.update({
    where: { id },
    data: {
      title: input.title,
      slug: input.slug,
      summary: input.summary,
      body: input.body,
      tags: input.tags,
      featured: input.featured,
      published: input.published,
      publishedAt: toPublishedAtDate(input.published, input.publishedAt, existing?.publishedAt),
      client: input.client,
      engagementType: input.engagementType,
      role: input.role,
      timeline: input.timeline,
      projectUrl: input.liveUrl,
      confidentialityLevel: input.confidentialityLevel,
      scope: input.scope,
      responsibilities: input.responsibilities,
      constraints: input.constraints,
      impact: input.impact,
    },
  });

  return adaptDbWork(updated);
}

export async function deleteWorkById(id: string): Promise<{
  ok: boolean;
  slug?: string;
  tags?: string[];
  published?: boolean;
  featured?: boolean;
}> {
  const existing = await prisma.work.findUnique({
    where: { id },
    select: { id: true, slug: true, tags: true, published: true, featured: true },
  });

  if (!existing) {
    return { ok: false };
  }

  await prisma.work.delete({
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

export async function isWorkSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  try {
    const existing = await prisma.work.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });
    return Boolean(existing);
  } catch (error) {
    if (isMissingWorkTableError(error)) return false;
    throw error;
  }
}

export async function countOtherFeaturedWork(excludeId?: string): Promise<number> {
  try {
    return await prisma.work.count({
      where: {
        featured: true,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
  } catch (error) {
    if (isMissingWorkTableError(error)) return 0;
    throw error;
  }
}

export const getPublishedWork = cache(async function getPublishedWork(): Promise<{
  source: WorkSource;
  value: ContentWithBody<WorkContent>[];
}> {
  try {
    const rows = await prisma.work.findMany({
      where: { published: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });

    return {
      source: "database",
      value: rows.map(adaptDbWork),
    };
  } catch (error) {
    if (isMissingWorkTableError(error)) {
      return { source: "database", value: [] };
    }
    throw error;
  }
});

export async function getWorkBySlug(
  slug: string,
  options?: { includeUnpublished?: boolean }
): Promise<ContentWithBody<WorkContent> | null> {
  try {
    const row = await prisma.work.findFirst({
      where: {
        slug,
        ...(options?.includeUnpublished ? {} : { published: true }),
      },
    });
    return row ? adaptDbWork(row) : null;
  } catch (error) {
    if (isMissingWorkTableError(error)) return null;
    throw error;
  }
}

export async function getRelatedWork(
  slug: string,
  tags: string[] | undefined
): Promise<{ slug: string; title: string }[]> {
  const { value } = await getPublishedWork();
  return rankRelatedContent(slug, tags, value);
}

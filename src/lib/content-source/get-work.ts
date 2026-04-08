import { prisma } from "@/lib/db/prisma";
import type { ContentWithBody } from "@/lib/content/get-content";
import type { WorkContent } from "@/lib/content/types";
import { adaptDbWork, type DbWorkItem } from "@/lib/content-source/adapters/work.adapter";
import type { WorkInput } from "@/lib/domain/work/types";

type WorkSource = "database";

function sortByPublishedDateDesc<T extends { publishedAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

export async function listAdminWork(): Promise<DbWorkItem[]> {
  const rows = await prisma.work.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });
  return rows.map(adaptDbWork);
}

export async function getAdminWorkById(id: string): Promise<DbWorkItem | null> {
  const row = await prisma.work.findUnique({
    where: { id },
  });
  return row ? adaptDbWork(row) : null;
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
      publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
      client: input.client,
      engagementType: input.engagementType,
      role: input.role,
      timeline: input.timeline,
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
      publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
      client: input.client,
      engagementType: input.engagementType,
      role: input.role,
      timeline: input.timeline,
      confidentialityLevel: input.confidentialityLevel,
      scope: input.scope,
      responsibilities: input.responsibilities,
      constraints: input.constraints,
      impact: input.impact,
    },
  });

  return adaptDbWork(updated);
}

export async function deleteWorkById(id: string): Promise<{ ok: boolean; slug?: string }> {
  const existing = await prisma.work.findUnique({
    where: { id },
    select: { id: true, slug: true },
  });

  if (!existing) {
    return { ok: false };
  }

  await prisma.work.delete({
    where: { id },
  });

  return { ok: true, slug: existing.slug };
}

export async function isWorkSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const existing = await prisma.work.findFirst({
    where: {
      slug,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
    select: { id: true },
  });

  return Boolean(existing);
}

export async function countOtherFeaturedWork(excludeId?: string): Promise<number> {
  return prisma.work.count({
    where: {
      featured: true,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
  });
}

export async function getPublishedWork(): Promise<{
  source: WorkSource;
  value: ContentWithBody<WorkContent>[];
}> {
  const rows = await prisma.work.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

  return {
    source: "database",
    value: sortByPublishedDateDesc(rows.map(adaptDbWork)),
  };
}

export async function getWorkBySlug(slug: string): Promise<ContentWithBody<WorkContent> | null> {
  const row = await prisma.work.findFirst({
    where: {
      slug,
      published: true,
    },
  });
  return row ? adaptDbWork(row) : null;
}

export async function getRelatedWork(
  slug: string,
  tags: string[] | undefined
): Promise<{ slug: string; title: string }[]> {
  const currentTags = new Set((tags ?? []).map((tag) => tag.toLowerCase()).filter(Boolean));
  if (currentTags.size === 0) {
    return [];
  }

  const { value } = await getPublishedWork();
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

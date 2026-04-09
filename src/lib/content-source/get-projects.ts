import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { cache } from "react";
import type { ContentWithBody } from "@/lib/content-source/types";
import type { ProjectContent } from "@/lib/content/types";
import { adaptDbProject, type DbProjectItem } from "@/lib/content-source/adapters/project.adapter";
import type { ProjectInput } from "@/lib/domain/projects/types";
import { normalizeTag } from "@/lib/tags/normalize-tag";

type ProjectSource = "database";

function isMissingProjectsTableError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2021" &&
    String(error.meta?.table ?? "").includes("projects")
  );
}

function toPublishedAtDate(published: boolean, publishedAt?: string): Date | null {
  if (!published) return publishedAt ? new Date(publishedAt) : null;
  if (!publishedAt) {
    throw new Error("publishedAt is required when published is true.");
  }
  return new Date(publishedAt);
}

export async function listAdminProjects(): Promise<DbProjectItem[]> {
  try {
    const rows = await prisma.project.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
    return rows.map(adaptDbProject);
  } catch (error) {
    if (isMissingProjectsTableError(error)) return [];
    throw error;
  }
}

export async function getAdminProjectById(id: string): Promise<DbProjectItem | null> {
  try {
    const row = await prisma.project.findUnique({
      where: { id },
    });
    return row ? adaptDbProject(row) : null;
  } catch (error) {
    if (isMissingProjectsTableError(error)) return null;
    throw error;
  }
}

export async function createProject(input: ProjectInput): Promise<DbProjectItem> {
  const created = await prisma.project.create({
    data: {
      title: input.title,
      slug: input.slug,
      summary: input.summary,
      body: input.body,
      tags: input.tags,
      featured: input.featured,
      published: input.published,
      publishedAt: toPublishedAtDate(input.published, input.publishedAt),
      role: input.role,
      stack: input.stack,
      platform: input.platform,
      problem: input.problem,
      solution: input.solution,
      architectureHighlights: input.architectureHighlights,
      decisions: input.decisions,
      outcomes: input.outcomes,
      repoUrl: input.repoUrl,
      liveUrl: input.liveUrl,
      timeline: input.timeline,
    },
  });

  return adaptDbProject(created);
}

export async function updateProject(id: string, input: ProjectInput): Promise<DbProjectItem> {
  const updated = await prisma.project.update({
    where: { id },
    data: {
      title: input.title,
      slug: input.slug,
      summary: input.summary,
      body: input.body,
      tags: input.tags,
      featured: input.featured,
      published: input.published,
      publishedAt: toPublishedAtDate(input.published, input.publishedAt),
      role: input.role,
      stack: input.stack,
      platform: input.platform,
      problem: input.problem,
      solution: input.solution,
      architectureHighlights: input.architectureHighlights,
      decisions: input.decisions,
      outcomes: input.outcomes,
      repoUrl: input.repoUrl,
      liveUrl: input.liveUrl,
      timeline: input.timeline,
    },
  });

  return adaptDbProject(updated);
}

export async function deleteProjectById(id: string): Promise<{
  ok: boolean;
  slug?: string;
  tags?: string[];
  published?: boolean;
  featured?: boolean;
}> {
  const existing = await prisma.project.findUnique({
    where: { id },
    select: { id: true, slug: true, tags: true, published: true, featured: true },
  });

  if (!existing) {
    return { ok: false };
  }

  await prisma.project.delete({
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

export async function isProjectSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const existing = await prisma.project.findFirst({
    where: {
      slug,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
    select: { id: true },
  });

  return Boolean(existing);
}

export async function countOtherFeaturedProjects(excludeId?: string): Promise<number> {
  return prisma.project.count({
    where: {
      featured: true,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
  });
}

export const getPublishedProjects = cache(async function getPublishedProjects(): Promise<{
  source: ProjectSource;
  value: ContentWithBody<ProjectContent>[];
}> {
  try {
    const rows = await prisma.project.findMany({
      where: { published: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });

    return {
      source: "database",
      value: rows.map(adaptDbProject),
    };
  } catch (error) {
    if (isMissingProjectsTableError(error)) {
      return { source: "database", value: [] };
    }
    throw error;
  }
});

export async function getProjectBySlug(
  slug: string,
  options?: { includeUnpublished?: boolean }
): Promise<ContentWithBody<ProjectContent> | null> {
  try {
    const row = await prisma.project.findFirst({
      where: {
        slug,
        ...(options?.includeUnpublished ? {} : { published: true }),
      },
    });
    return row ? adaptDbProject(row) : null;
  } catch (error) {
    if (isMissingProjectsTableError(error)) return null;
    throw error;
  }
}

export async function getProjectNeighbors(slug: string): Promise<{
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}> {
  const { value } = await getPublishedProjects();
  const asc = [...value].sort((a, b) => {
    return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
  });
  const index = asc.findIndex((entry) => entry.slug === slug);
  if (index === -1) {
    return { prev: null, next: null };
  }

  const prev = index > 0 ? { slug: asc[index - 1]!.slug, title: asc[index - 1]!.title } : null;
  const next = index < asc.length - 1 ? { slug: asc[index + 1]!.slug, title: asc[index + 1]!.title } : null;

  return { prev, next };
}

export async function getRelatedProjects(
  slug: string,
  tags: string[] | undefined
): Promise<{ slug: string; title: string }[]> {
  const currentTags = new Set((tags ?? []).map((tag) => normalizeTag(tag)).filter(Boolean));
  if (currentTags.size === 0) {
    return [];
  }

  const { value } = await getPublishedProjects();
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

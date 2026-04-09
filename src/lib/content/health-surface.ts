import { prisma } from "@/lib/db/prisma";
import { getFeaturedLimit } from "@/lib/content-policies/featured";
import { collectContentHealthReport } from "@/lib/content/content-health";
import type { ContentDomain } from "@/lib/content-source/types";

export type FeaturedOverflowItem = {
  domain: ContentDomain;
  limit: number;
  count: number;
  slugs: string[];
};

export type ContentHealthSurface = {
  blocking: string[];
  advisory: string[];
  invalidPublishState: string[];
  featuredOverflow: FeaturedOverflowItem[];
};

async function collectFeaturedOverflow(): Promise<FeaturedOverflowItem[]> {
  const [writing, projects, work, labs] = await Promise.all([
    prisma.writing.findMany({ where: { featured: true }, select: { slug: true } }),
    prisma.project.findMany({ where: { featured: true }, select: { slug: true } }),
    prisma.work.findMany({ where: { featured: true }, select: { slug: true } }),
    prisma.lab.findMany({ where: { featured: true }, select: { slug: true } }),
  ]);

  const rows: Array<{ domain: ContentDomain; slugs: string[] }> = [
    { domain: "writing", slugs: writing.map((item) => item.slug) },
    { domain: "projects", slugs: projects.map((item) => item.slug) },
    { domain: "work", slugs: work.map((item) => item.slug) },
    { domain: "labs", slugs: labs.map((item) => item.slug) },
  ];

  return rows
    .map((row) => {
      const limit = getFeaturedLimit(row.domain);
      return {
        domain: row.domain,
        limit,
        count: row.slugs.length,
        slugs: row.slugs,
      };
    })
    .filter((row) => row.count > row.limit);
}

async function collectInvalidPublishState(): Promise<string[]> {
  const [writing, projects, work, labs] = await Promise.all([
    prisma.writing.findMany({
      where: { published: true, publishedAt: null },
      select: { slug: true },
    }),
    prisma.project.findMany({
      where: { published: true, publishedAt: null },
      select: { slug: true },
    }),
    prisma.work.findMany({
      where: { published: true, publishedAt: null },
      select: { slug: true },
    }),
    prisma.lab.findMany({
      where: { published: true, publishedAt: null },
      select: { slug: true },
    }),
  ]);

  return [
    ...writing.map((item) => `[writing ${item.slug}] published=true but publishedAt is null`),
    ...projects.map((item) => `[projects ${item.slug}] published=true but publishedAt is null`),
    ...work.map((item) => `[work ${item.slug}] published=true but publishedAt is null`),
    ...labs.map((item) => `[labs ${item.slug}] published=true but publishedAt is null`),
  ];
}

export async function getContentHealthSurface(): Promise<ContentHealthSurface> {
  const [baseReport, invalidPublishState, featuredOverflow] = await Promise.all([
    collectContentHealthReport(),
    collectInvalidPublishState(),
    collectFeaturedOverflow(),
  ]);

  return {
    blocking: baseReport.blocking,
    advisory: baseReport.advisory,
    invalidPublishState,
    featuredOverflow,
  };
}

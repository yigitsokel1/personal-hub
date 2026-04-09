import { PrismaClient } from "@prisma/client";
import { getFeaturedLimit } from "@/lib/content-policies/featured";
import type { ContentDomain } from "@/lib/content-source/types";

const prisma = new PrismaClient();

type OverflowRow = {
  domain: ContentDomain;
  limit: number;
  count: number;
  slugs: string[];
};

async function main(): Promise<void> {
  const rows: OverflowRow[] = [];

  const domains: ContentDomain[] = ["writing", "projects", "work", "labs"];
  for (const domain of domains) {
    const limit = getFeaturedLimit(domain);

    if (domain === "writing") {
      const items = await prisma.writing.findMany({
        where: { featured: true },
        select: { slug: true },
      });
      if (items.length > limit) {
        rows.push({ domain, limit, count: items.length, slugs: items.map((item) => item.slug) });
      }
      continue;
    }

    if (domain === "projects") {
      const items = await prisma.project.findMany({
        where: { featured: true },
        select: { slug: true },
      });
      if (items.length > limit) {
        rows.push({ domain, limit, count: items.length, slugs: items.map((item) => item.slug) });
      }
      continue;
    }

    if (domain === "work") {
      const items = await prisma.work.findMany({
        where: { featured: true },
        select: { slug: true },
      });
      if (items.length > limit) {
        rows.push({ domain, limit, count: items.length, slugs: items.map((item) => item.slug) });
      }
      continue;
    }

    const items = await prisma.lab.findMany({
      where: { featured: true },
      select: { slug: true },
    });
    if (items.length > limit) {
      rows.push({ domain, limit, count: items.length, slugs: items.map((item) => item.slug) });
    }
  }

  if (rows.length === 0) {
    console.log("Featured audit passed: no overflow detected.");
    return;
  }

  console.log("Featured overflow detected:");
  for (const row of rows) {
    console.log(
      `- ${row.domain}: limit=${row.limit}, count=${row.count}, slugs=${row.slugs.join(", ")}`
    );
  }
  process.exitCode = 1;
}

void main()
  .catch((error) => {
    console.error("Featured audit failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

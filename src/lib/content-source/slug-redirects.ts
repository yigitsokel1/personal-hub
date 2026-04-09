import { prisma } from "@/lib/db/prisma";
import type { ContentDomain } from "@/lib/content-source/types";

export async function recordSlugRedirect(
  domain: ContentDomain,
  previousSlug: string,
  nextSlug: string
): Promise<void> {
  if (!previousSlug || !nextSlug || previousSlug === nextSlug) {
    return;
  }

  await prisma.$transaction([
    prisma.contentSlugRedirect.updateMany({
      where: {
        domain,
        newSlug: previousSlug,
      },
      data: {
        newSlug: nextSlug,
      },
    }),
    prisma.contentSlugRedirect.upsert({
      where: {
        domain_oldSlug: {
          domain,
          oldSlug: previousSlug,
        },
      },
      update: {
        newSlug: nextSlug,
      },
      create: {
        domain,
        oldSlug: previousSlug,
        newSlug: nextSlug,
      },
    }),
  ]);
}

export async function resolveSlugRedirect(
  domain: ContentDomain,
  slug: string
): Promise<string | null> {
  if (!slug) return null;
  const redirect = await prisma.contentSlugRedirect.findUnique({
    where: {
      domain_oldSlug: {
        domain,
        oldSlug: slug,
      },
    },
    select: {
      newSlug: true,
    },
  });

  if (!redirect?.newSlug || redirect.newSlug === slug) {
    return null;
  }

  return redirect.newSlug;
}

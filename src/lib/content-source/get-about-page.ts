import { cache } from "react";
import { prisma } from "@/lib/db/prisma";
import { adaptDbAboutPageContent } from "@/lib/content-source/adapters/about-page.adapter";
import { getDefaultAboutPageContent } from "@/lib/domain/about-page/mapper";
import type { AboutPageInput } from "@/lib/domain/about-page/types";

export const getAboutPageContent = cache(async function getAboutPageContent() {
  const fallback = getDefaultAboutPageContent();
  let content = null;
  try {
    content = await prisma.aboutPageContent.findUnique({
      where: { id: 1 },
    });
  } catch {
    content = null;
  }

  if (!content) {
    return {
      source: "fallback" as const,
      value: fallback,
    };
  }

  const adapted = adaptDbAboutPageContent(content);
  return {
    source: "database" as const,
    value: {
      ...fallback,
      ...adapted,
      sections: adapted.sections.length > 0 ? adapted.sections : fallback.sections,
    },
  };
});

export async function saveAboutPageContent(input: AboutPageInput) {
  const saved = await prisma.aboutPageContent.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      title: input.title,
      intro: input.intro,
      sections: input.sections,
    },
    update: {
      title: input.title,
      intro: input.intro,
      sections: input.sections,
    },
  });
  return adaptDbAboutPageContent(saved);
}

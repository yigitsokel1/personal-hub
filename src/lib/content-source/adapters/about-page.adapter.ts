import type { AboutPageContent as PrismaAboutPageContent } from "@prisma/client";
import type { AboutPageContent, AboutSection } from "@/lib/domain/about-page/types";

function toSections(value: unknown): AboutSection[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const section = item as { heading?: unknown; body?: unknown };
      if (typeof section.heading !== "string" || typeof section.body !== "string") return null;
      return {
        heading: section.heading.trim(),
        body: section.body.trim(),
      };
    })
    .filter((item): item is AboutSection => Boolean(item));
}

export function adaptDbAboutPageContent(record: PrismaAboutPageContent): AboutPageContent {
  return {
    title: record.title,
    intro: record.intro,
    sections: toSections(record.sections),
    updatedAt: record.updatedAt.toISOString(),
  };
}

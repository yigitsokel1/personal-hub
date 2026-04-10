import { homepageCopy } from "@/lib/content/homepage-copy";
import type { AboutPageContent, AboutPageInput, AboutSection } from "@/lib/domain/about-page/types";

export function getDefaultAboutPageContent(): AboutPageContent {
  return {
    title: homepageCopy.aboutPage.title,
    intro: homepageCopy.aboutPage.intro,
    sections: homepageCopy.aboutPage.sections.map((section) => ({
      heading: section.heading,
      body: section.body,
    })),
  };
}

export function parseAboutSectionsText(raw: string): AboutSection[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [headingPart, ...bodyParts] = line.split("|");
      return {
        heading: (headingPart ?? "").trim(),
        body: bodyParts.join("|").trim(),
      };
    });
}

export function serializeAboutSectionsText(sections: AboutSection[]): string {
  return sections.map((section) => `${section.heading} | ${section.body}`).join("\n");
}

export function toAboutPageInput(content: AboutPageContent): AboutPageInput {
  return {
    title: content.title,
    intro: content.intro,
    sections: content.sections,
  };
}

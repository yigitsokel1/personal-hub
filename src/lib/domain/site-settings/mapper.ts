import { homepageCopy } from "@/lib/content/homepage-copy";
import type { SiteSettings, SiteSettingsInput } from "@/lib/domain/site-settings/types";

export function getDefaultSiteSettings(): SiteSettings {
  return {
    heroTitle: homepageCopy.hero.titleLines.join(" "),
    heroSubtitle: homepageCopy.hero.subtitle,
    productSignals: [
      {
        label: "content_first_system",
        detail: "Typed content layer enforced at build-time via content parsing and schema validation.",
      },
      {
        label: "code_first_delivery",
        detail: "CMS-free workflow with MDX templates and type-safe route generation.",
      },
      {
        label: "engineering_judgment",
        detail: "Case studies capture scope, trade-offs, and delivery constraints as first-class metadata.",
      },
      {
        label: "continuous_builder",
        detail: "Projects, writing, and labs ship through one shared content pipeline.",
      },
    ],
    aboutShort: homepageCopy.compactAbout,
    footerIntro:
      "Personal hub for building and documenting real systems across projects, work, writing, and labs.",
    contactEmail: "oyigitsokell@gmail.com",
    githubUrl: "https://github.com/yigitsokel1",
    linkedinUrl: "https://www.linkedin.com/in/osman-yigit-sokel/",
  };
}

export function toSiteSettingsInput(settings: SiteSettings): SiteSettingsInput {
  return {
    heroTitle: settings.heroTitle,
    heroSubtitle: settings.heroSubtitle,
    productSignals: settings.productSignals,
    aboutShort: settings.aboutShort,
    footerIntro: settings.footerIntro,
    contactEmail: settings.contactEmail,
    githubUrl: settings.githubUrl,
    linkedinUrl: settings.linkedinUrl,
  };
}

import { homepageCopy } from "@/lib/content/homepage-copy";
import type { SiteSettings, SiteSettingsInput } from "@/lib/domain/site-settings/types";

export function getDefaultSiteSettings(): SiteSettings {
  return {
    brandLabel: homepageCopy.siteTitle,
    positioningLine: homepageCopy.hero.kicker,
    footerSignature: "product_engineering.for_real_systems()",
    heroTitle: homepageCopy.hero.titleLines.join(" "),
    heroSubtitle: homepageCopy.hero.subtitle,
    productSignals: [
      {
        label: "validation_loops",
        detail: "Each domain runs on explicit schema validation and publish gates before content goes live.",
      },
      {
        label: "delivery_pipeline",
        detail: "Admin workflows map to production delivery: draft, preview, publish, and deterministic ordering.",
      },
      {
        label: "state_management",
        detail: "Cross-domain state stays typed and constrained so rendering does not rely on implicit assumptions.",
      },
      {
        label: "decision_systems",
        detail: "Projects and work capture trade-offs, constraints, and outcomes as operational signals.",
      },
    ],
    footerIntro:
      "Personal hub for building and operating real systems across projects, work, writing, and labs.",
    contactEmail: "oyigitsokell@gmail.com",
    githubUrl: "https://github.com/yigitsokel1",
    linkedinUrl: "https://www.linkedin.com/in/osman-yigit-sokel/",
  };
}

export function toSiteSettingsInput(settings: SiteSettings): SiteSettingsInput {
  return {
    brandLabel: settings.brandLabel,
    positioningLine: settings.positioningLine,
    footerSignature: settings.footerSignature,
    heroTitle: settings.heroTitle,
    heroSubtitle: settings.heroSubtitle,
    productSignals: settings.productSignals,
    footerIntro: settings.footerIntro,
    contactEmail: settings.contactEmail,
    githubUrl: settings.githubUrl,
    linkedinUrl: settings.linkedinUrl,
  };
}

import type { SiteSettings as PrismaSiteSettings } from "@prisma/client";
import type { SiteSettings, SiteSettingsProductSignal } from "@/lib/domain/site-settings/types";

function toProductSignals(value: unknown): SiteSettingsProductSignal[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const signal = item as { label?: unknown; detail?: unknown };
      if (typeof signal.label !== "string" || typeof signal.detail !== "string") {
        return null;
      }

      return {
        label: signal.label.trim(),
        detail: signal.detail.trim(),
      };
    })
    .filter((item): item is SiteSettingsProductSignal => Boolean(item));
}

export function adaptDbSiteSettings(record: PrismaSiteSettings): SiteSettings {
  return {
    heroTitle: record.heroTitle,
    heroSubtitle: record.heroSubtitle,
    productSignals: toProductSignals(record.productSignals),
    aboutShort: record.aboutShort,
    footerIntro: record.footerIntro,
    contactEmail: record.contactEmail,
    githubUrl: record.githubUrl,
    linkedinUrl: record.linkedinUrl,
    updatedAt: record.updatedAt.toISOString(),
  };
}

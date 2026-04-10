import { prisma } from "@/lib/db/prisma";
import { cache } from "react";
import { getDefaultSiteSettings } from "@/lib/domain/site-settings/mapper";
import type { SiteSettingsInput } from "@/lib/domain/site-settings/types";
import { adaptDbSiteSettings } from "@/lib/content-source/adapters/site-settings.adapter";

export const getSiteSettings = cache(async function getSiteSettings() {
  const fallback = getDefaultSiteSettings();
  let settings = null;
  try {
    settings = await prisma.siteSettings.findUnique({
      where: { id: 1 },
    });
  } catch {
    settings = null;
  }

  if (!settings) {
    return {
      source: "fallback" as const,
      value: fallback,
    };
  }

  const adapted = adaptDbSiteSettings(settings);
  return {
    source: "database" as const,
    value: {
      ...fallback,
      ...adapted,
      productSignals: adapted.productSignals.length > 0 ? adapted.productSignals : fallback.productSignals,
    },
  };
});

export async function saveSiteSettings(input: SiteSettingsInput) {
  const saved = await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      brandLabel: input.brandLabel,
      positioningLine: input.positioningLine,
      footerSignature: input.footerSignature,
      heroTitle: input.heroTitle,
      heroSubtitle: input.heroSubtitle,
      productSignals: input.productSignals,
      footerIntro: input.footerIntro,
      contactEmail: input.contactEmail,
      githubUrl: input.githubUrl,
      linkedinUrl: input.linkedinUrl,
    },
    update: {
      brandLabel: input.brandLabel,
      positioningLine: input.positioningLine,
      footerSignature: input.footerSignature,
      heroTitle: input.heroTitle,
      heroSubtitle: input.heroSubtitle,
      productSignals: input.productSignals,
      footerIntro: input.footerIntro,
      contactEmail: input.contactEmail,
      githubUrl: input.githubUrl,
      linkedinUrl: input.linkedinUrl,
    },
  });

  return adaptDbSiteSettings(saved);
}

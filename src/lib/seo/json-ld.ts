import { getAboutPageContent } from "@/lib/content-source/get-about-page";
import { getSiteSettings } from "@/lib/content-source/get-site-settings";
import type { WritingContent } from "@/lib/content/types";
import { getSiteMetadataBase } from "./build-metadata";

export async function buildArticleJsonLd(
  item: WritingContent & { slug: string }
): Promise<Record<string, unknown> | null> {
  const base = getSiteMetadataBase();
  if (!base) return null;
  const { value: settings } = await getSiteSettings();

  const url = new URL(`/writing/${item.slug}`, `${base.origin}/`).toString();
  const description = item.seo?.description ?? item.summary;
  const dateModified = item.updatedAt ?? item.publishedAt;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    description,
    datePublished: item.publishedAt,
    dateModified,
    url,
    author: {
      "@type": "Person",
      name: settings.brandLabel,
    },
    publisher: {
      "@type": "Organization",
      name: settings.brandLabel,
      url: `${base.origin}/`,
    },
  };
}

export async function buildWebSiteJsonLd(): Promise<Record<string, unknown> | null> {
  const base = getSiteMetadataBase();
  if (!base) return null;
  const { value: settings } = await getSiteSettings();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.brandLabel,
    url: `${base.origin}/`,
    description: settings.heroSubtitle,
  };
}

export async function buildAboutPersonJsonLd(): Promise<Record<string, unknown> | null> {
  const base = getSiteMetadataBase();
  if (!base) return null;
  const { value: settings } = await getSiteSettings();
  const { value: about } = await getAboutPageContent();

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.brandLabel,
    url: `${base.origin}/`,
    description: about.intro,
  };
}

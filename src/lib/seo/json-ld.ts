import { homepageCopy } from "@/lib/content/homepage-copy";
import type { WritingContent } from "@/lib/content/types";
import { getSiteMetadataBase } from "./build-metadata";

export function buildArticleJsonLd(
  item: WritingContent & { slug: string }
): Record<string, unknown> | null {
  const base = getSiteMetadataBase();
  if (!base) return null;

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
      name: homepageCopy.siteName,
    },
    publisher: {
      "@type": "Organization",
      name: homepageCopy.siteName,
      url: `${base.origin}/`,
    },
  };
}

export function buildWebSiteJsonLd(): Record<string, unknown> | null {
  const base = getSiteMetadataBase();
  if (!base) return null;

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: homepageCopy.siteName,
    url: `${base.origin}/`,
    description: homepageCopy.siteDescription,
  };
}

export function buildAboutPersonJsonLd(): Record<string, unknown> | null {
  const base = getSiteMetadataBase();
  if (!base) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: homepageCopy.siteName,
    url: `${base.origin}/`,
    description: homepageCopy.aboutPage.intro,
  };
}

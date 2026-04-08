import type { MetadataRoute } from "next";
import { CONTENT_PATH_PREFIX } from "@/lib/content/config";
import { reportContentHealthAtBuild } from "@/lib/content/content-health";
import { getAllContent } from "@/lib/content-source/get-all-content";
import { tagPathSegment } from "@/lib/content/tags";
import { getSiteMetadataBase } from "@/lib/seo/build-metadata";

const STATIC_PATHS = [
  "/",
  "/about",
  "/projects",
  "/work",
  "/writing",
  "/labs",
  "/tags",
] as const;

function absoluteUrl(pathname: string, origin: string): string {
  if (!origin) return pathname;
  const base = origin.endsWith("/") ? origin.slice(0, -1) : origin;
  return `${base}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  reportContentHealthAtBuild();

  const base = getSiteMetadataBase();
  const origin = base?.origin ?? "";

  // Path-only URLs are invalid for sitemaps; omit entries until NEXT_PUBLIC_SITE_URL is set.
  if (!origin) {
    return [];
  }

  const entries: MetadataRoute.Sitemap = [];

  for (const path of STATIC_PATHS) {
    entries.push({
      url: absoluteUrl(path, origin),
    });
  }

  const content = await getAllContent();

  for (const item of content.writing) {
    entries.push({
      url: absoluteUrl(`${CONTENT_PATH_PREFIX.writing}/${item.slug}`, origin),
      lastModified: new Date(item.updatedAt ?? item.publishedAt),
    });
  }
  for (const item of content.projects) {
    entries.push({
      url: absoluteUrl(`${CONTENT_PATH_PREFIX.project}/${item.slug}`, origin),
      lastModified: new Date(item.updatedAt ?? item.publishedAt),
    });
  }
  for (const item of content.work) {
    entries.push({
      url: absoluteUrl(`${CONTENT_PATH_PREFIX.work}/${item.slug}`, origin),
      lastModified: new Date(item.updatedAt ?? item.publishedAt),
    });
  }
  for (const item of content.labs) {
    entries.push({
      url: absoluteUrl(`${CONTENT_PATH_PREFIX.lab}/${item.slug}`, origin),
      lastModified: new Date(item.updatedAt ?? item.publishedAt),
    });
  }

  const writingTags = new Set<string>();
  for (const item of content.writing) {
    for (const tag of item.tags ?? []) {
      const normalized = tag.trim();
      if (normalized) writingTags.add(normalized);
    }
  }
  for (const item of content.projects) {
    for (const tag of item.tags ?? []) {
      const normalized = tag.trim();
      if (normalized) writingTags.add(normalized);
    }
  }
  for (const item of content.work) {
    for (const tag of item.tags ?? []) {
      const normalized = tag.trim();
      if (normalized) writingTags.add(normalized);
    }
  }
  for (const item of content.labs) {
    for (const tag of item.tags ?? []) {
      const normalized = tag.trim();
      if (normalized) writingTags.add(normalized);
    }
  }

  for (const tag of writingTags) {
    entries.push({
      url: absoluteUrl(`/tags/${tagPathSegment(tag)}`, origin),
    });
  }

  return entries;
}

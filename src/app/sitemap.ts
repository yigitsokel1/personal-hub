import type { MetadataRoute } from "next";
import { CONTENT_PATH_PREFIX } from "@/lib/content/config";
import { reportContentHealthAtBuild } from "@/lib/content/content-health";
import { getPublishedContentEntries } from "@/lib/content/get-content";
import type { ContentType } from "@/lib/content/types";
import { getAllTags, tagPathSegment } from "@/lib/content/tags";
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

export default function sitemap(): MetadataRoute.Sitemap {
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

  const types: ContentType[] = ["project", "work", "writing", "lab"];
  for (const type of types) {
    const items = getPublishedContentEntries(type);
    const prefix = CONTENT_PATH_PREFIX[type];
    for (const item of items) {
      const path = `${prefix}/${item.slug}`;
      entries.push({
        url: absoluteUrl(path, origin),
        lastModified: new Date(item.updatedAt ?? item.publishedAt),
      });
    }
  }

  for (const tag of getAllTags()) {
    entries.push({
      url: absoluteUrl(`/tags/${tagPathSegment(tag)}`, origin),
    });
  }

  return entries;
}

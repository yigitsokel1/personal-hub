import type { MetadataRoute } from "next";
import { getPublishedContentEntries } from "@/lib/content/get-content";
import type { ContentType } from "@/lib/content/types";
import { getSiteMetadataBase } from "@/lib/seo/build-metadata";

const STATIC_PATHS = [
  "/",
  "/about",
  "/projects",
  "/work",
  "/writing",
  "/labs",
] as const;

const TYPE_PREFIX: Record<ContentType, string> = {
  project: "/projects",
  work: "/work",
  writing: "/writing",
  lab: "/labs",
};

function absoluteUrl(pathname: string, origin: string): string {
  if (!origin) return pathname;
  const base = origin.endsWith("/") ? origin.slice(0, -1) : origin;
  return `${base}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteMetadataBase();
  const origin = base?.origin ?? "";

  const entries: MetadataRoute.Sitemap = [];

  for (const path of STATIC_PATHS) {
    entries.push({
      url: absoluteUrl(path, origin),
    });
  }

  const types: ContentType[] = ["project", "work", "writing", "lab"];
  for (const type of types) {
    const items = getPublishedContentEntries(type);
    const prefix = TYPE_PREFIX[type];
    for (const item of items) {
      const path = `${prefix}/${item.slug}`;
      entries.push({
        url: absoluteUrl(path, origin),
        lastModified: new Date(item.updatedAt ?? item.publishedAt),
      });
    }
  }

  return entries;
}

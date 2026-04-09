import type { ContentType } from "./types";

/** URL path prefix per content type (sitemap, tag pages, links). */
export const CONTENT_PATH_PREFIX: Record<ContentType, string> = {
  project: "/projects",
  work: "/work",
  writing: "/writing",
  lab: "/labs",
};

import path from "node:path";
import type { ContentType } from "./types";

export const CONTENT_ROOT = path.join(process.cwd(), "src", "content");

export const CONTENT_DIRS: Record<ContentType, string> = {
  project: path.join(CONTENT_ROOT, "projects"),
  work: path.join(CONTENT_ROOT, "work"),
  writing: path.join(CONTENT_ROOT, "writing"),
  lab: path.join(CONTENT_ROOT, "labs"),
};

/** URL path prefix per content type (sitemap, tag pages, links). */
export const CONTENT_PATH_PREFIX: Record<ContentType, string> = {
  project: "/projects",
  work: "/work",
  writing: "/writing",
  lab: "/labs",
};

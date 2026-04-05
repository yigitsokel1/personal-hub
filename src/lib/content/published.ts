import type { ContentStatus } from "./types";

/** Omitted `status` counts as published; only `draft` is excluded from public surfaces. */
export function isPublishedContent(entry: { status?: ContentStatus }): boolean {
  return entry.status !== "draft";
}

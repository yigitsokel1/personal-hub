/** Omitted `status` counts as published; only `draft` is excluded from public surfaces. */
export function isPublishedContent(entry: { status?: string }): boolean {
  return entry.status !== "draft";
}

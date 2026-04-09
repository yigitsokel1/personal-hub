export function normalizeTag(tag: string): string {
  return tag.trim();
}

export function tagPathSegment(tag: string): string {
  return encodeURIComponent(normalizeTag(tag));
}

/** Decode a dynamic `[tag]` route param and normalize for lookup. */
export function tagFromPathSegment(segment: string): string {
  return normalizeTag(decodeURIComponent(segment));
}

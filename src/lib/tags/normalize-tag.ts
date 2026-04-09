export function normalizeTag(tag: string): string {
  const normalized = tag
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized;
}

export function parseTags(tagsRaw: string[] | string): string[] {
  const input = Array.isArray(tagsRaw) ? tagsRaw : tagsRaw.split(",");
  const unique = new Set<string>();

  for (const tag of input) {
    const normalized = normalizeTag(tag);
    if (!normalized) continue;
    unique.add(normalized);
  }

  return [...unique];
}

export function tagPathSegment(tag: string): string {
  return encodeURIComponent(normalizeTag(tag));
}

export function tagFromPathSegment(segment: string): string {
  return normalizeTag(decodeURIComponent(segment));
}

import type { ContentDomain } from "@/lib/content-source/types";

const FEATURED_LIMITS: Record<ContentDomain, number> = {
  writing: 2,
  projects: 2,
  work: 2,
  labs: 2,
};

export function getFeaturedLimit(domain: ContentDomain): number {
  return FEATURED_LIMITS[domain];
}

export function assertFeaturedLimit(domain: ContentDomain, count: number): string | null {
  const limit = getFeaturedLimit(domain);
  if (count < limit) return null;
  return `Maximum ${limit} featured ${domain} items are allowed.`;
}

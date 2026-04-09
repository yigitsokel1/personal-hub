import { revalidatePath } from "next/cache";
import type { ContentDomain } from "@/lib/content-source/types";
import { normalizeTag } from "@/lib/tags/normalize-tag";

type RevalidateContentInput = {
  domain: ContentDomain;
  slug?: string;
  previousSlug?: string;
  tags?: string[];
  previousTags?: string[];
  published?: boolean;
  previousPublished?: boolean;
  featured?: boolean;
  previousFeatured?: boolean;
};

const FEED_SURFACES = ["/writing/feed.xml"];

export function revalidateDomainContent(domain: ContentDomain, slug?: string): void {
  revalidatePath(`/${domain}`);
  if (slug) {
    revalidatePath(`/${domain}/${slug}`);
    revalidatePath(`/preview/${domain}/${slug}`);
  }
}

export function revalidateSiteShell(): void {
  revalidatePath("/");
  revalidatePath("/tags");
  revalidatePath("/sitemap.xml");
  for (const feedPath of FEED_SURFACES) {
    revalidatePath(feedPath);
  }
}

export function revalidateTagSurfaces(tags: string[] = []): void {
  revalidatePath("/tags");
  for (const tag of new Set(tags.filter(Boolean))) {
    revalidatePath(`/tags/${encodeURIComponent(tag)}`);
  }
}

export function revalidateContentSurfaces(input: RevalidateContentInput): void {
  const normalizedCurrent = new Set(
    (input.tags ?? []).map((tag) => normalizeTag(tag)).filter(Boolean)
  );
  const normalizedPrevious = new Set(
    (input.previousTags ?? []).map((tag) => normalizeTag(tag)).filter(Boolean)
  );

  const changedTags = new Set<string>();
  for (const tag of normalizedCurrent) {
    if (!normalizedPrevious.has(tag)) changedTags.add(tag);
  }
  for (const tag of normalizedPrevious) {
    if (!normalizedCurrent.has(tag)) changedTags.add(tag);
  }

  const slugChanged = Boolean(input.previousSlug && input.previousSlug !== input.slug);
  const publishChanged = input.published !== input.previousPublished;
  const featuredChanged = input.featured !== input.previousFeatured;
  const shouldRevalidateSiteShell =
    publishChanged || featuredChanged || changedTags.size > 0 || slugChanged;

  if (shouldRevalidateSiteShell) {
    revalidateSiteShell();
  }

  revalidateDomainContent(input.domain, input.slug);
  revalidatePath(`/admin/${input.domain}`);

  if (slugChanged && input.previousSlug) {
    revalidatePath(`/${input.domain}/${input.previousSlug}`);
    revalidatePath(`/preview/${input.domain}/${input.previousSlug}`);
  }

  if (changedTags.size > 0) {
    revalidateTagSurfaces([...changedTags]);
  }
}

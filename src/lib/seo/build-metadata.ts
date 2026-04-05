/**
 * Detail-page metadata helpers (not a general SEO framework).
 * Site-wide frontmatter and env rules: `metadata-conventions.md` in this folder.
 *
 * Title rules:
 * - If `seo.title` is set: use `{ absolute: seo.title }` so the root `title.template` does not apply.
 * - Otherwise: return a segment `${contentTitle} — ${sectionLabel}`; the root layout’s
 *   `title.template` appends the site name.
 * Description: `seo.description ?? summary`.
 */
import type { Metadata } from "next";
import { homepageCopy } from "@/lib/content/homepage-copy";

/** Nav-aligned labels for default title segments (keep in sync with site-header routes). */
export const contentSectionLabel = {
  project: "Projects",
  work: "Work",
  writing: "Writing",
  lab: "Labs",
} as const;

export type ContentSectionKey = keyof typeof contentSectionLabel;

export function getSiteMetadataBase(): URL | undefined {
  // Set in production for correct canonical and Open Graph URLs (e.g. https://example.com).
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return undefined;
  try {
    const normalized = raw.endsWith("/") ? raw.slice(0, -1) : raw;
    return new URL(normalized);
  } catch {
    return undefined;
  }
}

export type BuildContentDetailMetadataInput = {
  pathname: string;
  sectionLabel: string;
  contentTitle: string;
  summary: string;
  seo?: { title?: string; description?: string };
  cover?: { src: string; alt?: string };
  openGraphType: "article" | "website";
};

function fullTitleForSharing(
  segment: string,
  seoTitle: string | undefined
): string {
  if (seoTitle) return seoTitle;
  return `${segment} | ${homepageCopy.siteName}`;
}

export function buildContentDetailMetadata(
  input: BuildContentDetailMetadataInput
): Metadata {
  const description = input.seo?.description ?? input.summary;
  const segment = `${input.contentTitle} — ${input.sectionLabel}`;
  const title: Metadata["title"] = input.seo?.title
    ? { absolute: input.seo.title }
    : segment;

  const ogTitle = fullTitleForSharing(segment, input.seo?.title);
  const base = getSiteMetadataBase();
  const canonical =
    base != null ? new URL(input.pathname, `${base.origin}/`).toString() : undefined;

  const images: NonNullable<Metadata["openGraph"]>["images"] | undefined =
    input.cover?.src
      ? [{ url: input.cover.src, alt: input.cover.alt }]
      : undefined;

  return {
    description,
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      title: ogTitle,
      description,
      url: canonical,
      siteName: homepageCopy.siteName,
      type: input.openGraphType,
      ...(images ? { images } : {}),
    },
    title,
  };
}

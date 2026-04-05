/**
 * Route metadata helpers (detail pages, simple indexes — not a general SEO framework).
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

/** App Router file convention; must match `src/app/opengraph-image.tsx` dimensions. */
const defaultOgImagePath = "/opengraph-image";
const defaultOgWidth = 1200;
const defaultOgHeight = 630;

/**
 * Absolute URL for the default share image when `NEXT_PUBLIC_SITE_URL` is set.
 * Per-entry `cover` still overrides on detail routes when wired in `buildContentDetailMetadata`.
 */
export function getDefaultOgImageAbsolute(
  base: URL
): { url: string; width: number; height: number } {
  return {
    url: new URL(defaultOgImagePath, `${base.origin}/`).toString(),
    width: defaultOgWidth,
    height: defaultOgHeight,
  };
}

function shareImagesWithFallback(
  base: URL | undefined,
  cover: { src: string; alt?: string } | undefined
): {
  openGraph: { url: string; alt?: string; width?: number; height?: number }[];
  twitter: string[];
} {
  if (cover?.src) {
    return {
      openGraph: [{ url: cover.src, alt: cover.alt }],
      twitter: [cover.src],
    };
  }
  if (base) {
    const d = getDefaultOgImageAbsolute(base);
    return {
      openGraph: [{ url: d.url, width: d.width, height: d.height }],
      twitter: [d.url],
    };
  }
  return { openGraph: [], twitter: [] };
}

function twitterCardMetadata(input: {
  title: string;
  description: string;
  imageUrls: string[];
}): Metadata["twitter"] {
  const base = {
    card: "summary_large_image" as const,
    title: input.title,
    description: input.description,
  };
  if (input.imageUrls.length === 0) return base;
  return { ...base, images: input.imageUrls };
}

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

export type BuildSimplePageMetadataInput = {
  pathname: string;
  /** Becomes `<title>` segment; root layout `title.template` appends the site name. */
  title: string;
  description: string;
};

/**
 * List/index routes and simple static pages (about, tags index).
 */
export function buildSimplePageMetadata(
  input: BuildSimplePageMetadataInput
): Metadata {
  const base = getSiteMetadataBase();
  const canonical =
    base != null
      ? new URL(input.pathname, `${base.origin}/`).toString()
      : undefined;
  const ogTitle = `${input.title} | ${homepageCopy.siteName}`;
  const { openGraph: ogImages, twitter: twImages } = shareImagesWithFallback(
    base,
    undefined
  );

  return {
    title: input.title,
    description: input.description,
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      title: ogTitle,
      description: input.description,
      url: canonical ?? input.pathname,
      siteName: homepageCopy.siteName,
      type: "website",
      ...(ogImages.length ? { images: ogImages } : {}),
    },
    twitter: twitterCardMetadata({
      title: ogTitle,
      description: input.description,
      imageUrls: twImages,
    }),
  };
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

  const { openGraph: ogImages, twitter: twImages } = shareImagesWithFallback(
    base,
    input.cover
  );

  return {
    description,
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      title: ogTitle,
      description,
      url: canonical,
      siteName: homepageCopy.siteName,
      type: input.openGraphType,
      ...(ogImages.length ? { images: ogImages } : {}),
    },
    twitter: twitterCardMetadata({
      title: ogTitle,
      description,
      imageUrls: twImages,
    }),
    title,
  };
}

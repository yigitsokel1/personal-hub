import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentListItem } from "@/components/content/content-list-item";
import { ContentMeta } from "@/components/content/content-meta";
import { DomainIndexEmpty } from "@/components/content/domain-index-empty";
import { CONTENT_PATH_PREFIX } from "@/lib/content/config";
import { getAllContent } from "@/lib/content-source/get-all-content";
import { homepageCopy } from "@/lib/content/homepage-copy";
import {
  normalizeTag,
  tagFromPathSegment,
  tagPathSegment,
} from "@/lib/content/tags";
import {
  contentSectionLabel,
  getSiteMetadataBase,
} from "@/lib/seo/build-metadata";
import {
  contentInlineLinkClassName,
} from "@/lib/ui/link-tokens";

type TagDetailPageProps = {
  params: Promise<{ tag: string }>;
};

async function getCanonicalTagsAndEntriesByTag(label: string) {
  const content = await getAllContent();
  const normalizedNeedle = normalizeTag(label);
  const tagSet = new Set<string>();
  const entries: {
    id: string;
    type: "project" | "work" | "writing" | "lab";
    slug: string;
    title: string;
    summary: string;
    publishedAt: string;
  }[] = [];

  for (const entry of content.writing) {
    for (const tag of entry.tags ?? []) {
      const normalized = normalizeTag(tag);
      if (normalized) tagSet.add(normalized);
      if (normalizedNeedle && normalized === normalizedNeedle) {
        entries.push({
          id: entry.id,
          type: "writing",
          slug: entry.slug,
          title: entry.title,
          summary: entry.summary,
          publishedAt: entry.publishedAt,
        });
      }
    }
  }
  for (const entry of content.projects) {
    for (const tag of entry.tags ?? []) {
      const normalized = normalizeTag(tag);
      if (normalized) tagSet.add(normalized);
      if (normalizedNeedle && normalized === normalizedNeedle) {
        entries.push({
          id: entry.id,
          type: "project",
          slug: entry.slug,
          title: entry.title,
          summary: entry.summary,
          publishedAt: entry.publishedAt,
        });
      }
    }
  }
  for (const entry of content.work) {
    for (const tag of entry.tags ?? []) {
      const normalized = normalizeTag(tag);
      if (normalized) tagSet.add(normalized);
      if (normalizedNeedle && normalized === normalizedNeedle) {
        entries.push({
          id: entry.id,
          type: "work",
          slug: entry.slug,
          title: entry.title,
          summary: entry.summary,
          publishedAt: entry.publishedAt,
        });
      }
    }
  }
  for (const entry of content.labs) {
    for (const tag of entry.tags ?? []) {
      const normalized = normalizeTag(tag);
      if (normalized) tagSet.add(normalized);
      if (normalizedNeedle && normalized === normalizedNeedle) {
        entries.push({
          id: entry.id,
          type: "lab",
          slug: entry.slug,
          title: entry.title,
          summary: entry.summary,
          publishedAt: entry.publishedAt,
        });
      }
    }
  }

  return {
    tags: [...tagSet].sort((a, b) => a.localeCompare(b)),
    entries: entries.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    ),
  };
}

export async function generateStaticParams() {
  const { tags } = await getCanonicalTagsAndEntriesByTag("");
  return tags.map((tag) => ({
    tag: tagPathSegment(tag),
  }));
}

export async function generateMetadata({
  params,
}: TagDetailPageProps): Promise<Metadata> {
  const { tag } = await params;
  const label = tagFromPathSegment(tag);
  const { tags } = await getCanonicalTagsAndEntriesByTag(label);
  const knownTags = new Set(tags);
  if (label !== "" && !knownTags.has(label)) {
    notFound();
  }
  const base = getSiteMetadataBase();
  const pathname =
    label !== "" ? `/tags/${tagPathSegment(label)}` : `/tags/${tag}`;
  const canonical =
    base != null ? new URL(pathname, `${base.origin}/`).toString() : undefined;

  const titleSegment = label !== "" ? `${label} — Tags` : "Tag — Tags";
  const description =
    label !== ""
      ? `Content tagged “${label}”.`
      : "Content for this tag.";
  const ogTitle = `${titleSegment} | ${homepageCopy.siteName}`;

  return {
    title: titleSegment,
    description,
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      title: ogTitle,
      description,
      url: canonical ?? pathname,
      siteName: homepageCopy.siteName,
      type: "website",
    },
  };
}

export default async function TagDetailPage({ params }: TagDetailPageProps) {
  const { tag } = await params;
  const label = tagFromPathSegment(tag);
  const { tags, entries } = await getCanonicalTagsAndEntriesByTag(label);
  const knownTags = new Set(tags);
  if (label !== "" && !knownTags.has(label)) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <header className="max-w-3xl">
        <p className="text-sm text-black/50">
          <Link href="/tags" className={contentInlineLinkClassName}>
            Tags
          </Link>
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          {label !== "" ? (
            <>
              <span className="text-black/55">#</span>
              {label}
            </>
          ) : (
            "Tag"
          )}
        </h1>
      </header>

      {entries.length === 0 ? (
        <DomainIndexEmpty noun="tags" href="/tags" />
      ) : (
        <div className="mt-12 max-w-3xl border-t border-black/8">
          {entries.map((item) => (
            <ContentListItem
              key={item.id}
              variant="list"
              href={`${CONTENT_PATH_PREFIX[item.type]}/${item.slug}`}
              title={item.title}
              summary={item.summary}
              meta={
                <ContentMeta
                  items={[{ label: contentSectionLabel[item.type], type: "text" }]}
                />
              }
            />
          ))}
        </div>
      )}
    </main>
  );
}

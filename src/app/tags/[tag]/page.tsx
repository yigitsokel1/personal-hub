import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentListItem } from "@/components/content/content-list-item";
import { ContentMeta } from "@/components/content/content-meta";
import { DomainIndexEmpty } from "@/components/content/domain-index-empty";
import { CONTENT_PATH_PREFIX } from "@/lib/content/config";
import { homepageCopy } from "@/lib/content/homepage-copy";
import {
  getAllTags,
  getPublishedEntriesByTag,
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

export function generateStaticParams() {
  return getAllTags().map((tag) => ({
    tag: tagPathSegment(tag),
  }));
}

export async function generateMetadata({
  params,
}: TagDetailPageProps): Promise<Metadata> {
  const { tag } = await params;
  const label = tagFromPathSegment(tag);
  const knownTags = new Set(getAllTags());
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
  const knownTags = new Set(getAllTags());
  if (label !== "" && !knownTags.has(label)) {
    notFound();
  }
  const entries = label !== "" ? getPublishedEntriesByTag(label) : [];

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

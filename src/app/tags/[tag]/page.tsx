import type { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentListItem } from "@/components/content/content-list-item";
import { ContentMeta } from "@/components/content/content-meta";
import { DomainIndexEmpty } from "@/components/content/domain-index-empty";
import { CONTENT_PATH_PREFIX } from "@/lib/content/config";
import {
  buildTagIndex,
  formatTagDisplay,
  groupEntriesByTag,
} from "@/lib/content-intelligence/tag-grouping";
import { getAllContent } from "@/lib/content-source/get-all-content";
import {
  tagFromPathSegment,
  tagPathSegment,
} from "@/lib/content/tags";
import {
  buildSimplePageMetadata,
  contentSectionLabel,
} from "@/lib/seo/build-metadata";
import {
  contentInlineLinkClassName,
} from "@/lib/ui/link-tokens";
import { sectionLabelClassName } from "@/lib/ui/terminal-tokens";

type TagDetailPageProps = {
  params: Promise<{ tag: string }>;
};

const getCanonicalTagsAndEntriesByTag = cache(async (label: string) => {
  const content = await getAllContent();
  const index = buildTagIndex({
    writing: content.writing,
    projects: content.projects,
    work: content.work,
    labs: content.labs,
  });
  const grouped = groupEntriesByTag(label, {
    writing: content.writing,
    projects: content.projects,
    work: content.work,
    labs: content.labs,
  });

  return {
    tags: index.map((entry) => entry.tag),
    grouped,
  };
});

function isInvalidTagSegment(rawSegment: string, normalizedTag: string): boolean {
  return rawSegment.trim().length > 0 && normalizedTag === "";
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
  if (isInvalidTagSegment(tag, label)) {
    notFound();
  }
  const { tags } = await getCanonicalTagsAndEntriesByTag(label);
  const knownTags = new Set(tags);
  if (label !== "" && !knownTags.has(label)) {
    notFound();
  }
  const pathname =
    label !== "" ? `/tags/${tagPathSegment(label)}` : `/tags/${tag}`;

  const displayTag = formatTagDisplay(label);
  const titleSegment = label !== "" ? `${displayTag} — Tags` : "Tag — Tags";
  const description =
    label !== ""
      ? `Content tagged “${displayTag}”.`
      : "Content for this tag.";

  return buildSimplePageMetadata({
    pathname,
    title: titleSegment,
    description,
  });
}

export default async function TagDetailPage({ params }: TagDetailPageProps) {
  const { tag } = await params;
  const label = tagFromPathSegment(tag);
  if (isInvalidTagSegment(tag, label)) {
    notFound();
  }
  const { tags, grouped } = await getCanonicalTagsAndEntriesByTag(label);
  const knownTags = new Set(tags);
  if (label !== "" && !knownTags.has(label)) {
    notFound();
  }
  const displayTag = formatTagDisplay(label);
  const groups = grouped?.groups;
  const totalCount = grouped?.totalCount ?? 0;
  const nonEmptyGroupCount = groups
    ? (["writing", "project", "work", "lab"] as const).filter(
        (domain) => groups[domain].length > 0,
      ).length
    : 0;

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-22 lg:py-24">
      <header className="max-w-3xl">
        <p className="text-sm text-black/50">
          <Link href="/tags" className={contentInlineLinkClassName}>
            Tags
          </Link>
        </p>
        <p className={`${sectionLabelClassName} mt-5`}>TAG VIEW</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          {label !== "" ? (
            <>
              <span className="text-black/55">#</span>
              {displayTag}
            </>
          ) : (
            "Tag"
          )}
        </h1>
        {totalCount > 0 ? (
          <p className="mt-3 font-mono text-sm text-black/55">
            {totalCount} {totalCount === 1 ? "item" : "items"} across{" "}
            {nonEmptyGroupCount} {nonEmptyGroupCount === 1 ? "domain" : "domains"}
          </p>
        ) : null}
        {totalCount > 0 ? (
          <p className="mt-2 text-sm leading-relaxed text-black/58">
            Grouped by domain for faster scanning.
          </p>
        ) : null}
      </header>

      {!groups ? (
        <DomainIndexEmpty noun="tags" href="/tags" />
      ) : (
        <div className="mt-12 max-w-3xl border-t border-black/8">
          {(["writing", "project", "work", "lab"] as const).map((domain) => {
            const entries = groups[domain];
            if (entries.length === 0) return null;
            return (
              <section key={domain} className="pt-9 sm:pt-10">
                <h2 className="font-mono text-sm uppercase tracking-wide text-black/55">
                  {contentSectionLabel[domain]} ({entries.length})
                </h2>
                <div className="mt-4">
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
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}

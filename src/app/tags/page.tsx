import type { Metadata } from "next";
import { ContentListItem } from "@/components/content/content-list-item";
import { ContentMeta } from "@/components/content/content-meta";
import { DomainIndexEmpty } from "@/components/content/domain-index-empty";
import { getAllTags, getTagDomainsMap, tagPathSegment } from "@/lib/content/tags";
import type { ContentType } from "@/lib/content/types";
import {
  buildSimplePageMetadata,
  contentSectionLabel,
} from "@/lib/seo/build-metadata";
import { sectionLabelClassName } from "@/lib/ui/terminal-tokens";

const DOMAIN_ORDER: ContentType[] = ["writing", "project", "work", "lab"];

function formatDomains(set: Set<ContentType>): string {
  return [...set]
    .sort((a, b) => DOMAIN_ORDER.indexOf(a) - DOMAIN_ORDER.indexOf(b))
    .map((t) => contentSectionLabel[t])
    .join(" · ");
}

export const metadata: Metadata = buildSimplePageMetadata({
  pathname: "/tags",
  title: "Tags",
  description: "Browse content by tag across projects, work, writing, and labs.",
});

export default function TagsPage() {
  const tags = getAllTags();
  const domains = getTagDomainsMap();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <header className="max-w-3xl">
        <p className={sectionLabelClassName}>CONTENT TAXONOMY</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Tags
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-black/60">
          Browse by topic across projects, work, writing, and labs.
        </p>
      </header>

      {tags.length === 0 ? (
        <DomainIndexEmpty noun="tags" href="/tags" />
      ) : (
        <div className="mt-12 max-w-3xl border-t border-black/8">
          {tags.map((tag) => {
            const domainSet = domains.get(tag);
            const hint = domainSet ? formatDomains(domainSet) : "";
            return (
              <ContentListItem
                key={tag}
                variant="list"
                href={`/tags/${tagPathSegment(tag)}`}
                title={`#${tag}`}
                summary={hint || undefined}
                meta={<ContentMeta items={[{ label: "Tag", type: "text" }]} />}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}

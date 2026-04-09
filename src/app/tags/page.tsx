import type { Metadata } from "next";
import { ContentListItem } from "@/components/content/content-list-item";
import { ContentMeta } from "@/components/content/content-meta";
import { DomainIndexEmpty } from "@/components/content/domain-index-empty";
import { buildTagIndex } from "@/lib/content-intelligence/tag-grouping";
import { getAllContent } from "@/lib/content-source/get-all-content";
import { tagPathSegment } from "@/lib/content/tags";
import {
  buildSimplePageMetadata,
  contentSectionLabel,
} from "@/lib/seo/build-metadata";
import { sectionLabelClassName } from "@/lib/ui/terminal-tokens";

function formatDomains(domainCounts: Partial<Record<"project" | "work" | "writing" | "lab", number>>): string {
  return (["writing", "project", "work", "lab"] as const)
    .filter((type) => (domainCounts[type] ?? 0) > 0)
    .map((type) => `${contentSectionLabel[type]} (${domainCounts[type]})`)
    .join(" · ");
}

export const metadata: Metadata = buildSimplePageMetadata({
  pathname: "/tags",
  title: "Tags",
  description: "Browse content by tag across projects, work, writing, and labs.",
});

export default async function TagsPage() {
  const content = await getAllContent();
  const tags = buildTagIndex({
    writing: content.writing,
    projects: content.projects,
    work: content.work,
    labs: content.labs,
  });

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
          {tags.map((entry) => {
            const hint = formatDomains(entry.domains);
            const count = entry.totalCount;
            return (
              <ContentListItem
                key={entry.tag}
                variant="list"
                href={`/tags/${tagPathSegment(entry.tag)}`}
                title={`#${entry.displayTag}`}
                summary={hint || undefined}
                meta={
                  <ContentMeta
                    items={[{ label: `${count} ${count === 1 ? "item" : "items"}`, type: "text" }]}
                  />
                }
              />
            );
          })}
        </div>
      )}
    </main>
  );
}

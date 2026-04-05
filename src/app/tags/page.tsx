import type { Metadata } from "next";
import Link from "next/link";
import { getAllTags, getTagDomainsMap, tagPathSegment } from "@/lib/content/tags";
import type { ContentType } from "@/lib/content/types";
import { contentSectionLabel } from "@/lib/seo/build-metadata";

const DOMAIN_ORDER: ContentType[] = ["writing", "project", "work", "lab"];

function formatDomains(set: Set<ContentType>): string {
  return [...set]
    .sort((a, b) => DOMAIN_ORDER.indexOf(a) - DOMAIN_ORDER.indexOf(b))
    .map((t) => contentSectionLabel[t])
    .join(" · ");
}

export const metadata: Metadata = {
  title: "Tags",
  description: "Browse content by tag.",
};

export default function TagsPage() {
  const tags = getAllTags();
  const domains = getTagDomainsMap();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">Tags</h1>
        <p className="mt-4 text-lg leading-relaxed text-black/75">
          Browse by topic across projects, work, writing, and labs.
        </p>
      </header>

      {tags.length === 0 ? (
        <p className="mt-12 max-w-3xl text-base text-black/60">
          No tags yet. Add a <code className="text-sm">tags</code> list to your
          content frontmatter.
        </p>
      ) : (
        <ul className="mt-12 max-w-3xl space-y-8 border-t border-black/10 pt-10">
          {tags.map((tag) => {
            const domainSet = domains.get(tag);
            const hint = domainSet ? formatDomains(domainSet) : "";
            return (
              <li key={tag}>
                <Link
                  href={`/tags/${tagPathSegment(tag)}`}
                  className="text-xl font-medium tracking-tight text-foreground underline decoration-black/20 underline-offset-4 hover:decoration-black/45"
                >
                  #{tag}
                </Link>
                {hint ? (
                  <p className="mt-1 text-sm text-black/45">{hint}</p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}

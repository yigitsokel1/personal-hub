import type { Metadata } from "next";
import Link from "next/link";
import { ContentListItem } from "@/components/content/content-list-item";
import { ContentMeta } from "@/components/content/content-meta";
import { DomainIndexEmpty } from "@/components/content/domain-index-empty";
import { CONTENT_PATH_PREFIX } from "@/lib/content/config";
import { rankSearchDocuments } from "@/lib/content-intelligence/search-ranking";
import { getAllContent } from "@/lib/content-source/get-all-content";
import { buildSearchDocuments } from "@/lib/search/search-documents";
import { contentSectionLabel } from "@/lib/seo/build-metadata";
import { contentInlineLinkClassName } from "@/lib/ui/link-tokens";
import { sectionLabelClassName } from "@/lib/ui/terminal-tokens";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export const metadata: Metadata = {
  title: "Search",
  description: "Search across projects, work, writing, and labs.",
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const content = await getAllContent();
  const docs = buildSearchDocuments([
    ...content.writing,
    ...content.projects,
    ...content.work,
    ...content.labs,
  ]);
  const results = query ? rankSearchDocuments(docs, query) : [];

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <header className="max-w-3xl">
        <p className={sectionLabelClassName}>DISCOVERY</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Search
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-black/60">
          Find content by title, tags, and summary context.
        </p>
      </header>

      <form action="/search" className="mt-8 max-w-3xl">
        <label htmlFor="q" className="font-mono text-xs uppercase tracking-wide text-black/50">
          Query
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="q"
            name="q"
            defaultValue={query}
            placeholder="system design, prisma, product engineering..."
            className="w-full border border-black/15 px-3 py-2 text-sm outline-none transition-colors focus:border-black/35"
          />
          <button
            type="submit"
            className="border border-black/20 px-4 py-2 text-sm transition-colors hover:border-black/40"
          >
            Search
          </button>
        </div>
      </form>

      {!query ? (
        <div className="mt-10 max-w-3xl text-sm text-black/55">Enter a query to start searching.</div>
      ) : results.length === 0 ? (
        <div className="mt-10">
          <DomainIndexEmpty noun="results" href="/search" />
        </div>
      ) : (
        <div className="mt-10 max-w-3xl border-t border-black/8">
          {results.map(({ document }) => (
            <ContentListItem
              key={document.id}
              variant="list"
              href={`${CONTENT_PATH_PREFIX[document.domain]}/${document.slug}`}
              title={document.title}
              summary={document.summary}
              meta={
                <ContentMeta
                  items={[
                    { label: contentSectionLabel[document.domain], type: "text" },
                    ...(document.tags.length > 0
                      ? [{ label: `#${document.tags[0]}`, type: "text" as const }]
                      : []),
                  ]}
                />
              }
            />
          ))}
        </div>
      )}

      <p className="mt-8 text-sm text-black/55">
        <Link href="/tags" className={contentInlineLinkClassName}>
          Browse all tags
        </Link>
      </p>
    </main>
  );
}

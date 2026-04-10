import type { Metadata } from "next";
import Link from "next/link";
import { ContentListItem } from "@/components/content/content-list-item";
import { ContentMeta } from "@/components/content/content-meta";
import { CONTENT_PATH_PREFIX } from "@/lib/content/config";
import { rankSearchDocuments } from "@/lib/content-intelligence/search-ranking";
import { getAllContent } from "@/lib/content-source/get-all-content";
import { buildSearchDocuments } from "@/lib/search/search-documents";
import {
  buildSimplePageMetadata,
  contentSectionLabel,
} from "@/lib/seo/build-metadata";
import { contentInlineLinkClassName } from "@/lib/ui/link-tokens";
import { sectionLabelClassName } from "@/lib/ui/terminal-tokens";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

function normalizeSearchQuery(value: string): string {
  return value.trim().replace(/\s+/g, " ").slice(0, 120);
}

function isSearchQueryInvalid(query: string): boolean {
  return query.length > 0 && !/[a-z0-9]/i.test(query);
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q = "" } = await searchParams;
  const query = normalizeSearchQuery(q);

  if (!query) {
    return {
      ...buildSimplePageMetadata({
        pathname: "/search",
        title: "Search",
        description: "Search across projects, work, writing, and labs.",
      }),
      robots: { index: false, follow: true },
    };
  }

  if (isSearchQueryInvalid(query)) {
    return {
      ...buildSimplePageMetadata({
        pathname: "/search",
        title: "Search",
        description: "Search query includes unsupported characters. Use letters or numbers.",
      }),
      robots: { index: false, follow: true },
    };
  }

  return {
    ...buildSimplePageMetadata({
      pathname: "/search",
      title: `Search: ${query}`,
      description: `Search results for "${query}" across projects, work, writing, and labs.`,
    }),
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = normalizeSearchQuery(q);
  const queryInvalid = isSearchQueryInvalid(query);
  const shouldSearch = query.length > 0 && !queryInvalid;
  const content = shouldSearch ? await getAllContent() : null;
  const results = shouldSearch
    ? rankSearchDocuments(
        buildSearchDocuments([
          ...(content?.writing ?? []),
          ...(content?.projects ?? []),
          ...(content?.work ?? []),
          ...(content?.labs ?? []),
        ]),
        query
      )
    : [];
  const resultCountLabel = `${results.length} ${results.length === 1 ? "result" : "results"}`;

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-22 lg:py-24">
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
        <section className="mt-10 max-w-3xl space-y-3 border-t border-black/8 pt-8">
          <p className="text-base leading-relaxed text-black/62">
            Start with a keyword, domain, or topic.
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-black/45">
            Try: architecture, case study, product thinking
          </p>
          <p>
            <Link href="/tags" className={contentInlineLinkClassName}>
              Browse tags
            </Link>
          </p>
        </section>
      ) : queryInvalid ? (
        <section className="mt-10 max-w-3xl space-y-4 border-t border-black/8 pt-8">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-black/45">
            Query
          </p>
          <p className="text-lg tracking-tight">
            Search query is invalid.
          </p>
          <p className="text-sm leading-relaxed text-black/60">
            Use letters or numbers and try again.
          </p>
        </section>
      ) : results.length === 0 ? (
        <section className="mt-10 max-w-3xl space-y-4 border-t border-black/8 pt-8">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-black/45">
            Query
          </p>
          <p className="text-lg tracking-tight">
            No results for <span className="font-medium">“{query}”</span>.
          </p>
          <p className="text-sm leading-relaxed text-black/60">
            Try a broader keyword, remove punctuation, or search by tag/topic.
          </p>
          <p>
            <Link href="/tags" className={contentInlineLinkClassName}>
              Browse tags
            </Link>
          </p>
        </section>
      ) : (
        <div className="mt-10 max-w-3xl">
          <div className="space-y-1.5 border-t border-black/8 pb-5 pt-6">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-black/45">
              Query
            </p>
            <p className="text-base leading-relaxed text-black/72">
              Showing {resultCountLabel} for <span className="font-medium">“{query}”</span>
            </p>
          </div>
          <div className="border-t border-black/8">
            {results.map(({ document }) => (
              <ContentListItem
                key={document.id}
                variant="list"
                href={`${CONTENT_PATH_PREFIX[document.domain]}/${document.slug}`}
                title={document.title}
                summary={document.summary}
                tags={document.tags}
                meta={
                  <ContentMeta
                    items={[
                      { label: `DOMAIN ${contentSectionLabel[document.domain].toUpperCase()}`, type: "text" },
                      ...(document.tags.length > 0
                        ? [{ label: `#${document.tags[0]}`, type: "text" as const }]
                        : []),
                    ]}
                  />
                }
              />
            ))}
          </div>
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

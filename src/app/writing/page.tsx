import type { Metadata } from "next";
import Link from "next/link";
import { DomainIndexEmpty } from "@/components/content/domain-index-empty";
import { SectionReveal } from "@/components/ui/section-reveal";
import { domainIndexCopy } from "@/lib/content/domain-index-copy";
import { getPublishedContent, getFeaturedContent } from "@/lib/content/get-content";
import { linkFocusVisibleClassName } from "@/lib/ui/link-tokens";
import { formatContentDate } from "@/lib/format-content-date";
import { buildSimplePageMetadata } from "@/lib/seo/build-metadata";
import { sectionLabelClassName } from "@/lib/ui/terminal-tokens";

export const metadata: Metadata = buildSimplePageMetadata({
  pathname: "/writing",
  title: "Writing",
  description:
    "Longer-form technical and product writing—architecture, delivery, and judgment.",
});

export default function WritingPage() {
  const allWriting = getPublishedContent("writing");
  const featuredWriting = getFeaturedContent("writing");
  const featured = featuredWriting.length > 0 ? featuredWriting.slice(0, 2) : allWriting.slice(0, 2);
  const featuredIds = new Set(featured.map((f) => f.id));
  const rest = allWriting.filter((item) => !featuredIds.has(item.id));

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <SectionReveal>
        <p className={sectionLabelClassName}>{domainIndexCopy.writing.sectionLabel}</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          {domainIndexCopy.writing.title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-black/60">
          {domainIndexCopy.writing.lead}
        </p>
        <p className="mt-2 text-sm text-black/45">
          {domainIndexCopy.writing.tagsLinePrefix}{" "}
          <Link
            href="/tags"
            className={`font-mono text-sm text-black/45 underline decoration-black/15 underline-offset-4 transition-colors duration-200 hover:text-black/65 hover:decoration-black/30 ${linkFocusVisibleClassName}`}
          >
            {domainIndexCopy.writing.tagsLinkLabel}
          </Link>
          .
        </p>
      </SectionReveal>

      {allWriting.length === 0 ? (
        <DomainIndexEmpty noun="writing" />
      ) : (
        <>
          {/* Featured */}
          {featured.length > 0 ? (
            <SectionReveal>
              <section className="mt-12">
                <p className={sectionLabelClassName}>{domainIndexCopy.writing.featuredLabel}</p>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {featured.map((item) => {
                    const metaParts: string[] = [
                      formatContentDate(item.publishedAt),
                    ];
                    if (item.readingTime != null)
                      metaParts.push(`${item.readingTime} min read`);

                    return (
                      <Link
                        key={item.id}
                        href={`/writing/${item.slug}`}
                        className="group flex flex-col rounded-xl border border-black/8 p-6 transition-[border-color,box-shadow] duration-200 hover:border-black/15 hover:shadow-sm"
                      >
                        <p className="font-mono text-xs text-black/40">
                          {metaParts.join(" \u00b7 ")}
                        </p>
                        <h2 className="mt-3 text-xl font-semibold leading-snug tracking-tight">
                          {item.title}
                        </h2>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-black/60">
                          {item.summary}
                        </p>
                        {(item.tags ?? []).length > 0 ? (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {(item.tags ?? []).slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md bg-black/4 px-2 py-0.5 text-xs text-black/55"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </section>
            </SectionReveal>
          ) : null}

          {/* All Articles */}
          {rest.length > 0 ? (
            <SectionReveal>
              <section className="mt-12">
                <p className={sectionLabelClassName}>{domainIndexCopy.writing.allArticlesLabel}</p>
                <div className="mt-6 space-y-0 border-t border-black/6">
                  {rest.map((item) => {
                    const metaParts: string[] = [
                      formatContentDate(item.publishedAt),
                    ];
                    if (item.readingTime != null)
                      metaParts.push(`${item.readingTime} min read`);

                    return (
                      <Link
                        key={item.id}
                        href={`/writing/${item.slug}`}
                        className="group block border-b border-black/6 py-5 transition-colors duration-200"
                      >
                        <h2 className="text-lg font-semibold tracking-tight group-hover:text-black/80">
                          {item.title}
                        </h2>
                        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-black/55">
                          {item.summary}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="font-mono text-xs text-black/35">
                            {metaParts.join(" \u00b7 ")}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            </SectionReveal>
          ) : null}
        </>
      )}
    </main>
  );
}

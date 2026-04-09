import type { Metadata } from "next";
import Link from "next/link";
import { ContentListItem } from "@/components/content/content-list-item";
import { ContentMeta } from "@/components/content/content-meta";
import { DomainIndexEmpty } from "@/components/content/domain-index-empty";
import { SectionReveal } from "@/components/ui/section-reveal";
import { domainIndexCopy } from "@/lib/content/domain-index-copy";
import { getPublishedWriting } from "@/lib/content-source/get-writing";
import { shellSecondaryLinkClassName } from "@/lib/ui/link-tokens";
import { formatContentDate } from "@/lib/format-content-date";
import { buildSimplePageMetadata } from "@/lib/seo/build-metadata";
import { sectionLabelClassName } from "@/lib/ui/terminal-tokens";

export const metadata: Metadata = buildSimplePageMetadata({
  pathname: "/writing",
  title: "Writing",
  description:
    "Longer-form technical and product writing—architecture, delivery, and judgment.",
});

export default async function WritingPage() {
  const { value: allWriting } = await getPublishedWriting();
  const featuredWriting = allWriting.filter((item) => item.featured);
  const featured = featuredWriting.length > 0 ? featuredWriting.slice(0, 1) : allWriting.slice(0, 1);
  const featuredIds = new Set(featured.map((f) => f.id));
  const rest = allWriting.filter((item) => !featuredIds.has(item.id));

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <SectionReveal>
        <p className={sectionLabelClassName}>{domainIndexCopy.writing.sectionLabel}</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-[2.8rem]">
          {domainIndexCopy.writing.title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-black/60">
          {domainIndexCopy.writing.lead}
        </p>
        <p className="mt-2 text-sm text-black/45">
          {domainIndexCopy.writing.tagsLinePrefix}{" "}
          <Link
            href="/tags"
            className={shellSecondaryLinkClassName}
          >
            {domainIndexCopy.writing.tagsLinkLabel}
          </Link>
          .
        </p>
      </SectionReveal>

      {allWriting.length === 0 ? (
        <DomainIndexEmpty noun="writing" href="/writing" />
      ) : (
        <>
          {featured.length > 0 ? (
            <SectionReveal>
              <section className="mt-12">
                <p className={sectionLabelClassName}>{domainIndexCopy.writing.featuredLabel}</p>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {featured.map((item) => (
                    <ContentListItem
                      key={item.id}
                      variant="card"
                      featured
                      href={`/writing/${item.slug}`}
                      title={item.title}
                      summary={item.summary}
                      tags={item.tags}
                      meta={
                        <ContentMeta
                          items={[
                            { label: formatContentDate(item.publishedAt), type: "text" },
                            ...(item.readingTime != null
                              ? [{ label: `${item.readingTime} min read`, type: "text" as const }]
                              : []),
                          ]}
                        />
                      }
                    />
                  ))}
                </div>
              </section>
            </SectionReveal>
          ) : null}

          {rest.length > 0 ? (
            <SectionReveal>
              <section className="mt-12">
                <p className={sectionLabelClassName}>{domainIndexCopy.writing.allArticlesLabel}</p>
                <div className="mt-6 border-t border-black/8">
                  {rest.map((item) => (
                    <ContentListItem
                      key={item.id}
                      variant="list"
                      href={`/writing/${item.slug}`}
                      title={item.title}
                      summary={item.summary}
                      tags={item.tags}
                      meta={
                        <ContentMeta
                          items={[
                            { label: formatContentDate(item.publishedAt), type: "text" },
                            ...(item.readingTime != null
                              ? [{ label: `${item.readingTime} min read`, type: "text" as const }]
                              : []),
                          ]}
                        />
                      }
                    />
                  ))}
                </div>
              </section>
            </SectionReveal>
          ) : null}
        </>
      )}
    </main>
  );
}

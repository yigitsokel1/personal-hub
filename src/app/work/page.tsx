import type { Metadata } from "next";
import { ContentListItem } from "@/components/content/content-list-item";
import { ContentMeta } from "@/components/content/content-meta";
import { DomainIndexEmpty } from "@/components/content/domain-index-empty";
import { SectionReveal } from "@/components/ui/section-reveal";
import { domainIndexCopy } from "@/lib/content/domain-index-copy";
import { getFeaturedContent, getPublishedContent } from "@/lib/content/get-content";
import { formatEngagementType } from "@/lib/format-engagement-type";
import { formatContentYear } from "@/lib/format-content-date";
import { buildSimplePageMetadata } from "@/lib/seo/build-metadata";
import { sectionLabelClassName } from "@/lib/ui/terminal-tokens";

export const metadata: Metadata = buildSimplePageMetadata({
  pathname: "/work",
  title: "Work",
  description:
    "Real-world engagements—freelance, contract, and full-time—with scope, role, and impact.",
});

export default function WorkPage() {
  const work = getPublishedContent("work");
  const featuredWork = getFeaturedContent("work");
  const featured = featuredWork.length > 0 ? featuredWork.slice(0, 2) : work.slice(0, 2);
  const featuredIds = new Set(featured.map((item) => item.id));
  const rest = work.filter((item) => !featuredIds.has(item.id));

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <SectionReveal>
        <p className={sectionLabelClassName}>{domainIndexCopy.work.sectionLabel}</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          {domainIndexCopy.work.title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-black/60">
          {domainIndexCopy.work.lead}
        </p>
      </SectionReveal>

      {work.length === 0 ? (
        <DomainIndexEmpty noun="work entries" href="/work" />
      ) : (
        <>
          {featured.length > 0 ? (
            <section className="mt-12 grid gap-6 sm:grid-cols-2">
              {featured.map((item) => (
                <SectionReveal key={item.id}>
                  <ContentListItem
                    variant="card"
                    featured
                    href={`/work/${item.slug}`}
                    title={item.title}
                    summary={item.summary}
                    tags={item.tags}
                    meta={
                      <ContentMeta
                        items={[
                          { label: formatEngagementType(item.engagementType), type: "text" },
                          { label: formatContentYear(item.publishedAt), type: "text" },
                          { label: [item.client, item.role].filter(Boolean).join(" · "), type: "text" },
                        ]}
                      />
                    }
                  />
                </SectionReveal>
              ))}
            </section>
          ) : null}

          {rest.length > 0 ? (
            <section className="mt-8 border-t border-black/8">
              {rest.map((item) => (
                <SectionReveal key={item.id}>
                  <ContentListItem
                    variant="list"
                    href={`/work/${item.slug}`}
                    title={item.title}
                    summary={item.summary}
                    tags={item.tags}
                    meta={
                      <ContentMeta
                        items={[
                          { label: formatEngagementType(item.engagementType), type: "text" },
                          { label: formatContentYear(item.publishedAt), type: "text" },
                          { label: [item.client, item.role].filter(Boolean).join(" · "), type: "text" },
                        ]}
                      />
                    }
                  />
                </SectionReveal>
              ))}
            </section>
          ) : null}
        </>
      )}
    </main>
  );
}

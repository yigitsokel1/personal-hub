import type { Metadata } from "next";
import { ContentListItem } from "@/components/content/content-list-item";
import { ContentMeta } from "@/components/content/content-meta";
import { DomainIndexEmpty } from "@/components/content/domain-index-empty";
import { SectionReveal } from "@/components/ui/section-reveal";
import { domainIndexCopy } from "@/lib/content/domain-index-copy";
import { getPublishedLabs } from "@/lib/content-source/get-labs";
import { formatContentDate } from "@/lib/format-content-date";
import { buildSimplePageMetadata } from "@/lib/seo/build-metadata";

function shortenLabSummary(summary: string): string {
  const firstSentence = summary.split(".")[0]?.trim() ?? summary.trim();
  if (firstSentence.length <= 96) return firstSentence;
  return `${firstSentence.slice(0, 93).trimEnd()}...`;
}

export const metadata: Metadata = buildSimplePageMetadata({
  pathname: "/labs",
  title: "Labs",
  description:
    "Experiments and explorations—tools, hypotheses, and what was learned.",
});

export default async function LabsPage() {
  const { value: labs } = await getPublishedLabs();
  const featuredLabs = labs.filter((item) => item.featured);
  const featured = featuredLabs.length > 0 ? featuredLabs.slice(0, 2) : labs.slice(0, 2);
  const featuredIds = new Set(featured.map((item) => item.id));
  const rest = labs.filter((item) => !featuredIds.has(item.id));

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-22 lg:py-24">
      <SectionReveal>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          {domainIndexCopy.labs.title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-black/58">
          {domainIndexCopy.labs.lead}
        </p>
      </SectionReveal>

      {labs.length === 0 ? (
        <DomainIndexEmpty noun="labs" href="/labs" />
      ) : (
        <>
          {featured.length > 0 ? (
            <section className="mt-12 grid gap-5 sm:grid-cols-2">
              {featured.map((lab) => {
                const dateLabel = lab.updatedAt
                  ? `Updated ${formatContentDate(lab.updatedAt)}`
                  : formatContentDate(lab.publishedAt);

                return (
                  <SectionReveal key={lab.id}>
                    <ContentListItem
                      variant="card"
                      featured
                      href={`/labs/${lab.slug}`}
                      title={lab.title}
                      summary={shortenLabSummary(lab.summary)}
                      tags={lab.tags}
                      meta={
                        <ContentMeta
                          items={[
                            { label: `STATUS ${lab.status.toUpperCase()}`, type: "text" },
                            { label: dateLabel, type: "text" },
                          ]}
                        />
                      }
                    />
                  </SectionReveal>
                );
              })}
            </section>
          ) : null}

          {rest.length > 0 ? (
            <section className="mt-9 border-t border-black/8">
              {rest.map((lab) => {
                const dateLabel = lab.updatedAt
                  ? `Updated ${formatContentDate(lab.updatedAt)}`
                  : formatContentDate(lab.publishedAt);

                return (
                  <SectionReveal key={lab.id}>
                    <ContentListItem
                      variant="list"
                      href={`/labs/${lab.slug}`}
                      title={lab.title}
                      summary={shortenLabSummary(lab.summary)}
                      tags={lab.tags}
                      meta={
                        <ContentMeta
                          items={[
                            { label: `STATUS ${lab.status.toUpperCase()}`, type: "text" },
                            { label: dateLabel, type: "text" },
                          ]}
                        />
                      }
                    />
                  </SectionReveal>
                );
              })}
            </section>
          ) : null}
        </>
      )}
    </main>
  );
}

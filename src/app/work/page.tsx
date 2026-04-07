import type { Metadata } from "next";
import { ContentListItem } from "@/components/content/content-list-item";
import { DomainIndexEmpty } from "@/components/content/domain-index-empty";
import { SectionReveal } from "@/components/ui/section-reveal";
import { domainIndexCopy } from "@/lib/content/domain-index-copy";
import { getPublishedContent } from "@/lib/content/get-content";
import { formatContentDate } from "@/lib/format-content-date";
import { formatEngagementType } from "@/lib/format-engagement-type";
import { buildSimplePageMetadata } from "@/lib/seo/build-metadata";

export const metadata: Metadata = buildSimplePageMetadata({
  pathname: "/work",
  title: "Work",
  description:
    "Real-world engagements—freelance, contract, and full-time—with scope, role, and impact.",
});

export default function WorkPage() {
  const work = getPublishedContent("work");

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <SectionReveal className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">Work</h1>
        <p className="mt-3 text-base leading-relaxed text-black/70">
          {domainIndexCopy.work.lead}
        </p>

        {work.length === 0 ? (
          <DomainIndexEmpty noun="work entries" />
        ) : (
          <div className="mt-10 space-y-9">
            {work.map((item) => (
              <ContentListItem
                key={item.id}
                href={`/work/${item.slug}`}
                publishedAt={formatContentDate(item.publishedAt)}
                title={item.title}
                summary={item.summary}
                tags={item.tags}
                meta={[
                  item.client,
                  formatEngagementType(item.engagementType),
                  item.role,
                ]}
              />
            ))}
          </div>
        )}
      </SectionReveal>
    </main>
  );
}

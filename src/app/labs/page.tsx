import type { Metadata } from "next";
import { ContentListItem } from "@/components/content/content-list-item";
import { DomainIndexEmpty } from "@/components/content/domain-index-empty";
import { domainIndexCopy } from "@/lib/content/domain-index-copy";
import { getPublishedContent } from "@/lib/content/get-content";
import { formatContentDate } from "@/lib/format-content-date";
import { buildSimplePageMetadata } from "@/lib/seo/build-metadata";

export const metadata: Metadata = buildSimplePageMetadata({
  pathname: "/labs",
  title: "Labs",
  description:
    "Experiments and explorations—tools, hypotheses, and what was learned.",
});

export default function LabsPage() {
  const labs = getPublishedContent("lab");

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">Labs</h1>
        <p className="mt-3 text-base leading-relaxed text-black/70">
          {domainIndexCopy.labs.lead}
        </p>

        {labs.length === 0 ? (
          <DomainIndexEmpty noun="labs" />
        ) : (
          <div className="mt-10 space-y-9">
            {labs.map((lab) => {
              const meta = [
                lab.experimentType,
                lab.maturityLevel
                  ? lab.maturityLevel.toUpperCase()
                  : undefined,
              ].filter((item): item is string => Boolean(item));
              return (
                <ContentListItem
                  key={lab.id}
                  href={`/labs/${lab.slug}`}
                  publishedAt={formatContentDate(lab.publishedAt)}
                  title={lab.title}
                  summary={lab.summary}
                  tags={lab.tags}
                  meta={meta.length ? meta : undefined}
                />
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

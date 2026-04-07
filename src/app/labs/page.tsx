import type { Metadata } from "next";
import Link from "next/link";
import { DomainIndexEmpty } from "@/components/content/domain-index-empty";
import { SectionReveal } from "@/components/ui/section-reveal";
import { domainIndexCopy } from "@/lib/content/domain-index-copy";
import { getPublishedContent } from "@/lib/content/get-content";
import { formatContentDate } from "@/lib/format-content-date";
import { buildSimplePageMetadata } from "@/lib/seo/build-metadata";
import { sectionLabelClassName } from "@/lib/ui/terminal-tokens";

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
      <SectionReveal>
        <p className={sectionLabelClassName}>{domainIndexCopy.labs.sectionLabel}</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          {domainIndexCopy.labs.title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-black/60">
          {domainIndexCopy.labs.lead}
        </p>
      </SectionReveal>

      {labs.length === 0 ? (
        <DomainIndexEmpty noun="labs" />
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {labs.map((lab) => {
            const statusLabel =
              lab.maturityLevel === "poc"
                ? domainIndexCopy.labs.statusLabelPoc
                : lab.maturityLevel === "idea"
                  ? domainIndexCopy.labs.statusLabelIdea
                  : domainIndexCopy.labs.statusLabelActive;

            const dateLabel = lab.updatedAt
              ? `Updated ${formatContentDate(lab.updatedAt)}`
              : formatContentDate(lab.publishedAt);

            const firstTag = lab.tags?.[0];
            const categoryLabel = lab.experimentType
              ? lab.experimentType.toUpperCase()
              : firstTag
                ? firstTag.toUpperCase()
                : null;

            const findings = lab.learnings ?? [];

            return (
              <SectionReveal key={lab.id}>
                <Link
                  href={`/labs/${lab.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-black/8 p-6 transition-[border-color,box-shadow] duration-200 hover:border-black/15 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-block rounded-full bg-black/4 px-2.5 py-0.5 font-mono text-xs font-medium uppercase tracking-[0.08em] text-black/55">
                      {statusLabel}
                    </span>
                    <span className="font-mono text-xs text-black/35">
                      {dateLabel}
                    </span>
                  </div>

                  {categoryLabel ? (
                    <p className="mt-3 font-mono text-xs uppercase tracking-wider text-black/40">
                      {categoryLabel}
                    </p>
                  ) : null}

                  <h2 className="mt-2 text-xl font-semibold tracking-tight">
                    {lab.title}
                  </h2>

                  <p className="mt-2 flex-1 text-sm leading-relaxed text-black/60">
                    {lab.summary}
                  </p>

                  {findings.length > 0 ? (
                    <div className="mt-4 border-l-2 border-black/15 pl-3">
                      <p className="font-mono text-xs font-medium text-black/50">
                        {domainIndexCopy.labs.findingsLabel}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-black/55">
                        {findings.slice(0, 2).join(" ")}
                      </p>
                    </div>
                  ) : null}
                </Link>
              </SectionReveal>
            );
          })}
        </div>
      )}
    </main>
  );
}

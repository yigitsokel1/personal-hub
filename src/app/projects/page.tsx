import type { Metadata } from "next";
import Link from "next/link";
import { DomainIndexEmpty } from "@/components/content/domain-index-empty";
import { SectionReveal } from "@/components/ui/section-reveal";
import { domainIndexCopy } from "@/lib/content/domain-index-copy";
import { getPublishedContent } from "@/lib/content/get-content";
import { formatContentYear } from "@/lib/format-content-date";
import { buildSimplePageMetadata } from "@/lib/seo/build-metadata";
import { sectionLabelClassName, ARROW } from "@/lib/ui/terminal-tokens";

export const metadata: Metadata = buildSimplePageMetadata({
  pathname: "/projects",
  title: "Projects",
  description:
    "Productized systems and technical case studies—architecture, decisions, and outcomes.",
});

export default function ProjectsPage() {
  const projects = getPublishedContent("project");

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <SectionReveal>
        <p className={sectionLabelClassName}>{domainIndexCopy.projects.sectionLabel}</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          {domainIndexCopy.projects.title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-black/60">
          {domainIndexCopy.projects.lead}
        </p>
      </SectionReveal>

      {projects.length === 0 ? (
        <DomainIndexEmpty noun="projects" />
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {projects.map((project) => {
            const year = formatContentYear(project.publishedAt);

            return (
              <SectionReveal key={project.id}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-black/8 transition-[border-color,box-shadow] duration-200 hover:border-black/15 hover:shadow-sm"
                >
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between">
                      <span className="inline-block rounded-full bg-black/5 px-2.5 py-0.5 font-mono text-xs text-black/50">
                        {domainIndexCopy.projects.cardStatusLabel}
                      </span>
                      <span className="font-mono text-sm text-black/35">
                        {year}
                      </span>
                    </div>

                    <h2 className="mt-4 text-xl font-semibold tracking-tight">
                      {project.title}
                    </h2>

                    <p className="mt-2 flex-1 text-sm leading-relaxed text-black/60">
                      {project.summary}
                    </p>

                    {(project.tags ?? []).length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {(project.tags ?? []).slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-black/4 px-2 py-0.5 text-xs text-black/55"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <p className="mt-4 font-mono text-xs text-black/40 transition-colors duration-200 group-hover:text-black/60">
                      {domainIndexCopy.projects.cardCtaLabel} {ARROW}
                    </p>
                  </div>
                </Link>
              </SectionReveal>
            );
          })}
        </div>
      )}
    </main>
  );
}

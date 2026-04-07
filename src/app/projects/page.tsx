import type { Metadata } from "next";
import { ContentListItem } from "@/components/content/content-list-item";
import { DomainIndexEmpty } from "@/components/content/domain-index-empty";
import { SectionReveal } from "@/components/ui/section-reveal";
import { domainIndexCopy } from "@/lib/content/domain-index-copy";
import { getPublishedContent } from "@/lib/content/get-content";
import { formatContentDate } from "@/lib/format-content-date";
import { buildSimplePageMetadata } from "@/lib/seo/build-metadata";

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
      <SectionReveal className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">Projects</h1>
        <p className="mt-3 text-base leading-relaxed text-black/70">
          {domainIndexCopy.projects.lead}
        </p>

        {projects.length === 0 ? (
          <DomainIndexEmpty noun="projects" />
        ) : (
          <div className="mt-10 space-y-9">
            {projects.map((project) => (
              <ContentListItem
                key={project.id}
                href={`/projects/${project.slug}`}
                publishedAt={formatContentDate(project.publishedAt)}
                title={project.title}
                summary={project.summary}
                tags={project.tags}
                meta={[
                  project.role,
                  project.stack.slice(0, 3).join(", "),
                ].filter(Boolean)}
              />
            ))}
          </div>
        )}
      </SectionReveal>
    </main>
  );
}

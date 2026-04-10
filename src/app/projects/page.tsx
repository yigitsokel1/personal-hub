import type { Metadata } from "next";
import { ContentListItem } from "@/components/content/content-list-item";
import { ContentMeta } from "@/components/content/content-meta";
import { DomainIndexEmpty } from "@/components/content/domain-index-empty";
import { SectionReveal } from "@/components/ui/section-reveal";
import { domainIndexCopy } from "@/lib/content/domain-index-copy";
import { getPublishedProjects } from "@/lib/content-source/get-projects";
import { formatContentYear } from "@/lib/format-content-date";
import { buildSimplePageMetadata } from "@/lib/seo/build-metadata";

export const metadata: Metadata = buildSimplePageMetadata({
  pathname: "/projects",
  title: "Projects",
  description:
    "Productized systems and technical case studies—architecture, decisions, and outcomes.",
});

export default async function ProjectsPage() {
  const { value: projects } = await getPublishedProjects();
  const featuredProjects = projects.filter((item) => item.featured);
  const featured =
    featuredProjects.length > 0 ? featuredProjects.slice(0, 2) : projects.slice(0, 2);
  const featuredIds = new Set(featured.map((item) => item.id));
  const rest = projects.filter((item) => !featuredIds.has(item.id));

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-22 lg:py-24">
      <SectionReveal>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          {domainIndexCopy.projects.title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-black/60">
          {domainIndexCopy.projects.lead}
        </p>
      </SectionReveal>

      {projects.length === 0 ? (
        <DomainIndexEmpty noun="projects" href="/projects" />
      ) : (
        <>
          {featured.length > 0 ? (
            <section className="mt-12 grid gap-6 sm:grid-cols-2">
              {featured.map((project) => (
                <SectionReveal key={project.id}>
                  <ContentListItem
                    variant="card"
                    featured
                    href={`/projects/${project.slug}`}
                    title={project.title}
                    summary={project.summary}
                    tags={project.tags}
                    meta={
                      <ContentMeta
                        items={[
                          { label: domainIndexCopy.projects.cardStatusLabel, type: "text" },
                          { label: formatContentYear(project.publishedAt), type: "text" },
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
              {rest.map((project) => (
                <SectionReveal key={project.id}>
                  <ContentListItem
                    variant="list"
                    href={`/projects/${project.slug}`}
                    title={project.title}
                    summary={project.summary}
                    tags={project.tags}
                    meta={
                      <ContentMeta
                        items={[
                          { label: domainIndexCopy.projects.cardStatusLabel, type: "text" },
                          { label: formatContentYear(project.publishedAt), type: "text" },
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

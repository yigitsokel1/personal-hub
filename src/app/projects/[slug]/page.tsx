import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentBody } from "@/components/content/content-body";
import { ContentDetailMain } from "@/components/content/content-detail-main";
import { ProjectDetailIntro } from "@/components/content/project-detail-intro";
import { RelatedContentLinks } from "@/components/content/related-content-links";
import { CONTENT_PATH_PREFIX } from "@/lib/content/config";
import {
  getProjectBySlug,
  getPublishedProjects,
  getRelatedProjects,
} from "@/lib/content-source/get-projects";
import {
  buildContentDetailMetadata,
  contentSectionLabel,
} from "@/lib/seo/build-metadata";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { value } = await getPublishedProjects();
  return value.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  return buildContentDetailMetadata({
    pathname: `/projects/${slug}`,
    sectionLabel: contentSectionLabel.project,
    contentTitle: project.title,
    summary: project.summary,
    seo: project.seo,
    cover: project.cover,
    openGraphType: "website",
  });
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const related = await getRelatedProjects(slug, project.tags);
  const relatedLinks = related.map((r) => ({
    href: `${CONTENT_PATH_PREFIX.project}/${r.slug}`,
    title: r.title,
  }));
  const architectureHighlights = project.architectureHighlights?.filter(Boolean) ?? [];
  const outcomes = project.outcomes?.filter(Boolean) ?? [];
  const showHighlights = architectureHighlights.length >= 2 || outcomes.length >= 2;

  return (
    <ContentDetailMain>
      <ProjectDetailIntro
        title={project.title}
        summary={project.summary}
        publishedAt={project.publishedAt}
        timeline={project.timeline}
        tags={project.tags}
        role={project.role}
        stack={project.stack}
        liveUrl={project.liveUrl}
        repoUrl={project.repoUrl}
        cover={project.cover}
      />

      {showHighlights ? (
        <section className="mt-10 max-w-3xl border-l border-black/10 pl-4 sm:mt-12 sm:pl-5">
          <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-black/50">
            Architecture highlights
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-black/75">
            {architectureHighlights.length ? (
              <p>{architectureHighlights.slice(0, 3).join(" ")}</p>
            ) : null}
            {outcomes.length ? (
              <p>{outcomes.slice(0, 3).join(" ")}</p>
            ) : null}
          </div>
        </section>
      ) : null}

      <ContentBody body={project.body} context={{ domain: "projects", slug: project.slug }} />

      <RelatedContentLinks
        heading="Related projects"
        items={relatedLinks}
        emptyMessage="No other projects share these tags yet."
        sectionHref="/projects"
        sectionLinkLabel="Browse all projects"
      />
    </ContentDetailMain>
  );
}

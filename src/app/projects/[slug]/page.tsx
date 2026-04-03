import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentBody } from "@/components/content/content-body";
import { ProjectDetailIntro } from "@/components/content/project-detail-intro";
import { getAllContent, getContentBySlug } from "@/lib/content/get-content";
import {
  buildContentDetailMetadata,
  contentSectionLabel,
} from "@/lib/seo/build-metadata";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllContent("project").map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getContentBySlug("project", slug);
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
  const project = getContentBySlug("project", slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
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
      />

      <ContentBody body={project.body} />
    </main>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentBody } from "@/components/content/content-body";
import { ContentPageIntro } from "@/components/content/content-page-intro";
import { getAllContent, getContentBySlug } from "@/lib/content/get-content";

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

  return {
    title: project.seo?.title ?? `${project.title} — Projects`,
    description: project.seo?.description ?? project.summary,
  };
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
      <ContentPageIntro
        title={project.title}
        summary={project.summary}
        publishedAt={project.publishedAt}
        tags={project.tags}
      />

      <ContentBody body={project.body} />
    </main>
  );
}

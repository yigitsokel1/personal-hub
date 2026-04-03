import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentBody } from "@/components/content/content-body";
import { WorkDetailIntro } from "@/components/content/work-detail-intro";
import { getAllContent, getContentBySlug } from "@/lib/content/get-content";
import {
  buildContentDetailMetadata,
  contentSectionLabel,
} from "@/lib/seo/build-metadata";

type WorkDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllContent("work").map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: WorkDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getContentBySlug("work", slug);
  if (!item) return {};

  return buildContentDetailMetadata({
    pathname: `/work/${slug}`,
    sectionLabel: contentSectionLabel.work,
    contentTitle: item.title,
    summary: item.summary,
    seo: item.seo,
    cover: item.cover,
    openGraphType: "website",
  });
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { slug } = await params;
  const item = getContentBySlug("work", slug);

  if (!item) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <WorkDetailIntro
        title={item.title}
        summary={item.summary}
        publishedAt={item.publishedAt}
        timeline={item.timeline}
        tags={item.tags}
        role={item.role}
        client={item.client}
        engagementType={item.engagementType}
      />

      <ContentBody body={item.body} />
    </main>
  );
}

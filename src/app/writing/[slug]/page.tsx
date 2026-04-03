import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentBody } from "@/components/content/content-body";
import { ContentPageIntro } from "@/components/content/content-page-intro";
import { getAllContent, getContentBySlug } from "@/lib/content/get-content";
import {
  buildContentDetailMetadata,
  contentSectionLabel,
} from "@/lib/seo/build-metadata";

type WritingDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllContent("writing").map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: WritingDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getContentBySlug("writing", slug);
  if (!item) return {};

  return buildContentDetailMetadata({
    pathname: `/writing/${slug}`,
    sectionLabel: contentSectionLabel.writing,
    contentTitle: item.title,
    summary: item.summary,
    seo: item.seo,
    cover: item.cover,
    openGraphType: "article",
  });
}

export default async function WritingDetailPage({
  params,
}: WritingDetailPageProps) {
  const { slug } = await params;
  const item = getContentBySlug("writing", slug);

  if (!item) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <ContentPageIntro
        title={item.title}
        summary={item.summary}
        publishedAt={item.publishedAt}
        tags={item.tags}
      />

      <ContentBody body={item.body} />
    </main>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentBody } from "@/components/content/content-body";
import { ContentDetailMain } from "@/components/content/content-detail-main";
import { LabDetailIntro } from "@/components/content/lab-detail-intro";
import { getContentBySlug, getPublishedContent } from "@/lib/content/get-content";
import {
  buildContentDetailMetadata,
  contentSectionLabel,
} from "@/lib/seo/build-metadata";

type LabDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPublishedContent("lab").map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: LabDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getContentBySlug("lab", slug);
  if (!item) return {};

  return buildContentDetailMetadata({
    pathname: `/labs/${slug}`,
    sectionLabel: contentSectionLabel.lab,
    contentTitle: item.title,
    summary: item.summary,
    seo: item.seo,
    cover: item.cover,
    openGraphType: "website",
  });
}

export default async function LabDetailPage({ params }: LabDetailPageProps) {
  const { slug } = await params;
  const item = getContentBySlug("lab", slug);

  if (!item) {
    notFound();
  }

  return (
    <ContentDetailMain>
      <LabDetailIntro
        title={item.title}
        summary={item.summary}
        publishedAt={item.publishedAt}
        tags={item.tags}
        cover={item.cover}
        experimentType={item.experimentType}
        maturityLevel={item.maturityLevel}
        tools={item.tools}
        hypothesis={item.hypothesis}
      />

      <p className="mt-8 max-w-3xl text-sm leading-relaxed text-black/55 sm:mt-10">
        Exploration note: this page captures an active experiment, so outcomes may
        be partial while the direction evolves.
      </p>

      <ContentBody body={item.body} />
    </ContentDetailMain>
  );
}

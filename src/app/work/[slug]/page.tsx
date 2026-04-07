import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentBody } from "@/components/content/content-body";
import { ContentDetailMain } from "@/components/content/content-detail-main";
import { RelatedContentLinks } from "@/components/content/related-content-links";
import { WorkDetailIntro } from "@/components/content/work-detail-intro";
import { CONTENT_PATH_PREFIX } from "@/lib/content/config";
import { getContentBySlug, getPublishedContent } from "@/lib/content/get-content";
import { getRelatedInDomain } from "@/lib/content/related";
import {
  buildContentDetailMetadata,
  contentSectionLabel,
} from "@/lib/seo/build-metadata";

type WorkDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPublishedContent("work").map((item) => ({
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

  const related = getRelatedInDomain("work", slug, item.tags);
  const relatedLinks = related.map((r) => ({
    href: `${CONTENT_PATH_PREFIX.work}/${r.slug}`,
    title: r.title,
  }));

  return (
    <ContentDetailMain>
      <WorkDetailIntro
        title={item.title}
        summary={item.summary}
        publishedAt={item.publishedAt}
        timeline={item.timeline}
        tags={item.tags}
        role={item.role}
        client={item.client}
        engagementType={item.engagementType}
        confidentialityLevel={item.confidentialityLevel}
        scope={item.scope}
        impact={item.impact}
        cover={item.cover}
      />

      <ContentBody body={item.body} />

      <RelatedContentLinks
        heading="Related work"
        items={relatedLinks}
        emptyMessage="No other work shares these tags yet."
        sectionHref="/work"
        sectionLinkLabel="Browse all work"
      />
    </ContentDetailMain>
  );
}

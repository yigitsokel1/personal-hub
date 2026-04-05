import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentBody } from "@/components/content/content-body";
import { ContentDetailMain } from "@/components/content/content-detail-main";
import { ContentPageIntro } from "@/components/content/content-page-intro";
import { RelatedContentLinks } from "@/components/content/related-content-links";
import { WritingPrevNext } from "@/components/content/writing-prev-next";
import { CONTENT_PATH_PREFIX } from "@/lib/content/config";
import { getContentBySlug, getPublishedContent } from "@/lib/content/get-content";
import { getRelatedInDomain } from "@/lib/content/related";
import { getWritingNeighbors } from "@/lib/content/writing-neighbors";
import {
  buildContentDetailMetadata,
  contentSectionLabel,
} from "@/lib/seo/build-metadata";
import { buildArticleJsonLd } from "@/lib/seo/json-ld";

type WritingDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPublishedContent("writing").map((item) => ({
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

  const articleLd = buildArticleJsonLd(item);
  const related = getRelatedInDomain("writing", slug, item.tags);
  const relatedLinks = related.map((r) => ({
    href: `${CONTENT_PATH_PREFIX.writing}/${r.slug}`,
    title: r.title,
  }));
  const neighbors = getWritingNeighbors(slug);

  return (
    <>
      {articleLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
        />
      ) : null}
      <ContentDetailMain>
        <ContentPageIntro
          title={item.title}
          summary={item.summary}
          publishedAt={item.publishedAt}
          category={item.category}
          readingTime={item.readingTime}
          tags={item.tags}
          cover={item.cover}
        />

        <ContentBody body={item.body} />

        <RelatedContentLinks
          heading="Related writing"
          items={relatedLinks}
          emptyMessage="No other writing shares these tags yet."
          sectionHref="/writing"
          sectionLinkLabel="Browse all writing"
        />

        <WritingPrevNext prev={neighbors.prev} next={neighbors.next} />
      </ContentDetailMain>
    </>
  );
}

import type { Metadata } from "next";
import { cache } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import { ContentBody } from "@/components/content/content-body";
import { ContentDetailMain } from "@/components/content/content-detail-main";
import { ContentPageIntro } from "@/components/content/content-page-intro";
import { RelatedContentLinks } from "@/components/content/related-content-links";
import { WritingPrevNext } from "@/components/content/writing-prev-next";
import { CONTENT_PATH_PREFIX } from "@/lib/content/config";
import { resolveSlugRedirect } from "@/lib/content-source/slug-redirects";
import {
  getPublishedWriting,
  getRelatedWriting,
  getWritingBySlug,
  getWritingNeighbors,
} from "@/lib/content-source/get-writing";
import {
  buildContentDetailMetadata,
  contentSectionLabel,
} from "@/lib/seo/build-metadata";
import { buildArticleJsonLd } from "@/lib/seo/json-ld";

type WritingDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const getCachedWritingBySlug = cache(async (slug: string) => getWritingBySlug(slug));

export async function generateStaticParams() {
  const { value } = await getPublishedWriting();
  return value.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: WritingDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getCachedWritingBySlug(slug);
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
  const item = await getCachedWritingBySlug(slug);

  if (!item) {
    const redirectedSlug = await resolveSlugRedirect("writing", slug);
    if (redirectedSlug) {
      permanentRedirect(`/writing/${redirectedSlug}`);
    }
    notFound();
  }

  const articleLd = await buildArticleJsonLd(item);
  const related = await getRelatedWriting(slug, item.tags);
  const relatedLinks = related.map((r) => ({
    href: `${CONTENT_PATH_PREFIX.writing}/${r.slug}`,
    title: r.title,
  }));
  const neighbors = await getWritingNeighbors(slug);

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

        <ContentBody body={item.body} context={{ domain: "writing", slug: item.slug }} />

        <WritingPrevNext prev={neighbors.prev} next={neighbors.next} />

        <RelatedContentLinks
          heading="Related writing"
          items={relatedLinks}
          emptyMessage="More pieces on this topic are coming soon."
          sectionHref="/writing"
          sectionLinkLabel="Browse all writing"
        />
      </ContentDetailMain>
    </>
  );
}

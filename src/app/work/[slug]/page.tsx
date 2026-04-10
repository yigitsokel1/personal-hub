import type { Metadata } from "next";
import { cache } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import { ContentBody } from "@/components/content/content-body";
import { ContentDetailMain } from "@/components/content/content-detail-main";
import { RelatedContentLinks } from "@/components/content/related-content-links";
import { WorkDetailIntro } from "@/components/content/work-detail-intro";
import { CONTENT_PATH_PREFIX } from "@/lib/content/config";
import { resolveSlugRedirect } from "@/lib/content-source/slug-redirects";
import { getPublishedWork, getRelatedWork, getWorkBySlug } from "@/lib/content-source/get-work";
import {
  buildContentDetailMetadata,
  contentSectionLabel,
} from "@/lib/seo/build-metadata";

type WorkDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const getCachedWorkBySlug = cache(async (slug: string) => getWorkBySlug(slug));

export async function generateStaticParams() {
  const { value } = await getPublishedWork();
  return value.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: WorkDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getCachedWorkBySlug(slug);
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
  const item = await getCachedWorkBySlug(slug);

  if (!item) {
    const redirectedSlug = await resolveSlugRedirect("work", slug);
    if (redirectedSlug) {
      permanentRedirect(`/work/${redirectedSlug}`);
    }
    notFound();
  }

  const related = await getRelatedWork(slug, item.tags);
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
        liveUrl={item.liveUrl}
        client={item.client}
        engagementType={item.engagementType}
        confidentialityLevel={item.confidentialityLevel}
        scope={item.scope}
        impact={item.impact}
        cover={item.cover}
      />

      <ContentBody body={item.body} context={{ domain: "work", slug: item.slug }} />

      <RelatedContentLinks
        heading="Related work"
        items={relatedLinks}
        emptyMessage="No matching engagements linked yet."
        sectionHref="/work"
        sectionLinkLabel="Browse all work"
      />
    </ContentDetailMain>
  );
}

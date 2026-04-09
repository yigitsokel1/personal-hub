import type { Metadata } from "next";
import { cache } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import { ContentBody } from "@/components/content/content-body";
import { ContentDetailMain } from "@/components/content/content-detail-main";
import { LabDetailIntro } from "@/components/content/lab-detail-intro";
import { RelatedContentLinks } from "@/components/content/related-content-links";
import { CONTENT_PATH_PREFIX } from "@/lib/content/config";
import { resolveSlugRedirect } from "@/lib/content-source/slug-redirects";
import { getLabBySlug, getPublishedLabs, getRelatedLabs } from "@/lib/content-source/get-labs";
import {
  buildContentDetailMetadata,
  contentSectionLabel,
} from "@/lib/seo/build-metadata";

type LabDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const getCachedLabBySlug = cache(async (slug: string) => getLabBySlug(slug));

export async function generateStaticParams() {
  const { value } = await getPublishedLabs();
  return value.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: LabDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getCachedLabBySlug(slug);
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
  const item = await getCachedLabBySlug(slug);

  if (!item) {
    const redirectedSlug = await resolveSlugRedirect("labs", slug);
    if (redirectedSlug) {
      permanentRedirect(`/labs/${redirectedSlug}`);
    }
    notFound();
  }
  const related = await getRelatedLabs(slug, item.tags);
  const relatedLinks = related.map((r) => ({
    href: `${CONTENT_PATH_PREFIX.lab}/${r.slug}`,
    title: r.title,
  }));

  return (
    <ContentDetailMain>
      <LabDetailIntro
        title={item.title}
        summary={item.summary}
        publishedAt={item.publishedAt}
        tags={item.tags}
        cover={item.cover}
        status={item.status}
      />

      <p className="mt-8 max-w-3xl text-sm leading-relaxed text-black/55 sm:mt-10">
        Exploration note: this page captures an active experiment, so outcomes may
        be partial while the direction evolves.
      </p>

      <ContentBody body={item.body} context={{ domain: "labs", slug: item.slug }} />

      <RelatedContentLinks
        heading="Related labs"
        items={relatedLinks}
        emptyMessage="No matching experiments linked yet."
        sectionHref="/labs"
        sectionLinkLabel="Browse all labs"
      />
    </ContentDetailMain>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentBody } from "@/components/content/content-body";
import { ContentPageIntro } from "@/components/content/content-page-intro";
import { getAllContent, getContentBySlug } from "@/lib/content/get-content";

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

  return {
    title: item.seo?.title ?? `${item.title} — Work`,
    description: item.seo?.description ?? item.summary,
  };
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { slug } = await params;
  const item = getContentBySlug("work", slug);

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

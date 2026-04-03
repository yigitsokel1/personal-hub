import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentBody } from "@/components/content/content-body";
import { ContentPageIntro } from "@/components/content/content-page-intro";
import { getAllContent, getContentBySlug } from "@/lib/content/get-content";

type LabDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllContent("lab").map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: LabDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getContentBySlug("lab", slug);
  if (!item) return {};

  return {
    title: item.seo?.title ?? `${item.title} — Labs`,
    description: item.seo?.description ?? item.summary,
  };
}

export default async function LabDetailPage({ params }: LabDetailPageProps) {
  const { slug } = await params;
  const item = getContentBySlug("lab", slug);

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

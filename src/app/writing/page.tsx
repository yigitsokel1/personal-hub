import type { Metadata } from "next";
import Link from "next/link";
import { ContentListItem } from "@/components/content/content-list-item";
import { DomainIndexEmpty } from "@/components/content/domain-index-empty";
import { getPublishedContent } from "@/lib/content/get-content";
import { formatContentDate } from "@/lib/format-content-date";
import { buildSimplePageMetadata } from "@/lib/seo/build-metadata";

export const metadata: Metadata = buildSimplePageMetadata({
  pathname: "/writing",
  title: "Writing",
  description:
    "Longer-form technical and product writing—architecture, delivery, and judgment.",
});

export default function WritingPage() {
  const writing = getPublishedContent("writing");

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">Writing</h1>
        <p className="mt-3 text-sm text-black/45">
          Browse by topic across the site —{" "}
          <Link
            href="/tags"
            className="text-foreground/70 underline decoration-black/20 underline-offset-4 transition-colors hover:text-foreground hover:decoration-black/40"
          >
            all tags
          </Link>
          .
        </p>

        {writing.length === 0 ? (
          <DomainIndexEmpty noun="writing" />
        ) : (
          <div className="mt-10 space-y-9">
            {writing.map((item) => {
              const meta: string[] = [];
              if (item.category) meta.push(item.category);
              if (item.readingTime != null)
                meta.push(`${item.readingTime} min read`);

              return (
                <ContentListItem
                  key={item.id}
                  href={`/writing/${item.slug}`}
                  publishedAt={formatContentDate(item.publishedAt)}
                  title={item.title}
                  summary={item.summary}
                  tags={item.tags}
                  meta={meta.length ? meta : undefined}
                />
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

import { ContentListItem } from "@/components/content/content-list-item";
import { getPublishedContent } from "@/lib/content/get-content";
import { formatContentDate } from "@/lib/format-content-date";

export default function WritingPage() {
  const writing = getPublishedContent("writing");

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
      <h1 className="text-3xl font-semibold">Writing</h1>

      <div className="mt-10 space-y-10">
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
    </main>
  );
}

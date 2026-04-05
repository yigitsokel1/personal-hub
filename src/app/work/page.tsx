import { ContentListItem } from "@/components/content/content-list-item";
import { getPublishedContent } from "@/lib/content/get-content";
import { formatContentDate } from "@/lib/format-content-date";
import { formatEngagementType } from "@/lib/format-engagement-type";

export default function WorkPage() {
  const work = getPublishedContent("work");

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">Work</h1>

        <div className="mt-10 space-y-9">
          {work.map((item) => (
            <ContentListItem
              key={item.id}
              href={`/work/${item.slug}`}
              publishedAt={formatContentDate(item.publishedAt)}
              title={item.title}
              summary={item.summary}
              tags={item.tags}
              meta={[
                item.client,
                formatEngagementType(item.engagementType),
                item.role,
              ]}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

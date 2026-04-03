import { ContentListItem } from "@/components/content/content-list-item";
import { getAllContent } from "@/lib/content/get-content";
import { formatContentDate } from "@/lib/format-content-date";
import { formatEngagementType } from "@/lib/format-engagement-type";

export default function WorkPage() {
  const work = getAllContent("work");

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
      <h1 className="text-3xl font-semibold">Work</h1>

      <div className="mt-10 space-y-10">
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
    </main>
  );
}

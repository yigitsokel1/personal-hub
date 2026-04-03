import { ContentListItem } from "@/components/content/content-list-item";
import { getAllContent } from "@/lib/content/get-content";

export default function WorkPage() {
  const work = getAllContent("work");

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Work</h1>

      <div className="mt-10 space-y-8">
        {work.map((item) => (
          <ContentListItem
            key={item.id}
            href={`/work/${item.slug}`}
            publishedAt={item.publishedAt}
            title={item.title}
            summary={item.summary}
          />
        ))}
      </div>
    </main>
  );
}

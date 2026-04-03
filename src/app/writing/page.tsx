import { ContentListItem } from "@/components/content/content-list-item";
import { getAllContent } from "@/lib/content/get-content";

export default function WritingPage() {
  const writing = getAllContent("writing");

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Writing</h1>

      <div className="mt-10 space-y-8">
        {writing.map((item) => (
          <ContentListItem
            key={item.id}
            href={`/writing/${item.slug}`}
            publishedAt={item.publishedAt}
            title={item.title}
            summary={item.summary}
          />
        ))}
      </div>
    </main>
  );
}

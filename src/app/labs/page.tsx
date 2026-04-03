import { ContentListItem } from "@/components/content/content-list-item";
import { getAllContent } from "@/lib/content/get-content";

export default function LabsPage() {
  const labs = getAllContent("lab");

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Labs</h1>

      <div className="mt-10 space-y-8">
        {labs.map((lab) => (
          <ContentListItem
            key={lab.id}
            href={`/labs/${lab.slug}`}
            publishedAt={lab.publishedAt}
            title={lab.title}
            summary={lab.summary}
          />
        ))}
      </div>
    </main>
  );
}

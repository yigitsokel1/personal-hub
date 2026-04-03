import { ContentListItem } from "@/components/content/content-list-item";
import { getAllContent } from "@/lib/content/get-content";
import { formatContentDate } from "@/lib/format-content-date";

export default function LabsPage() {
  const labs = getAllContent("lab");

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
      <h1 className="text-3xl font-semibold">Labs</h1>

      <div className="mt-10 space-y-10">
        {labs.map((lab) => (
          <ContentListItem
            key={lab.id}
            href={`/labs/${lab.slug}`}
            publishedAt={formatContentDate(lab.publishedAt)}
            title={lab.title}
            summary={lab.summary}
            tags={lab.tags}
            meta={[
              lab.experimentType,
              lab.maturityLevel
                ? lab.maturityLevel.toUpperCase()
                : undefined,
            ].filter(Boolean) as string[]}
          />
        ))}
      </div>
    </main>
  );
}

import { ContentListItem } from "@/components/content/content-list-item";
import { getPublishedContent } from "@/lib/content/get-content";
import { formatContentDate } from "@/lib/format-content-date";

export default function LabsPage() {
  const labs = getPublishedContent("lab");

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">Labs</h1>

        <div className="mt-10 space-y-9">
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
      </div>
    </main>
  );
}

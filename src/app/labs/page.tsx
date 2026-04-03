import { getAllContent } from "@/lib/content/get-content";

export default function LabsPage() {
  const labs = getAllContent("lab");

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Labs</h1>

      <div className="mt-10 space-y-8">
        {labs.map((lab) => (
          <article key={lab.id} className="border-b pb-6">
            <p className="text-sm opacity-60">{lab.publishedAt}</p>
            <h2 className="mt-2 text-2xl font-medium">{lab.title}</h2>
            <p className="mt-2 text-base opacity-80">{lab.summary}</p>
          </article>
        ))}
      </div>
    </main>
  );
}

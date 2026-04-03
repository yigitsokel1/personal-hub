import { getAllContent } from "@/lib/content/get-content";

export default function WorkPage() {
  const work = getAllContent("work");

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Work</h1>

      <div className="mt-10 space-y-8">
        {work.map((item) => (
          <article key={item.id} className="border-b pb-6">
            <p className="text-sm opacity-60">{item.publishedAt}</p>
            <h2 className="mt-2 text-2xl font-medium">{item.title}</h2>
            <p className="mt-2 text-base opacity-80">{item.summary}</p>
          </article>
        ))}
      </div>
    </main>
  );
}

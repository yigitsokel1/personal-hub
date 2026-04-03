import { ContentListItem } from "@/components/content/content-list-item";
import { getAllContent } from "@/lib/content/get-content";

export default function ProjectsPage() {
  const projects = getAllContent("project");

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Projects</h1>

      <div className="mt-10 space-y-8">
        {projects.map((project) => (
          <ContentListItem
            key={project.id}
            href={`/projects/${project.slug}`}
            publishedAt={project.publishedAt}
            title={project.title}
            summary={project.summary}
          />
        ))}
      </div>
    </main>
  );
}

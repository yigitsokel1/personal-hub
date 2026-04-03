import { ContentListItem } from "@/components/content/content-list-item";
import { getAllContent } from "@/lib/content/get-content";
import { formatContentDate } from "@/lib/format-content-date";

export default function ProjectsPage() {
  const projects = getAllContent("project");

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
      <h1 className="text-3xl font-semibold">Projects</h1>

      <div className="mt-10 space-y-10">
        {projects.map((project) => (
          <ContentListItem
            key={project.id}
            href={`/projects/${project.slug}`}
            publishedAt={formatContentDate(project.publishedAt)}
            title={project.title}
            summary={project.summary}
            tags={project.tags}
            meta={[
              project.role,
              project.stack.slice(0, 3).join(", "),
            ].filter(Boolean)}
          />
        ))}
      </div>
    </main>
  );
}

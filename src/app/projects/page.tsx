import { ContentListItem } from "@/components/content/content-list-item";
import { getPublishedContent } from "@/lib/content/get-content";
import { formatContentDate } from "@/lib/format-content-date";

export default function ProjectsPage() {
  const projects = getPublishedContent("project");

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">Projects</h1>

        <div className="mt-10 space-y-9">
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
      </div>
    </main>
  );
}

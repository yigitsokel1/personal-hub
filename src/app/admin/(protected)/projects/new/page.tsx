import { createProjectAction } from "@/app/admin/(protected)/projects/actions";
import { ProjectsForm } from "@/app/admin/(protected)/projects/form";
import { parseAdminFormErrors } from "@/lib/admin/form-errors";
import { countOtherFeaturedProjects } from "@/lib/content-source/get-projects";

export default async function NewAdminProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; errors?: string }>;
}) {
  const params = await searchParams;
  const errors = parseAdminFormErrors(params.errors);
  const featuredCount = await countOtherFeaturedProjects();

  return (
    <main>
      <h1 className="text-2xl font-semibold tracking-tight">New Project</h1>
      <p className="mt-2 text-sm text-black/60">Create a project item for public or draft state.</p>
      <ProjectsForm
        mode="create"
        action={createProjectAction}
        status={params.status}
        errors={errors}
        featuredCount={featuredCount}
      />
    </main>
  );
}

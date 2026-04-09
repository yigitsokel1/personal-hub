import { notFound } from "next/navigation";
import { updateProjectAction } from "@/app/admin/(protected)/projects/actions";
import { ProjectsForm } from "@/app/admin/(protected)/projects/form";
import { parseAdminFormErrors } from "@/lib/admin/form-errors";
import { countOtherFeaturedProjects, getAdminProjectById } from "@/lib/content-source/get-projects";

export default async function EditAdminProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string; errors?: string }>;
}) {
  const { id } = await params;
  const current = await getAdminProjectById(id);
  if (!current) notFound();

  const sp = await searchParams;
  const errors = parseAdminFormErrors(sp.errors);
  const featuredCount = await countOtherFeaturedProjects(id);

  return (
    <main>
      <h1 className="text-2xl font-semibold tracking-tight">Edit Project</h1>
      <p className="mt-2 text-sm text-black/60">Update content, publication state, and featured flag.</p>
      <ProjectsForm
        mode="edit"
        action={updateProjectAction.bind(null, id)}
        status={sp.status}
        errors={errors}
        current={current}
        featuredCount={featuredCount}
      />
    </main>
  );
}

import { createWorkAction } from "@/app/admin/(protected)/work/actions";
import { WorkForm } from "@/app/admin/(protected)/work/form";
import { parseAdminFormErrors } from "@/lib/admin/form-errors";
import { countOtherFeaturedWork } from "@/lib/content-source/get-work";

export default async function NewAdminWorkPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; errors?: string }>;
}) {
  const params = await searchParams;
  const errors = parseAdminFormErrors(params.errors);
  const featuredCount = await countOtherFeaturedWork();

  return (
    <main>
      <h1 className="text-2xl font-semibold tracking-tight">New Work</h1>
      <p className="mt-2 text-sm text-black/60">Create a work item for public or draft state.</p>
      <WorkForm mode="create" action={createWorkAction} status={params.status} errors={errors} featuredCount={featuredCount} />
    </main>
  );
}

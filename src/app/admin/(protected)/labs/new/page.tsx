import { createLabAction } from "@/app/admin/(protected)/labs/actions";
import { LabsForm } from "@/app/admin/(protected)/labs/form";
import { parseAdminFormErrors } from "@/lib/admin/form-errors";
import { countOtherFeaturedLabs } from "@/lib/content-source/get-labs";

export default async function NewAdminLabsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; errors?: string }>;
}) {
  const params = await searchParams;
  const errors = parseAdminFormErrors(params.errors);
  const featuredCount = await countOtherFeaturedLabs();

  return (
    <main>
      <h1 className="text-2xl font-semibold tracking-tight">New Lab</h1>
      <p className="mt-2 text-sm text-black/60">Create a lightweight lab entry for exploratory work.</p>
      <LabsForm
        mode="create"
        action={createLabAction}
        status={params.status}
        errors={errors}
        featuredCount={featuredCount}
      />
    </main>
  );
}

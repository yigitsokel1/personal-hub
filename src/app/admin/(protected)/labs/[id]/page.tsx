import { notFound } from "next/navigation";
import { updateLabAction } from "@/app/admin/(protected)/labs/actions";
import { LabsForm } from "@/app/admin/(protected)/labs/form";
import { parseAdminFormErrors } from "@/lib/admin/form-errors";
import { countOtherFeaturedLabs, getAdminLabById } from "@/lib/content-source/get-labs";

export default async function EditAdminLabsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string; errors?: string }>;
}) {
  const { id } = await params;
  const current = await getAdminLabById(id);
  if (!current) notFound();

  const sp = await searchParams;
  const errors = parseAdminFormErrors(sp.errors);
  const featuredCount = await countOtherFeaturedLabs(id);

  return (
    <main>
      <h1 className="text-2xl font-semibold tracking-tight">Edit Lab</h1>
      <p className="mt-2 text-sm text-black/60">Update lab content and publishing state.</p>
      <LabsForm
        mode="edit"
        action={updateLabAction.bind(null, id)}
        status={sp.status}
        errors={errors}
        current={current}
        featuredCount={featuredCount}
      />
    </main>
  );
}

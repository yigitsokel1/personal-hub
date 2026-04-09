import { notFound } from "next/navigation";
import { updateWorkAction } from "@/app/admin/(protected)/work/actions";
import { WorkForm } from "@/app/admin/(protected)/work/form";
import { parseAdminFormErrors } from "@/lib/admin/form-errors";
import { countOtherFeaturedWork, getAdminWorkById } from "@/lib/content-source/get-work";

export default async function EditAdminWorkPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string; errors?: string }>;
}) {
  const { id } = await params;
  const current = await getAdminWorkById(id);
  if (!current) notFound();

  const sp = await searchParams;
  const errors = parseAdminFormErrors(sp.errors);
  const featuredCount = await countOtherFeaturedWork(id);

  return (
    <main>
      <h1 className="text-2xl font-semibold tracking-tight">Edit Work</h1>
      <p className="mt-2 text-sm text-black/60">Update work content, publication state, and featured flag.</p>
      <WorkForm
        mode="edit"
        action={updateWorkAction.bind(null, id)}
        status={sp.status}
        errors={errors}
        current={current}
        featuredCount={featuredCount}
      />
    </main>
  );
}

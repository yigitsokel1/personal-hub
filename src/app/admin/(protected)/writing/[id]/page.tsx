import { notFound } from "next/navigation";
import { updateWritingAction } from "@/app/admin/(protected)/writing/actions";
import { WritingForm } from "@/app/admin/(protected)/writing/form";
import { parseAdminFormErrors } from "@/lib/admin/form-errors";
import { countOtherFeaturedWriting, getAdminWritingById } from "@/lib/content-source/get-writing";

export default async function EditAdminWritingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string; errors?: string }>;
}) {
  const { id } = await params;
  const current = await getAdminWritingById(id);
  if (!current) {
    notFound();
  }

  const sp = await searchParams;
  const errors = parseAdminFormErrors(sp.errors);
  const featuredCount = await countOtherFeaturedWriting(id);

  return (
    <main>
      <h1 className="text-2xl font-semibold tracking-tight">Edit Writing</h1>
      <p className="mt-2 text-sm text-black/60">Update content, publication state, and featured flag.</p>
      <WritingForm
        mode="edit"
        action={updateWritingAction.bind(null, id)}
        status={sp.status}
        errors={errors}
        current={current}
        featuredCount={featuredCount}
      />
    </main>
  );
}

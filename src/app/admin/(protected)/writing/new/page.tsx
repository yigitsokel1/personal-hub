import { createWritingAction } from "@/app/admin/(protected)/writing/actions";
import { WritingForm } from "@/app/admin/(protected)/writing/form";
import { parseAdminFormErrors } from "@/lib/admin/form-errors";
import { countOtherFeaturedWriting } from "@/lib/content-source/get-writing";

export default async function NewAdminWritingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; errors?: string }>;
}) {
  const params = await searchParams;
  const errors = parseAdminFormErrors(params.errors);
  const featuredCount = await countOtherFeaturedWriting();

  return (
    <main>
      <h1 className="text-2xl font-semibold tracking-tight">New Writing</h1>
      <p className="mt-2 text-sm text-black/60">
        Create a writing item for public or draft state.
      </p>
      <WritingForm mode="create" action={createWritingAction} status={params.status} errors={errors} featuredCount={featuredCount} />
    </main>
  );
}

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import {
  countOtherFeaturedLabs,
  getAdminLabById,
  isLabSlugTaken,
  updateLab,
} from "@/lib/content-source/get-labs";
import {
  MAX_FEATURED_LABS,
  serializeCommaList,
  toLabInput,
} from "@/lib/domain/labs/mapper";
import { LAB_STATUSES } from "@/lib/domain/labs/types";
import { validateLabInput } from "@/lib/domain/labs/validator";

async function validateMdxBody(body: string): Promise<string | null> {
  try {
    const { serialize } = await import("next-mdx-remote/serialize");
    await serialize(body);
    return null;
  } catch {
    return "Body must be valid MDX syntax.";
  }
}

async function updateLabAction(id: string, formData: FormData): Promise<void> {
  "use server";

  const validated = validateLabInput(
    toLabInput({
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      summary: String(formData.get("summary") ?? ""),
      body: String(formData.get("body") ?? ""),
      tagsRaw: String(formData.get("tags") ?? ""),
      status: String(formData.get("status") ?? "idea") as (typeof LAB_STATUSES)[number],
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on",
      publishedAt: String(formData.get("publishedAt") ?? ""),
    })
  );

  if (!validated.success) {
    const payload = encodeURIComponent(JSON.stringify(validated.errors));
    redirect(`/admin/labs/${id}?status=error&errors=${payload}`);
  }

  const mdxError = await validateMdxBody(validated.value.body);
  if (mdxError) {
    const payload = encodeURIComponent(JSON.stringify({ body: mdxError }));
    redirect(`/admin/labs/${id}?status=error&errors=${payload}`);
  }

  if (await isLabSlugTaken(validated.value.slug, id)) {
    const payload = encodeURIComponent(JSON.stringify({ slug: "Slug must be unique." }));
    redirect(`/admin/labs/${id}?status=error&errors=${payload}`);
  }

  if (validated.value.featured && (await countOtherFeaturedLabs(id)) >= MAX_FEATURED_LABS) {
    const payload = encodeURIComponent(
      JSON.stringify({
        featured: `Maximum ${MAX_FEATURED_LABS} featured labs are allowed.`,
      })
    );
    redirect(`/admin/labs/${id}?status=error&errors=${payload}`);
  }

  const saved = await updateLab(id, validated.value);
  revalidatePath("/labs");
  revalidatePath(`/labs/${saved.slug}`);
  redirect("/admin/labs?status=saved");
}

export default async function EditAdminLabsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string; errors?: string }>;
}) {
  const { id } = await params;
  const current = await getAdminLabById(id);
  if (!current) {
    notFound();
  }

  const sp = await searchParams;
  const publishedAtValue = current.publishedAt
    ? new Date(current.publishedAt).toISOString().slice(0, 16)
    : "";
  let parsedErrors: Record<string, string> = {};
  if (sp.errors) {
    try {
      parsedErrors = JSON.parse(sp.errors) as Record<string, string>;
    } catch {
      parsedErrors = {};
    }
  }

  return (
    <main>
      <h1 className="text-2xl font-semibold tracking-tight">Edit Lab</h1>
      <p className="mt-2 text-sm text-black/60">Update lab content and publishing state.</p>
      {sp.status === "error" ? (
        <p className="mt-3 text-sm text-red-700">Error saving</p>
      ) : null}

      <form action={updateLabAction.bind(null, id)} className="mt-8 space-y-8">
        <section className="space-y-5 border-b border-black/10 pb-8">
          <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-black/55">Content</h2>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Title *</span>
            <input name="title" defaultValue={current.title} className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" required />
            {parsedErrors.title ? <p className="mt-1 text-xs text-red-700">{parsedErrors.title}</p> : null}
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Slug *</span>
            <input name="slug" defaultValue={current.slug} className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" required />
            {parsedErrors.slug ? <p className="mt-1 text-xs text-red-700">{parsedErrors.slug}</p> : null}
            <p className="mt-1 text-xs text-black/45">Used in URL. Auto-generated from title but editable.</p>
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Summary *</span>
            <textarea name="summary" defaultValue={current.summary} className="min-h-32 w-full resize-y rounded-md border border-black/15 px-3 py-2 leading-6 text-sm outline-none focus:border-black/35" required />
            {parsedErrors.summary ? <p className="mt-1 text-xs text-red-700">{parsedErrors.summary}</p> : null}
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Body *</span>
            <textarea name="body" defaultValue={current.body} className="min-h-80 w-full resize-y rounded-md border border-black/15 px-3 py-2 font-mono text-sm leading-7 outline-none focus:border-black/35" required />
            {parsedErrors.body ? <p className="mt-1 text-xs text-red-700">{parsedErrors.body}</p> : null}
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Tags</span>
            <input name="tags" defaultValue={serializeCommaList(current.tags ?? [])} className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" />
            {parsedErrors.tags ? <p className="mt-1 text-xs text-red-700">{parsedErrors.tags}</p> : null}
            <p className="mt-1 text-xs text-black/45">Max 3 tags. Used for grouping and discovery.</p>
          </label>
        </section>

        <section className="space-y-5 border-b border-black/10 pb-8">
          <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-black/55">Publishing</h2>
          <div className="rounded-md border border-black/10 bg-black/[0.02] px-3 py-2 text-xs text-black/60">
            State: {current.published ? "Published" : "Draft"} {`|`} Featured: {current.featured ? "Yes" : "No"}
          </div>
          <label className="block max-w-sm">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Published at</span>
            <input name="publishedAt" type="datetime-local" defaultValue={publishedAtValue} className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" />
            {parsedErrors.publishedAt ? <p className="mt-1 text-xs text-red-700">{parsedErrors.publishedAt}</p> : null}
            <p className="mt-1 text-xs text-black/45">Controls ordering on the public site.</p>
          </label>
          <div className="flex flex-wrap gap-6">
            <label className="inline-flex items-center gap-2 text-sm text-black/70">
              <input type="checkbox" name="featured" defaultChecked={Boolean(current.featured)} />
              Featured
              <span className="text-xs text-black/45">Shown on homepage and highlighted sections (max 2).</span>
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-black/70">
              <input type="checkbox" name="published" defaultChecked={current.published} />
              Published
              <span className="text-xs text-black/45">Only published items are visible on the public site.</span>
            </label>
          </div>
          {parsedErrors.featured ? <p className="mt-1 text-xs text-red-700">{parsedErrors.featured}</p> : null}
        </section>
        <section className="space-y-5">
          <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-black/55">Domain-specific</h2>
          <label className="block max-w-sm">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Status *</span>
            <select
              name="status"
              defaultValue={current.status}
              className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black/35"
            >
              {LAB_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {parsedErrors.status ? <p className="mt-1 text-xs text-red-700">{parsedErrors.status}</p> : null}
          </label>
          <div className="flex justify-end">
            <button type="submit" className="rounded-md bg-black px-4 py-2 font-mono text-sm text-white transition-opacity hover:opacity-90">
              Save
            </button>
          </div>
        </section>
      </form>
    </main>
  );
}

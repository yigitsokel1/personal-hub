import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  countOtherFeaturedWork,
  createWork,
  isWorkSlugTaken,
} from "@/lib/content-source/get-work";
import {
  MAX_FEATURED_WORK,
  toWorkInput,
  WORK_CONFIDENTIALITY_LEVELS,
  WORK_ENGAGEMENT_TYPES,
} from "@/lib/domain/work/mapper";
import { validateWorkInput } from "@/lib/domain/work/validator";

async function validateMdxBody(body: string): Promise<string | null> {
  try {
    const { serialize } = await import("next-mdx-remote/serialize");
    await serialize(body);
    return null;
  } catch {
    return "Body must be valid MDX syntax.";
  }
}

async function createWorkAction(formData: FormData): Promise<void> {
  "use server";

  const validated = validateWorkInput(
    toWorkInput({
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      summary: String(formData.get("summary") ?? ""),
      body: String(formData.get("body") ?? ""),
      tagsRaw: String(formData.get("tags") ?? ""),
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on",
      publishedAt: String(formData.get("publishedAt") ?? ""),
      client: String(formData.get("client") ?? ""),
      engagementType: String(formData.get("engagementType") ?? "") as (typeof WORK_ENGAGEMENT_TYPES)[number],
      role: String(formData.get("role") ?? ""),
      timeline: String(formData.get("timeline") ?? ""),
      confidentialityLevel: String(formData.get("confidentialityLevel") ?? "") as
        | (typeof WORK_CONFIDENTIALITY_LEVELS)[number]
        | "",
      scopeRaw: String(formData.get("scope") ?? ""),
      responsibilitiesRaw: String(formData.get("responsibilities") ?? ""),
      constraintsRaw: String(formData.get("constraints") ?? ""),
      impactRaw: String(formData.get("impact") ?? ""),
    })
  );

  if (!validated.success) {
    const payload = encodeURIComponent(JSON.stringify(validated.errors));
    redirect(`/admin/work/new?status=error&errors=${payload}`);
  }

  const mdxError = await validateMdxBody(validated.value.body);
  if (mdxError) {
    const payload = encodeURIComponent(JSON.stringify({ body: mdxError }));
    redirect(`/admin/work/new?status=error&errors=${payload}`);
  }

  if (await isWorkSlugTaken(validated.value.slug)) {
    const payload = encodeURIComponent(JSON.stringify({ slug: "Slug must be unique." }));
    redirect(`/admin/work/new?status=error&errors=${payload}`);
  }

  if (validated.value.featured && (await countOtherFeaturedWork()) >= MAX_FEATURED_WORK) {
    const payload = encodeURIComponent(
      JSON.stringify({
        featured: `Maximum ${MAX_FEATURED_WORK} featured work items are allowed.`,
      })
    );
    redirect(`/admin/work/new?status=error&errors=${payload}`);
  }

  await createWork(validated.value);
  revalidatePath("/work");
  redirect("/admin/work?status=saved");
}

export default async function NewAdminWorkPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; errors?: string }>;
}) {
  const params = await searchParams;
  let parsedErrors: Record<string, string> = {};
  if (params.errors) {
    try {
      parsedErrors = JSON.parse(params.errors) as Record<string, string>;
    } catch {
      parsedErrors = {};
    }
  }

  return (
    <main>
      <h1 className="text-2xl font-semibold tracking-tight">New Work</h1>
      <p className="mt-2 text-sm text-black/60">Create a work item for public or draft state.</p>
      {params.status === "error" ? (
        <p className="mt-3 text-sm text-red-700">Please fix the highlighted fields and try again.</p>
      ) : null}

      <form action={createWorkAction} className="mt-8 space-y-8">
        <section className="space-y-5 border-b border-black/10 pb-8">
          <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-black/55">Group 1 - Core</h2>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Title *</span>
            <input name="title" className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" required />
            {parsedErrors.title ? <p className="mt-1 text-xs text-red-700">{parsedErrors.title}</p> : null}
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Slug *</span>
            <input name="slug" className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" />
            <p className="mt-1 text-xs text-black/45">Leave blank to auto-generate from title.</p>
            {parsedErrors.slug ? <p className="mt-1 text-xs text-red-700">{parsedErrors.slug}</p> : null}
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Summary *</span>
            <textarea name="summary" className="h-24 w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" required />
            {parsedErrors.summary ? <p className="mt-1 text-xs text-red-700">{parsedErrors.summary}</p> : null}
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Body *</span>
            <textarea name="body" className="h-56 w-full rounded-md border border-black/15 px-3 py-2 font-mono text-xs outline-none focus:border-black/35" required />
            {parsedErrors.body ? <p className="mt-1 text-xs text-red-700">{parsedErrors.body}</p> : null}
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Tags (comma, max 3)</span>
            <input name="tags" className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" />
            {parsedErrors.tags ? <p className="mt-1 text-xs text-red-700">{parsedErrors.tags}</p> : null}
          </label>
        </section>

        <section className="space-y-5 border-b border-black/10 pb-8">
          <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-black/55">Group 2 - Publishing</h2>
          <label className="block max-w-sm">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Published at</span>
            <input name="publishedAt" type="datetime-local" className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" />
            {parsedErrors.publishedAt ? <p className="mt-1 text-xs text-red-700">{parsedErrors.publishedAt}</p> : null}
          </label>
          <div className="flex flex-wrap gap-6">
            <label className="inline-flex items-center gap-2 text-sm text-black/70">
              <input type="checkbox" name="featured" />
              Featured
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-black/70">
              <input type="checkbox" name="published" />
              Published
            </label>
          </div>
          {parsedErrors.featured ? <p className="mt-1 text-xs text-red-700">{parsedErrors.featured}</p> : null}
        </section>

        <section className="space-y-5">
          <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-black/55">Group 3 - Engagement</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Client *</span>
              <input name="client" className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" required />
              {parsedErrors.client ? <p className="mt-1 text-xs text-red-700">{parsedErrors.client}</p> : null}
            </label>
            <label className="block">
              <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Role *</span>
              <input name="role" className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" required />
              {parsedErrors.role ? <p className="mt-1 text-xs text-red-700">{parsedErrors.role}</p> : null}
            </label>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Engagement type *</span>
              <select name="engagementType" defaultValue="contract" className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black/35">
                {WORK_ENGAGEMENT_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {parsedErrors.engagementType ? <p className="mt-1 text-xs text-red-700">{parsedErrors.engagementType}</p> : null}
            </label>
            <label className="block">
              <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Confidentiality</span>
              <select name="confidentialityLevel" defaultValue="" className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black/35">
                <option value="">none</option>
                {WORK_CONFIDENTIALITY_LEVELS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {parsedErrors.confidentialityLevel ? <p className="mt-1 text-xs text-red-700">{parsedErrors.confidentialityLevel}</p> : null}
            </label>
          </div>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Timeline</span>
            <input name="timeline" className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" />
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Scope (one line each)</span>
            <textarea name="scope" className="h-24 w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" />
            {parsedErrors.scope ? <p className="mt-1 text-xs text-red-700">{parsedErrors.scope}</p> : null}
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Responsibilities (one line each)</span>
            <textarea name="responsibilities" className="h-24 w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" />
            {parsedErrors.responsibilities ? <p className="mt-1 text-xs text-red-700">{parsedErrors.responsibilities}</p> : null}
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Constraints (one line each)</span>
            <textarea name="constraints" className="h-20 w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" />
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Impact (one line each)</span>
            <textarea name="impact" className="h-20 w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" />
          </label>
        </section>
        <button type="submit" className="rounded-md bg-black px-4 py-2 font-mono text-sm text-white transition-opacity hover:opacity-90">
          Create work
        </button>
      </form>
    </main>
  );
}

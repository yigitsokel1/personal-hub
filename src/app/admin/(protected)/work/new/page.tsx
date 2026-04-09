import { redirect } from "next/navigation";
import {
  enforceFeaturedLimit,
  enforcePublishEligibility,
  redirectWithErrors,
  validateMdxBody,
} from "@/lib/admin/content-mutations";
import {
  countOtherFeaturedWork,
  createWork,
  isWorkSlugTaken,
} from "@/lib/content-source/get-work";
import {
  toWorkInput,
  WORK_CONFIDENTIALITY_LEVELS,
  WORK_ENGAGEMENT_TYPES,
} from "@/lib/domain/work/mapper";
import { validateWorkInput } from "@/lib/domain/work/validator";
import { revalidateContentSurfaces } from "@/lib/revalidation/content-revalidation";

async function createWorkAction(formData: FormData): Promise<void> {
  "use server";
  const isPreviewIntent = String(formData.get("intent") ?? "") === "preview";
  const publishRequested = !isPreviewIntent && formData.get("published") === "on";

  const validated = validateWorkInput(
    toWorkInput({
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      summary: String(formData.get("summary") ?? ""),
      body: String(formData.get("body") ?? ""),
      tagsRaw: String(formData.get("tags") ?? ""),
      featured: formData.get("featured") === "on",
      published: publishRequested,
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
    redirectWithErrors("/admin/work/new", validated.errors);
  }

  enforcePublishEligibility(publishRequested, "/admin/work/new", validated.value);

  const mdxError = await validateMdxBody(validated.value.body);
  if (mdxError) {
    redirectWithErrors("/admin/work/new", { body: mdxError });
  }

  if (await isWorkSlugTaken(validated.value.slug)) {
    redirectWithErrors("/admin/work/new", { slug: "Slug must be unique." });
  }

  enforceFeaturedLimit({
    featured: validated.value.featured,
    featuredCount: await countOtherFeaturedWork(),
    domain: "work",
    basePath: "/admin/work/new",
  });

  const saved = await createWork(validated.value);
  revalidateContentSurfaces({
    domain: "work",
    slug: saved.slug,
    tags: saved.tags,
    published: saved.published,
    featured: Boolean(saved.featured),
  });
  if (isPreviewIntent) {
    redirect(`/preview/work/${saved.slug}`);
  }
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
        <p className="mt-3 text-sm text-red-700">{parsedErrors._global ?? "Error saving"}</p>
      ) : null}

      <form action={createWorkAction} className="mt-8 space-y-8">
        <section className="space-y-5 border-b border-black/10 pb-8">
          <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-black/55">Content</h2>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Title *</span>
            <input name="title" className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" required />
            {parsedErrors.title ? <p className="mt-1 text-xs text-red-700">{parsedErrors.title}</p> : null}
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Slug *</span>
            <input name="slug" className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" />
            <p className="mt-1 text-xs text-black/45">Used in URL. Auto-generated from title but editable.</p>
            {parsedErrors.slug ? <p className="mt-1 text-xs text-red-700">{parsedErrors.slug}</p> : null}
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Summary *</span>
            <textarea name="summary" className="min-h-32 w-full resize-y rounded-md border border-black/15 px-3 py-2 leading-6 text-sm outline-none focus:border-black/35" required />
            {parsedErrors.summary ? <p className="mt-1 text-xs text-red-700">{parsedErrors.summary}</p> : null}
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Body *</span>
            <textarea name="body" className="min-h-80 w-full resize-y rounded-md border border-black/15 px-3 py-2 font-mono text-sm leading-7 outline-none focus:border-black/35" required />
            {parsedErrors.body ? <p className="mt-1 text-xs text-red-700">{parsedErrors.body}</p> : null}
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Tags</span>
            <input name="tags" className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" />
            {parsedErrors.tags ? <p className="mt-1 text-xs text-red-700">{parsedErrors.tags}</p> : null}
            <p className="mt-1 text-xs text-black/45">Max 3 tags. Used for grouping and discovery.</p>
          </label>
        </section>

        <section className="space-y-5 border-b border-black/10 pb-8">
          <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-black/55">Publishing</h2>
          <div className="rounded-md border border-black/10 bg-black/[0.02] px-3 py-2 text-xs text-black/60">
            State: Draft {`|`} Featured: No
          </div>
          <label className="block max-w-sm">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Published at</span>
            <input name="publishedAt" type="datetime-local" className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" />
            {parsedErrors.publishedAt ? <p className="mt-1 text-xs text-red-700">{parsedErrors.publishedAt}</p> : null}
            <p className="mt-1 text-xs text-black/45">Controls ordering on the public site.</p>
          </label>
          <div className="flex flex-wrap gap-6">
            <label className="inline-flex items-center gap-2 text-sm text-black/70">
              <input type="checkbox" name="featured" />
              Featured
              <span className="text-xs text-black/45">Shown on homepage and highlighted sections (max 2).</span>
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-black/70">
              <input type="checkbox" name="published" />
              Published
              <span className="text-xs text-black/45">Only published items are visible on the public site.</span>
            </label>
          </div>
          {parsedErrors.featured ? <p className="mt-1 text-xs text-red-700">{parsedErrors.featured}</p> : null}
        </section>

        <section className="space-y-5">
          <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-black/55">Domain-specific</h2>
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
            <textarea name="constraints" className="min-h-24 w-full resize-y rounded-md border border-black/15 px-3 py-2 leading-6 text-sm outline-none focus:border-black/35" />
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Impact (one line each)</span>
            <textarea name="impact" className="min-h-24 w-full resize-y rounded-md border border-black/15 px-3 py-2 leading-6 text-sm outline-none focus:border-black/35" />
          </label>
        </section>
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            name="intent"
            value="preview"
            formTarget="_blank"
            className="rounded-md border border-black/20 px-4 py-2 font-mono text-sm text-black transition-colors hover:bg-black/[0.03]"
          >
            Preview
          </button>
          <button type="submit" name="intent" value="save" className="rounded-md bg-black px-4 py-2 font-mono text-sm text-white transition-opacity hover:opacity-90">
            Save
          </button>
        </div>
      </form>
    </main>
  );
}

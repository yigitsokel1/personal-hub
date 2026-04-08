import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import {
  countOtherFeaturedProjects,
  getAdminProjectById,
  isProjectSlugTaken,
  updateProject,
} from "@/lib/content-source/get-projects";
import {
  MAX_FEATURED_PROJECTS,
  serializeCommaList,
  serializeLineList,
  toProjectInput,
} from "@/lib/domain/projects/mapper";
import { validateProjectInput } from "@/lib/domain/projects/validator";

async function validateMdxBody(body: string): Promise<string | null> {
  try {
    const { serialize } = await import("next-mdx-remote/serialize");
    await serialize(body);
    return null;
  } catch {
    return "Body must be valid MDX syntax.";
  }
}

async function updateProjectAction(id: string, formData: FormData): Promise<void> {
  "use server";
  const isPreviewIntent = String(formData.get("intent") ?? "") === "preview";
  const publishRequested = !isPreviewIntent && formData.get("published") === "on";

  const validated = validateProjectInput(
    toProjectInput({
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      summary: String(formData.get("summary") ?? ""),
      body: String(formData.get("body") ?? ""),
      tagsRaw: String(formData.get("tags") ?? ""),
      featured: formData.get("featured") === "on",
      published: publishRequested,
      publishedAt: String(formData.get("publishedAt") ?? ""),
      role: String(formData.get("role") ?? ""),
      stackRaw: String(formData.get("stack") ?? ""),
      platform: String(formData.get("platform") ?? ""),
      problem: String(formData.get("problem") ?? ""),
      solution: String(formData.get("solution") ?? ""),
      architectureHighlightsRaw: String(formData.get("architectureHighlights") ?? ""),
      decisionsRaw: String(formData.get("decisions") ?? ""),
      outcomesRaw: String(formData.get("outcomes") ?? ""),
      repoUrl: String(formData.get("repoUrl") ?? ""),
      liveUrl: String(formData.get("liveUrl") ?? ""),
      timeline: String(formData.get("timeline") ?? ""),
    })
  );

  if (!validated.success) {
    const payload = encodeURIComponent(JSON.stringify(validated.errors));
    redirect(`/admin/projects/${id}?status=error&errors=${payload}`);
  }

  if (publishRequested) {
    const publishErrors: Record<string, string> = {};
    if (!validated.value.slug.trim()) publishErrors.slug = "Slug is required before publishing.";
    if (!validated.value.summary.trim()) publishErrors.summary = "Summary is required before publishing.";
    if (!validated.value.body.trim()) publishErrors.body = "Body is required before publishing.";
    if (!validated.value.publishedAt) {
      publishErrors.publishedAt = "Publish date is required before publishing.";
    }
    if (Object.keys(publishErrors).length > 0) {
      const payload = encodeURIComponent(JSON.stringify(publishErrors));
      redirect(`/admin/projects/${id}?status=error&errors=${payload}`);
    }
  }

  const mdxError = await validateMdxBody(validated.value.body);
  if (mdxError) {
    const payload = encodeURIComponent(JSON.stringify({ body: mdxError }));
    redirect(`/admin/projects/${id}?status=error&errors=${payload}`);
  }

  if (await isProjectSlugTaken(validated.value.slug, id)) {
    const payload = encodeURIComponent(JSON.stringify({ slug: "Slug must be unique." }));
    redirect(`/admin/projects/${id}?status=error&errors=${payload}`);
  }

  if (
    validated.value.featured &&
    (await countOtherFeaturedProjects(id)) >= MAX_FEATURED_PROJECTS
  ) {
    const payload = encodeURIComponent(
      JSON.stringify({
        featured: `Maximum ${MAX_FEATURED_PROJECTS} featured projects are allowed.`,
      })
    );
    redirect(`/admin/projects/${id}?status=error&errors=${payload}`);
  }

  const saved = await updateProject(id, validated.value);
  revalidatePath("/projects");
  revalidatePath(`/projects/${saved.slug}`);
  if (isPreviewIntent) {
    redirect(`/preview/projects/${saved.slug}`);
  }
  redirect("/admin/projects?status=saved");
}

export default async function EditAdminProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string; errors?: string }>;
}) {
  const { id } = await params;
  const current = await getAdminProjectById(id);
  if (!current) {
    notFound();
  }

  const publishedAtValue = current.publishedAt
    ? new Date(current.publishedAt).toISOString().slice(0, 16)
    : "";

  const sp = await searchParams;
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
      <h1 className="text-2xl font-semibold tracking-tight">Edit Project</h1>
      <p className="mt-2 text-sm text-black/60">Update content, publication state, and featured flag.</p>
      {sp.status === "error" ? (
        <p className="mt-3 text-sm text-red-700">Error saving</p>
      ) : null}

      <form action={updateProjectAction.bind(null, id)} className="mt-8 space-y-8">
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
          <p className="mt-1 text-xs text-black/45">Used in URL. Auto-generated from title but editable.</p>
          {parsedErrors.slug ? <p className="mt-1 text-xs text-red-700">{parsedErrors.slug}</p> : null}
        </label>
        <label className="block">
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Summary *</span>
          <textarea name="summary" defaultValue={current.summary} className="h-24 w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" required />
          {parsedErrors.summary ? <p className="mt-1 text-xs text-red-700">{parsedErrors.summary}</p> : null}
        </label>
        <label className="block">
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Body *</span>
          <textarea name="body" defaultValue={current.body} className="h-56 w-full rounded-md border border-black/15 px-3 py-2 font-mono text-xs outline-none focus:border-black/35" required />
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
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Role *</span>
            <input name="role" defaultValue={current.role} className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" required />
            {parsedErrors.role ? <p className="mt-1 text-xs text-red-700">{parsedErrors.role}</p> : null}
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Platform</span>
            <input name="platform" defaultValue={current.platform ?? ""} className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" />
          </label>
        </div>
        <label className="block">
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Stack * (comma)</span>
          <input name="stack" defaultValue={serializeCommaList(current.stack ?? [])} className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" required />
          {parsedErrors.stack ? <p className="mt-1 text-xs text-red-700">{parsedErrors.stack}</p> : null}
        </label>
        <label className="block">
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Problem *</span>
          <textarea name="problem" defaultValue={current.problem} className="h-24 w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" required />
          {parsedErrors.problem ? <p className="mt-1 text-xs text-red-700">{parsedErrors.problem}</p> : null}
        </label>
        <label className="block">
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Solution *</span>
          <textarea name="solution" defaultValue={current.solution} className="h-24 w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" required />
          {parsedErrors.solution ? <p className="mt-1 text-xs text-red-700">{parsedErrors.solution}</p> : null}
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Architecture highlights (one line each)</span>
            <textarea name="architectureHighlights" defaultValue={serializeLineList(current.architectureHighlights ?? [])} className="h-32 w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" />
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Decisions (one line each)</span>
            <textarea name="decisions" defaultValue={serializeLineList(current.decisions ?? [])} className="h-32 w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" />
          </label>
        </div>
        <label className="block">
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Outcomes (one line each)</span>
          <textarea name="outcomes" defaultValue={serializeLineList(current.outcomes ?? [])} className="h-24 w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" />
        </label>
        <div className="grid gap-5 sm:grid-cols-3">
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Repo URL</span>
            <input name="repoUrl" defaultValue={current.repoUrl ?? ""} className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" />
            {parsedErrors.repoUrl ? <p className="mt-1 text-xs text-red-700">{parsedErrors.repoUrl}</p> : null}
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Live URL</span>
            <input name="liveUrl" defaultValue={current.liveUrl ?? ""} className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" />
            {parsedErrors.liveUrl ? <p className="mt-1 text-xs text-red-700">{parsedErrors.liveUrl}</p> : null}
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Timeline</span>
            <input name="timeline" defaultValue={current.timeline ?? ""} className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" />
          </label>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Published at</span>
            <input name="publishedAt" type="datetime-local" defaultValue={publishedAtValue} className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35" />
            {parsedErrors.publishedAt ? <p className="mt-1 text-xs text-red-700">{parsedErrors.publishedAt}</p> : null}
            <p className="mt-1 text-xs text-black/45">Controls ordering on the public site.</p>
          </label>
        </div>
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
        </section>
      </form>
    </main>
  );
}

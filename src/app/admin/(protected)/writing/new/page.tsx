import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { toWritingInput } from "@/lib/domain/writing/mapper";
import { validateWritingInput } from "@/lib/domain/writing/validator";
import { countOtherFeaturedWriting, createWriting, isSlugTaken } from "@/lib/content-source/get-writing";

async function validateMdxBody(body: string): Promise<string | null> {
  try {
    const { serialize } = await import("next-mdx-remote/serialize");
    await serialize(body);
    return null;
  } catch {
    return "Body must be valid MDX syntax.";
  }
}

async function createWritingAction(formData: FormData): Promise<void> {
  "use server";

  const validated = validateWritingInput(
    toWritingInput({
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      summary: String(formData.get("summary") ?? ""),
      body: String(formData.get("body") ?? ""),
      tagsRaw: String(formData.get("tags") ?? ""),
      category: String(formData.get("category") ?? ""),
      series: String(formData.get("series") ?? ""),
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on",
      readingTime: String(formData.get("readingTime") ?? ""),
      publishedAt: String(formData.get("publishedAt") ?? ""),
    })
  );

  if (!validated.success) {
    const payload = encodeURIComponent(JSON.stringify(validated.errors));
    redirect(`/admin/writing/new?status=error&errors=${payload}`);
  }

  const mdxError = await validateMdxBody(validated.value.body);
  if (mdxError) {
    const payload = encodeURIComponent(
      JSON.stringify({
        body: mdxError,
      })
    );
    redirect(`/admin/writing/new?status=error&errors=${payload}`);
  }

  if (await isSlugTaken(validated.value.slug)) {
    const payload = encodeURIComponent(
      JSON.stringify({
        slug: "Slug must be unique.",
      })
    );
    redirect(`/admin/writing/new?status=error&errors=${payload}`);
  }

  if (validated.value.featured && (await countOtherFeaturedWriting()) >= 1) {
    const payload = encodeURIComponent(
      JSON.stringify({
        featured: "Only one featured writing is allowed.",
      })
    );
    redirect(`/admin/writing/new?status=error&errors=${payload}`);
  }

  await createWriting(validated.value);
  revalidatePath("/writing");
  redirect("/admin/writing?status=saved");
}

export default async function NewAdminWritingPage({
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
      <h1 className="text-2xl font-semibold tracking-tight">New Writing</h1>
      <p className="mt-2 text-sm text-black/60">
        Create a writing item for public or draft state.
      </p>
      {params.status === "error" ? (
        <p className="mt-3 text-sm text-red-700">Please fix the highlighted fields and try again.</p>
      ) : null}

      <form action={createWritingAction} className="mt-8 space-y-5">
        <label className="block">
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Title *</span>
          <input
            name="title"
            className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35"
            required
          />
          {parsedErrors.title ? <p className="mt-1 text-xs text-red-700">{parsedErrors.title}</p> : null}
        </label>

        <label className="block">
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Slug *</span>
          <input
            name="slug"
            className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35"
          />
          {parsedErrors.slug ? <p className="mt-1 text-xs text-red-700">{parsedErrors.slug}</p> : null}
          <p className="mt-1 text-xs text-black/45">Leave blank to auto-generate from title.</p>
        </label>

        <label className="block">
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Summary *</span>
          <textarea
            name="summary"
            className="h-24 w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35"
            required
          />
          {parsedErrors.summary ? <p className="mt-1 text-xs text-red-700">{parsedErrors.summary}</p> : null}
        </label>

        <label className="block">
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Body *</span>
          <textarea
            name="body"
            className="h-56 w-full rounded-md border border-black/15 px-3 py-2 font-mono text-xs outline-none focus:border-black/35"
            required
          />
          {parsedErrors.body ? <p className="mt-1 text-xs text-red-700">{parsedErrors.body}</p> : null}
        </label>

        <label className="block">
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Tags</span>
          <input
            name="tags"
            placeholder="ai, backend, architecture"
            className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35"
          />
          {parsedErrors.tags ? <p className="mt-1 text-xs text-red-700">{parsedErrors.tags}</p> : null}
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Category</span>
            <input
              name="category"
              className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35"
            />
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Series</span>
            <input
              name="series"
              className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35"
            />
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Reading time (min)</span>
            <input
              name="readingTime"
              type="number"
              min={1}
              className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35"
            />
            {parsedErrors.readingTime ? <p className="mt-1 text-xs text-red-700">{parsedErrors.readingTime}</p> : null}
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Published at</span>
            <input
              name="publishedAt"
              type="datetime-local"
              className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35"
            />
            {parsedErrors.publishedAt ? <p className="mt-1 text-xs text-red-700">{parsedErrors.publishedAt}</p> : null}
          </label>
        </div>

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

        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 font-mono text-sm text-white transition-opacity hover:opacity-90"
        >
          Create writing
        </button>
      </form>
    </main>
  );
}

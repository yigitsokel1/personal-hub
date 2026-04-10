import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAboutPageContent, saveAboutPageContent } from "@/lib/content-source/get-about-page";
import { parseAboutSectionsText, serializeAboutSectionsText } from "@/lib/domain/about-page/mapper";
import { validateAboutPageInput } from "@/lib/domain/about-page/validator";

async function saveAboutAction(formData: FormData): Promise<void> {
  "use server";

  const validated = validateAboutPageInput({
    title: String(formData.get("aboutTitle") ?? ""),
    intro: String(formData.get("aboutIntro") ?? ""),
    sections: parseAboutSectionsText(String(formData.get("aboutSections") ?? "")),
  });

  if (!validated.success) {
    const payload = encodeURIComponent(JSON.stringify(validated.errors));
    redirect(`/admin/about?status=error&errors=${payload}`);
  }

  await saveAboutPageContent(validated.value);
  revalidatePath("/about");
  redirect("/admin/about?status=saved");
}

export default async function AdminAboutPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; errors?: string }>;
}) {
  const params = await searchParams;
  const { value: about } = await getAboutPageContent();
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
      <h1 className="text-2xl font-semibold tracking-tight">About Page</h1>
      <p className="mt-2 text-sm text-black/60">Manage About page content in a dedicated editor.</p>
      <p className="mt-1 text-xs text-black/45">Fields marked with * are required.</p>
      {params.status === "saved" ? (
        <p className="mt-3 text-sm text-green-700">About page saved.</p>
      ) : null}
      {params.status === "error" ? (
        <p className="mt-3 text-sm text-red-700">Please fix the validation errors and save again.</p>
      ) : null}

      <form action={saveAboutAction} className="mt-8 space-y-5">
        <label className="block">
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">
            About title *
          </span>
          <input
            name="aboutTitle"
            defaultValue={about.title}
            className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35"
            required
          />
          {parsedErrors.title ? <p className="mt-1 text-xs text-red-700">{parsedErrors.title}</p> : null}
        </label>

        <label className="block">
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">
            About intro *
          </span>
          <textarea
            name="aboutIntro"
            defaultValue={about.intro}
            className="h-24 w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35"
            required
          />
          {parsedErrors.intro ? <p className="mt-1 text-xs text-red-700">{parsedErrors.intro}</p> : null}
        </label>

        <label className="block">
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">
            About sections (one per line: heading | body) *
          </span>
          <textarea
            name="aboutSections"
            defaultValue={serializeAboutSectionsText(about.sections)}
            className="h-36 w-full rounded-md border border-black/15 px-3 py-2 font-mono text-xs outline-none focus:border-black/35"
            required
          />
          {parsedErrors.sections ? <p className="mt-1 text-xs text-red-700">{parsedErrors.sections}</p> : null}
        </label>

        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 font-mono text-sm text-white transition-opacity hover:opacity-90"
        >
          Save about page
        </button>
      </form>
    </main>
  );
}

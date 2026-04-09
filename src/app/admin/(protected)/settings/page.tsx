import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSiteSettings, saveSiteSettings } from "@/lib/content-source/get-site-settings";
import { parseProductSignalsText, serializeProductSignalsText, validateSiteSettingsInput } from "@/lib/domain/site-settings/validator";

async function saveSettingsAction(formData: FormData): Promise<void> {
  "use server";

  const validated = validateSiteSettingsInput({
    heroTitle: String(formData.get("heroTitle") ?? ""),
    heroSubtitle: String(formData.get("heroSubtitle") ?? ""),
    productSignals: parseProductSignalsText(String(formData.get("productSignals") ?? "")),
    aboutShort: String(formData.get("aboutShort") ?? ""),
    footerIntro: String(formData.get("footerIntro") ?? ""),
    contactEmail: String(formData.get("contactEmail") ?? ""),
    githubUrl: String(formData.get("githubUrl") ?? ""),
    linkedinUrl: String(formData.get("linkedinUrl") ?? ""),
  });

  if (!validated.success) {
    const payload = encodeURIComponent(JSON.stringify(validated.errors));
    redirect(`/admin/settings?status=error&errors=${payload}`);
  }

  await saveSiteSettings(validated.value);
  revalidatePath("/");
  revalidatePath("/about");
  redirect("/admin/settings?status=saved");
}

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; errors?: string }>;
}) {
  const params = await searchParams;
  const { value: settings } = await getSiteSettings();
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
      <h1 className="text-2xl font-semibold tracking-tight">Site Settings</h1>
      <p className="mt-2 text-sm text-black/60">
        Manage homepage, about, and footer settings from a shared contract.
      </p>
      <p className="mt-1 text-xs text-black/45">
        Need runtime diagnostics? Open <a href="/admin/settings/content-health" className="underline">content health</a>.
      </p>
      <p className="mt-1 text-xs text-black/45">Fields marked with * are required.</p>
      {params.status === "saved" ? (
        <p className="mt-3 text-sm text-green-700">Settings saved. Public site reflects the saved state.</p>
      ) : null}
      {params.status === "error" ? (
        <p className="mt-3 text-sm text-red-700">Please fix the validation errors and save again.</p>
      ) : null}

      <form action={saveSettingsAction} className="mt-8 space-y-5">
        <label className="block">
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">
            Hero title *
          </span>
          <input
            name="heroTitle"
            defaultValue={settings.heroTitle}
            className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35"
            required
          />
          {parsedErrors.heroTitle ? <p className="mt-1 text-xs text-red-700">{parsedErrors.heroTitle}</p> : null}
        </label>

        <label className="block">
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">
            Hero subtitle *
          </span>
          <textarea
            name="heroSubtitle"
            defaultValue={settings.heroSubtitle}
            className="h-24 w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35"
            required
          />
          {parsedErrors.heroSubtitle ? <p className="mt-1 text-xs text-red-700">{parsedErrors.heroSubtitle}</p> : null}
        </label>

        <label className="block">
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">
            Product signals (one per line: label | detail) *
          </span>
          <textarea
            name="productSignals"
            defaultValue={serializeProductSignalsText(settings.productSignals)}
            className="h-36 w-full rounded-md border border-black/15 px-3 py-2 font-mono text-xs outline-none focus:border-black/35"
            required
          />
          {parsedErrors.productSignals ? <p className="mt-1 text-xs text-red-700">{parsedErrors.productSignals}</p> : null}
        </label>

        <label className="block">
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">
            About short *
          </span>
          <textarea
            name="aboutShort"
            defaultValue={settings.aboutShort}
            className="h-24 w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35"
            required
          />
          {parsedErrors.aboutShort ? <p className="mt-1 text-xs text-red-700">{parsedErrors.aboutShort}</p> : null}
        </label>

        <label className="block">
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">
            Footer intro *
          </span>
          <textarea
            name="footerIntro"
            defaultValue={settings.footerIntro}
            className="h-24 w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35"
            required
          />
          {parsedErrors.footerIntro ? <p className="mt-1 text-xs text-red-700">{parsedErrors.footerIntro}</p> : null}
        </label>

        <div className="grid gap-5 sm:grid-cols-3">
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">
              Contact email *
            </span>
            <input
              name="contactEmail"
              defaultValue={settings.contactEmail}
              className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35"
              required
            />
            {parsedErrors.contactEmail ? <p className="mt-1 text-xs text-red-700">{parsedErrors.contactEmail}</p> : null}
          </label>

          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">
              GitHub URL *
            </span>
            <input
              name="githubUrl"
              defaultValue={settings.githubUrl}
              className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35"
              required
            />
            {parsedErrors.githubUrl ? <p className="mt-1 text-xs text-red-700">{parsedErrors.githubUrl}</p> : null}
          </label>

          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">
              LinkedIn URL *
            </span>
            <input
              name="linkedinUrl"
              defaultValue={settings.linkedinUrl}
              className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35"
              required
            />
            {parsedErrors.linkedinUrl ? <p className="mt-1 text-xs text-red-700">{parsedErrors.linkedinUrl}</p> : null}
          </label>
        </div>

        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 font-mono text-sm text-white transition-opacity hover:opacity-90"
        >
          Save settings
        </button>
      </form>
    </main>
  );
}

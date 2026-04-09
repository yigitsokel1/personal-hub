import { redirect } from "next/navigation";
import { createAdminSession, isAdminAuthenticated, verifyAdminPassword } from "@/lib/admin/auth";

function toSafeNextPath(value: string): string | null {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return null;
  }
  return value;
}

async function loginAction(formData: FormData): Promise<void> {
  "use server";

  const password = String(formData.get("password") ?? "");
  const requestedNext = String(formData.get("next") ?? "");
  const nextPath = toSafeNextPath(requestedNext);
  if (!password) {
    redirect(`/admin/login?error=missing_password${nextPath ? `&next=${encodeURIComponent(nextPath)}` : ""}`);
  }

  let isValid = false;
  try {
    isValid = await verifyAdminPassword(password);
  } catch {
    redirect("/admin/login?error=auth_unavailable");
  }
  if (!isValid) {
    redirect(`/admin/login?error=invalid_password${nextPath ? `&next=${encodeURIComponent(nextPath)}` : ""}`);
  }

  try {
    await createAdminSession();
  } catch {
    redirect("/admin/login?error=auth_unavailable");
  }
  redirect(nextPath ?? "/admin/settings");
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  if (await isAdminAuthenticated()) {
    redirect("/admin/settings");
  }

  const params = await searchParams;
  const error = params.error;
  const nextPath = toSafeNextPath(String(params.next ?? ""));

  return (
    <main className="mx-auto max-w-xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Admin Login</h1>
      <p className="mt-3 text-sm text-black/60">
        Enter the admin password configured in environment variables.
      </p>
      {error ? (
        <p className="mt-3 text-sm text-red-700">
          {error === "invalid_password"
            ? "Invalid password."
            : error === "preview_auth_required"
              ? "Admin login is required to open preview links."
              : error === "auth_unavailable"
                ? "Admin auth is unavailable. Check admin auth environment variables."
                : "Password is required."}
        </p>
      ) : null}

      <form action={loginAction} className="mt-8 space-y-4">
        {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
        <label className="block">
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">
            Password
          </span>
          <input
            name="password"
            type="password"
            className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none transition-colors focus:border-black/35"
            autoComplete="current-password"
            required
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 font-mono text-sm text-white transition-opacity hover:opacity-90"
        >
          Sign in
        </button>
      </form>
    </main>
  );
}

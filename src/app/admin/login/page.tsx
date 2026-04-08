import { redirect } from "next/navigation";
import { createAdminSession, isAdminAuthenticated, verifyAdminPassword } from "@/lib/admin/auth";

async function loginAction(formData: FormData): Promise<void> {
  "use server";

  const password = String(formData.get("password") ?? "");
  if (!password) {
    redirect("/admin/login?error=missing_password");
  }

  const isValid = await verifyAdminPassword(password);
  if (!isValid) {
    redirect("/admin/login?error=invalid_password");
  }

  await createAdminSession();
  redirect("/admin/settings");
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdminAuthenticated()) {
    redirect("/admin/settings");
  }

  const error = (await searchParams).error;

  return (
    <main className="mx-auto max-w-xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Admin Login</h1>
      <p className="mt-3 text-sm text-black/60">
        Enter the admin password configured in environment variables.
      </p>
      {error ? (
        <p className="mt-3 text-sm text-red-700">
          {error === "invalid_password" ? "Invalid password." : "Password is required."}
        </p>
      ) : null}

      <form action={loginAction} className="mt-8 space-y-4">
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

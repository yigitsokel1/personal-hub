import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { LoginForm } from "./login-form";

function toSafeNextPath(value: string): string | null {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return null;
  }
  return value;
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
        Enter your admin password to continue.
      </p>
      <LoginForm nextPath={nextPath} initialError={error} />
    </main>
  );
}

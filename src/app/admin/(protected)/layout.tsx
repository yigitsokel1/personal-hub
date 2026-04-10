import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin/auth";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <header className="mb-8 flex items-center justify-between border-b border-black/10 pb-4">
        <nav className="flex items-center gap-4 font-mono text-sm text-black/60">
          <Link href="/admin/settings" className="hover:text-black">
            settings
          </Link>
          <Link href="/admin/about" className="hover:text-black">
            about
          </Link>
          <Link href="/admin/projects" className="hover:text-black">
            projects
          </Link>
          <Link href="/admin/work" className="hover:text-black">
            work
          </Link>
          <Link href="/admin/writing" className="hover:text-black">
            writing
          </Link>
          <Link href="/admin/labs" className="hover:text-black">
            labs
          </Link>
        </nav>
        <form action="/api/admin/logout" method="post">
          <button
            type="submit"
            className="rounded-md border border-black/15 px-3 py-1.5 font-mono text-xs text-black/70 hover:border-black/30 hover:text-black"
          >
            logout
          </button>
        </form>
      </header>
      {children}
    </div>
  );
}

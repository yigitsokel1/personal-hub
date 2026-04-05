import Link from "next/link";
import { homepageCopy } from "@/lib/content/homepage-copy";
import { SiteNav } from "@/components/layout/site-nav";

export function SiteHeader() {
  return (
    <header className="border-b border-black/[0.08] text-foreground">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-[1.125rem]">
        <Link
          href="/"
          className="shrink-0 text-sm font-medium tracking-tight text-foreground"
        >
          {homepageCopy.siteName}
        </Link>

        <SiteNav />
      </div>
    </header>
  );
}

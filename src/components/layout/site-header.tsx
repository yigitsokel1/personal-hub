import Link from "next/link";
import { SiteNav } from "@/components/layout/site-nav";
import { homepageCopy } from "@/lib/content/homepage-copy";
import { linkFocusVisibleClassName } from "@/lib/ui/link-tokens";

export function SiteHeader() {
  return (
    <header className="border-b border-black/8 text-foreground">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-6 py-3 sm:gap-x-6 sm:gap-y-3 sm:py-4">
        <Link
          href="/"
          aria-label={homepageCopy.siteName}
          className={`shrink-0 rounded-sm font-mono text-sm tracking-tight text-foreground ${linkFocusVisibleClassName}`}
        >
          ~/personal-hub
        </Link>

        <SiteNav />
      </div>
    </header>
  );
}

import Link from "next/link";
import { SiteNav } from "@/components/layout/site-nav";
import { getSiteSettings } from "@/lib/content-source/get-site-settings";
import { linkFocusVisibleClassName } from "@/lib/ui/link-tokens";

export async function SiteHeader() {
  const { value: settings } = await getSiteSettings();
  return (
    <header className="border-b border-black/8 text-foreground">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-6 py-3 sm:gap-x-6 sm:gap-y-3 sm:py-4">
        <Link
          href="/"
          aria-label={settings.brandLabel}
          className={`shrink-0 rounded-sm font-mono text-sm tracking-tight text-foreground ${linkFocusVisibleClassName}`}
        >
          {settings.brandLabel}
        </Link>

        <SiteNav />
      </div>
    </header>
  );
}

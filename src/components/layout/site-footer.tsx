import Link from "next/link";
import { shellSecondaryLinkClassName } from "@/lib/ui/shell-link";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/[0.08] text-foreground">
      <div className="mx-auto max-w-5xl space-y-2 px-6 py-8 sm:py-9">
        <p className="text-sm text-black/45">
          Built as a personal hub for projects, work, writing, and labs.
        </p>
        <p className="text-sm text-black/45">
          <Link href="/tags" className={shellSecondaryLinkClassName}>
            Browse by tag
          </Link>
        </p>
      </div>
    </footer>
  );
}

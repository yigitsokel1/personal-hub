import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/[0.08] text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-10 sm:py-11">
        <p className="text-sm text-foreground/45">
          Built as a personal hub for projects, work, writing, and labs.
        </p>
        <p className="mt-3 text-sm text-foreground/45">
          <Link
            href="/tags"
            className="underline decoration-black/15 underline-offset-4 transition-colors hover:text-foreground/70 hover:decoration-black/30"
          >
            Browse by tag
          </Link>
        </p>
      </div>
    </footer>
  );
}

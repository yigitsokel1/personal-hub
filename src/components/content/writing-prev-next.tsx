import Link from "next/link";
import { contentTitleLinkClassName } from "@/lib/ui/link-tokens";
import type { WritingNeighbor } from "@/lib/content/writing-neighbors";

type WritingPrevNextProps = {
  prev: WritingNeighbor | null;
  next: WritingNeighbor | null;
};

export function WritingPrevNext({ prev, next }: WritingPrevNextProps) {
  if (!prev && !next) return null;

  return (
    <nav
      className="mt-14 max-w-3xl border-t border-black/8 pt-8 sm:mt-16 sm:pt-10"
      aria-label="Article navigation"
    >
      <div className="grid gap-8 sm:grid-cols-2 sm:gap-8">
        <div>
          {prev ? (
            <div className="border-y border-black/6 py-3">
              <p className="font-mono text-sm text-black/45">
                Previous
              </p>
              <Link
                href={`/writing/${prev.slug}`}
                className={`mt-1 block text-lg font-medium tracking-tight transition-colors duration-200 hover:text-black/80 ${contentTitleLinkClassName}`}
              >
                {prev.title}
              </Link>
            </div>
          ) : null}
        </div>
        <div className="sm:flex sm:justify-end">
          {next ? (
            <div className="border-y border-black/6 py-3 text-left sm:text-right">
              <p className="font-mono text-sm text-black/45">
                Next
              </p>
              <Link
                href={`/writing/${next.slug}`}
                className={`mt-1 block text-lg font-medium tracking-tight transition-colors duration-200 hover:text-black/80 ${contentTitleLinkClassName}`}
              >
                {next.title}
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

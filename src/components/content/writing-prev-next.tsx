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
      className="mt-16 max-w-3xl border-t border-black/10 pt-10"
      aria-label="Article navigation"
    >
      <div className="grid gap-10 sm:grid-cols-2 sm:gap-8">
        <div>
          {prev ? (
            <div className="group/prev -mx-1 rounded-sm px-1 py-1 transition-[background-color] duration-200 ease-out hover:bg-black/[0.025] motion-reduce:transition-none">
              <p className="text-sm text-black/45 transition-colors duration-200 group-hover/prev:text-black/55">
                Previous
              </p>
              <Link
                href={`/writing/${prev.slug}`}
                className={`mt-1 block text-lg font-medium tracking-tight ${contentTitleLinkClassName}`}
              >
                {prev.title}
              </Link>
            </div>
          ) : null}
        </div>
        <div className="sm:flex sm:justify-end">
          {next ? (
            <div className="group/next -mx-1 rounded-sm px-1 py-1 text-left transition-[background-color] duration-200 ease-out hover:bg-black/[0.025] motion-reduce:transition-none sm:text-right">
              <p className="text-sm text-black/45 transition-colors duration-200 group-hover/next:text-black/55">
                Next
              </p>
              <Link
                href={`/writing/${next.slug}`}
                className={`mt-1 block text-lg font-medium tracking-tight ${contentTitleLinkClassName}`}
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

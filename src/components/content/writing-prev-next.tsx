import Link from "next/link";
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
            <>
              <p className="text-sm text-black/45">Previous</p>
              <Link
                href={`/writing/${prev.slug}`}
                className="mt-1 block text-lg font-medium tracking-tight text-foreground underline decoration-black/20 underline-offset-4 hover:decoration-black/45"
              >
                {prev.title}
              </Link>
            </>
          ) : null}
        </div>
        <div className="sm:text-right">
          {next ? (
            <>
              <p className="text-sm text-black/45">Next</p>
              <Link
                href={`/writing/${next.slug}`}
                className="mt-1 block text-lg font-medium tracking-tight text-foreground underline decoration-black/20 underline-offset-4 hover:decoration-black/45"
              >
                {next.title}
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

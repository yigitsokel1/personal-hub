import Link from "next/link";
import { shellSecondaryLinkClassName } from "@/lib/ui/link-tokens";

type DomainIndexEmptyProps = {
  /** Plural, lowercase, e.g. "projects", "writing pieces". */
  noun: string;
};

export function DomainIndexEmpty({ noun }: DomainIndexEmptyProps) {
  return (
    <div className="mt-12 max-w-3xl space-y-4 border-t border-black/10 pt-10">
      <p className="text-base leading-relaxed text-black/65">
        No published {noun} yet. Add MDX under{" "}
        <code className="text-sm">src/content/</code>.
      </p>
      <p>
        <Link href="/" className={shellSecondaryLinkClassName}>
          Back to home
        </Link>
      </p>
    </div>
  );
}

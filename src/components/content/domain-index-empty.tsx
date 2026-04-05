import Link from "next/link";

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
        <Link
          href="/"
          className="text-sm underline decoration-black/25 underline-offset-4 hover:decoration-black/50"
        >
          Back to home
        </Link>
      </p>
    </div>
  );
}

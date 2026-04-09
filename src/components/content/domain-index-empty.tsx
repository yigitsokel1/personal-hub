import Link from "next/link";
import { contentInlineLinkClassName } from "@/lib/ui/link-tokens";

type DomainIndexEmptyProps = {
  noun: string;
  href: string;
};

export function DomainIndexEmpty({ noun, href }: DomainIndexEmptyProps) {
  return (
    <div className="mt-12 max-w-3xl space-y-4 border-t border-black/10 pt-10">
      <p className="text-base leading-relaxed text-black/65">
        Nothing to show here yet.
      </p>
      <p>
        <Link href={href} className={contentInlineLinkClassName}>
          Explore {noun}
        </Link>
      </p>
    </div>
  );
}

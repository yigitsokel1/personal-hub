import type { ReactNode } from "react";
import Link from "next/link";
import { shellSecondaryLinkClassName } from "@/lib/ui/shell-link";

type HomeSectionProps = {
  title: string;
  viewAllHref: string;
  viewAllLabel: string;
  children: ReactNode;
};

export function HomeSection({
  title,
  viewAllHref,
  viewAllLabel,
  children,
}: HomeSectionProps) {
  return (
    <section className="mt-16 sm:mt-20">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <Link href={viewAllHref} className={`shrink-0 ${shellSecondaryLinkClassName}`}>
          {viewAllLabel}
        </Link>
      </div>
      <div className="mt-10 space-y-9">{children}</div>
    </section>
  );
}

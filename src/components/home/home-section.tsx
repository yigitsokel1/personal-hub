import type { ReactNode } from "react";
import Link from "next/link";

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
    <section className="mt-20 sm:mt-24">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <Link
          href={viewAllHref}
          className="shrink-0 text-sm text-black/55 underline decoration-black/20 underline-offset-4 hover:text-black/75 hover:decoration-black/40"
        >
          {viewAllLabel}
        </Link>
      </div>
      <div className="mt-8 space-y-10">{children}</div>
    </section>
  );
}

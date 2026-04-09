import type { ReactNode } from "react";
import Link from "next/link";
import { shellSecondaryLinkClassName } from "@/lib/ui/link-tokens";
import {
  TREE_PREFIX,
  ARROW,
  sectionLabelClassName,
} from "@/lib/ui/terminal-tokens";

type HomeSectionProps = {
  title: string;
  viewAllHref: string;
  viewAllLabel: string;
  density?: "default" | "compact";
  children: ReactNode;
};

export function HomeSection({
  title,
  viewAllHref,
  viewAllLabel,
  density = "default",
  children,
}: HomeSectionProps) {
  return (
    <section className={density === "compact" ? "mt-10 sm:mt-12 md:mt-14" : "mt-14 sm:mt-16 md:mt-20"}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className={sectionLabelClassName}>
          {TREE_PREFIX} {title.toUpperCase()}
        </h2>
        <Link
          href={viewAllHref}
          className={`shrink-0 ${shellSecondaryLinkClassName}`}
        >
          {viewAllLabel.toLowerCase()} {ARROW}
        </Link>
      </div>
      <div
        className={
          density === "compact"
            ? "mt-6 space-y-6 sm:mt-7 sm:space-y-7"
            : "mt-8 space-y-8 sm:mt-10 sm:space-y-9"
        }
      >
        {children}
      </div>
    </section>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";
import { ContentTagLink } from "@/components/content/content-tag-link";
import { contentTitleLinkClassName } from "@/lib/ui/link-tokens";

type ContentListItemProps = {
  variant: "list" | "card";
  title: string;
  href: string;
  summary?: string;
  meta: ReactNode;
  tags?: string[];
  featured?: boolean;
};

export function ContentListItem({
  variant,
  title,
  href,
  summary,
  meta,
  tags,
  featured = false,
}: ContentListItemProps) {
  const isCard = variant === "card";

  return (
    <article
      className={
        isCard
          ? "group/item h-full rounded-lg border border-black/10 p-6 min-h-60 transition-[border-color,box-shadow,transform] duration-200 ease-out hover:border-black/16 hover:shadow-[0_1px_0_0_rgba(0,0,0,0.035)] focus-within:border-black/16 focus-within:shadow-[0_1px_0_0_rgba(0,0,0,0.035)]"
          : "group/item border-b border-black/8 py-6 transition-[border-color,background-color] duration-200 ease-out hover:border-black/12 hover:bg-black/[0.012] focus-within:border-black/12"
      }
    >
      <div className={isCard ? "flex h-full flex-col" : undefined}>
        {featured && isCard ? (
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-black/45">
            Featured
          </p>
        ) : null}
        <div className={isCard ? "mt-2 max-h-12 overflow-hidden" : undefined}>{meta}</div>
        <h2
          className={
            isCard
              ? "mt-3 text-[1.6rem] font-medium leading-snug tracking-tight"
              : "mt-2 text-[1.45rem] font-medium leading-snug tracking-tight"
          }
        >
          <Link
            href={href}
            className={`${contentTitleLinkClassName} group-hover/item:decoration-black/50`}
          >
            <span className="line-clamp-2">{title}</span>
          </Link>
        </h2>
        {summary ? (
          <p className={`mt-3 text-base leading-relaxed text-black/72 ${isCard ? "line-clamp-3" : "line-clamp-2"}`}>
            {summary}
          </p>
        ) : null}
        {tags?.length ? (
          <div
            className={
              isCard
                ? "relative z-1 mt-auto flex max-h-10 flex-wrap gap-x-3 gap-y-1.5 overflow-hidden pt-3 sm:gap-y-1"
                : "relative z-1 mt-3 flex flex-wrap gap-x-3 gap-y-1.5 sm:gap-y-1"
            }
          >
            {tags.map((tag) => (
              <ContentTagLink key={tag} tag={tag} />
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

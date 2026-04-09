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
          ? "group/item rounded-lg border border-black/10 p-6 transition-[border-color,box-shadow] duration-200 ease-out hover:border-black/16 hover:shadow-[0_1px_0_0_rgba(0,0,0,0.035)] focus-within:border-black/16"
          : "group/item border-b border-black/8 py-6 transition-[border-color] duration-200 ease-out hover:border-black/12 focus-within:border-black/12"
      }
    >
      {featured && isCard ? (
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-black/45">
          Featured
        </p>
      ) : null}
      <div className={featured && isCard ? "mt-2" : undefined}>{meta}</div>
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
          {title}
        </Link>
      </h2>
      {summary ? <p className="mt-3 text-base leading-relaxed text-black/72">{summary}</p> : null}
      {tags?.length ? (
        <div className="relative z-1 mt-3 flex flex-wrap gap-x-3 gap-y-1.5 sm:gap-y-1">
          {tags.map((tag) => (
            <ContentTagLink key={tag} tag={tag} />
          ))}
        </div>
      ) : null}
    </article>
  );
}

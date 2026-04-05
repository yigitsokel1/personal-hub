import Link from "next/link";
import { ContentTagLink } from "@/components/content/content-tag-link";

type ContentListItemProps = {
  href: string;
  publishedAt: string;
  title: string;
  summary: string;
  tags?: string[];
  meta?: string[];
};

export function ContentListItem({
  href,
  publishedAt,
  title,
  summary,
  tags,
  meta,
}: ContentListItemProps) {
  return (
    <article className="border-b border-black/10 pb-8">
      <p className="text-sm text-black/50">{publishedAt}</p>
      {meta?.length ? (
        <p className="mt-1 text-sm text-black/45">{meta.join(" · ")}</p>
      ) : null}
      <h2 className="mt-2 text-2xl font-medium tracking-tight">
        <Link href={href} className="hover:text-black/70">
          {title}
        </Link>
      </h2>
      <p className="mt-2 text-base leading-relaxed text-black/75">{summary}</p>
      {tags?.length ? (
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
          {tags.map((tag) => (
            <ContentTagLink key={tag} tag={tag} />
          ))}
        </div>
      ) : null}
    </article>
  );
}

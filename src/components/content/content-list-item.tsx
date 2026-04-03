import Link from "next/link";

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
        <p className="mt-3 text-sm text-black/45">{tags.join(" · ")}</p>
      ) : null}
    </article>
  );
}

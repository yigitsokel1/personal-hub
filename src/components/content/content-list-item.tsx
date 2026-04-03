import Link from "next/link";

type ContentListItemProps = {
  href: string;
  publishedAt: string;
  title: string;
  summary: string;
};

export function ContentListItem({
  href,
  publishedAt,
  title,
  summary,
}: ContentListItemProps) {
  return (
    <article className="border-b pb-6">
      <p className="text-sm opacity-60">{publishedAt}</p>
      <h2 className="mt-2 text-2xl font-medium">
        <Link href={href} className="hover:opacity-80">
          {title}
        </Link>
      </h2>
      <p className="mt-2 text-base opacity-80">{summary}</p>
    </article>
  );
}

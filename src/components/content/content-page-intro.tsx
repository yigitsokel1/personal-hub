import { ContentTagLink } from "@/components/content/content-tag-link";
import { formatContentDate } from "@/lib/format-content-date";

type ContentPageIntroProps = {
  title: string;
  summary: string;
  publishedAt?: string;
  tags?: string[];
};

export function ContentPageIntro({
  title,
  summary,
  publishedAt,
  tags,
}: ContentPageIntroProps) {
  const dateLabel = publishedAt ? formatContentDate(publishedAt) : undefined;

  return (
    <header className="max-w-3xl">
      {dateLabel ? (
        <p className="text-sm uppercase tracking-[0.14em] text-black/50">
          {dateLabel}
        </p>
      ) : null}

      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
        {title}
      </h1>

      <p className="mt-5 text-lg leading-8 text-black/75">{summary}</p>

      {tags?.length ? (
        <div className="mt-6 flex flex-wrap gap-x-3 gap-y-1">
          {tags.map((tag) => (
            <ContentTagLink key={tag} tag={tag} />
          ))}
        </div>
      ) : null}
    </header>
  );
}

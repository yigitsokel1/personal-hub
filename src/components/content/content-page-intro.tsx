import { ContentCover } from "@/components/content/content-cover";
import { ContentTagLink } from "@/components/content/content-tag-link";
import type { BaseContent } from "@/lib/content/types";
import { formatContentDate } from "@/lib/format-content-date";

type ContentPageIntroProps = {
  title: string;
  summary: string;
  publishedAt?: string;
  /** Shown with date when set (e.g. writing). */
  category?: string;
  readingTime?: number;
  tags?: string[];
  cover?: BaseContent["cover"];
};

export function ContentPageIntro({
  title,
  summary,
  publishedAt,
  category,
  readingTime,
  tags,
  cover,
}: ContentPageIntroProps) {
  const dateLabel = publishedAt ? formatContentDate(publishedAt) : undefined;
  const metaParts: string[] = [];
  if (dateLabel) metaParts.push(dateLabel);
  if (category) metaParts.push(category);
  if (readingTime != null) metaParts.push(`${readingTime} min read`);

  return (
    <header className="max-w-3xl">
      {metaParts.length ? (
        <p className="flex flex-wrap items-center gap-x-2 text-sm leading-relaxed text-black/50">
          {metaParts.map((part, index) => (
            <span key={`${part}-${index}`}>
              {index > 0 ? <span aria-hidden="true"> · </span> : null}
              {part}
            </span>
          ))}
        </p>
      ) : null}

      {cover?.src ? (
        <ContentCover src={cover.src} alt={cover.alt} className="mt-8" />
      ) : null}

      <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        {title}
      </h1>

      <p className="mt-4 text-lg leading-relaxed text-black/75">{summary}</p>

      {tags?.length ? (
        <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1.5 sm:gap-y-1">
          {tags.map((tag) => (
            <ContentTagLink key={tag} tag={tag} />
          ))}
        </div>
      ) : null}
    </header>
  );
}

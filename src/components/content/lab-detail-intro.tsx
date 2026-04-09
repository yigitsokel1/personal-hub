import { ContentCover } from "@/components/content/content-cover";
import { ContentMeta } from "@/components/content/content-meta";
import { ContentTagLink } from "@/components/content/content-tag-link";
import { IntroDefinitionRow } from "@/components/content/intro-definition-row";
import type { BaseContent } from "@/lib/content/types";
import { formatContentDate } from "@/lib/format-content-date";

type LabDetailIntroProps = {
  title: string;
  summary: string;
  publishedAt: string;
  tags?: string[];
  cover?: BaseContent["cover"];
  status: "idea" | "exploring" | "building" | "paused" | "completed";
};

export function LabDetailIntro({
  title,
  summary,
  publishedAt,
  tags,
  cover,
  status,
}: LabDetailIntroProps) {
  const metaParts = [formatContentDate(publishedAt), `STATUS ${status.toUpperCase()}`];

  return (
    <header className="max-w-3xl">
      <ContentMeta items={metaParts.map((part) => ({ label: part, type: "text" as const }))} />

      {cover?.src ? (
        <ContentCover src={cover.src} alt={cover.alt} className="mt-8" />
      ) : null}

      <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        {title}
      </h1>

      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-black/72">{summary}</p>

      {tags?.length ? (
        <div className="mt-6 flex flex-wrap gap-x-3 gap-y-1.5 sm:gap-y-1">
          {tags.map((tag) => (
            <ContentTagLink key={tag} tag={tag} />
          ))}
        </div>
      ) : null}

      <dl className="mt-11 space-y-4 sm:mt-12">
        <IntroDefinitionRow label="Status">{status.toUpperCase()}</IntroDefinitionRow>
      </dl>
    </header>
  );
}

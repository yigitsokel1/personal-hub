import { ContentCover } from "@/components/content/content-cover";
import { ContentTagLink } from "@/components/content/content-tag-link";
import { IntroDefinitionRow } from "@/components/content/intro-definition-row";
import type { BaseContent, WorkContent } from "@/lib/content/types";
import { formatContentDate } from "@/lib/format-content-date";
import { formatEngagementType } from "@/lib/format-engagement-type";

type WorkDetailIntroProps = {
  title: string;
  summary: string;
  publishedAt: string;
  timeline?: string;
  tags?: string[];
  role: string;
  client: string;
  engagementType: WorkContent["engagementType"];
  cover?: BaseContent["cover"];
};

export function WorkDetailIntro({
  title,
  summary,
  publishedAt,
  timeline,
  tags,
  role,
  client,
  engagementType,
  cover,
}: WorkDetailIntroProps) {
  const publishedLabel = formatContentDate(publishedAt);
  const metaLine = timeline
    ? `${publishedLabel} · ${timeline}`
    : publishedLabel;

  return (
    <header className="max-w-3xl">
      <p className="text-sm text-black/50">{metaLine}</p>

      {cover?.src ? (
        <ContentCover src={cover.src} alt={cover.alt} className="mt-8" />
      ) : null}

      <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        {title}
      </h1>

      <p className="mt-4 text-lg leading-relaxed text-black/75">{summary}</p>

      {tags?.length ? (
        <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1">
          {tags.map((tag) => (
            <ContentTagLink key={tag} tag={tag} />
          ))}
        </div>
      ) : null}

      <dl className="mt-12 space-y-4">
        <IntroDefinitionRow label="Client">{client}</IntroDefinitionRow>
        <IntroDefinitionRow label="Engagement">
          {formatEngagementType(engagementType)}
        </IntroDefinitionRow>
        <IntroDefinitionRow label="Role">{role}</IntroDefinitionRow>
      </dl>
    </header>
  );
}

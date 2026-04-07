import { ContentCover } from "@/components/content/content-cover";
import { ContentTagLink } from "@/components/content/content-tag-link";
import { IntroDefinitionRow } from "@/components/content/intro-definition-row";
import type { BaseContent } from "@/lib/content/types";
import { formatContentDate } from "@/lib/format-content-date";
import { proseLinkClassName } from "@/lib/ui/link-tokens";

type ProjectDetailIntroProps = {
  title: string;
  summary: string;
  publishedAt: string;
  timeline?: string;
  tags?: string[];
  role: string;
  stack: string[];
  liveUrl?: string;
  repoUrl?: string;
  cover?: BaseContent["cover"];
};

export function ProjectDetailIntro({
  title,
  summary,
  publishedAt,
  timeline,
  tags,
  role,
  stack,
  liveUrl,
  repoUrl,
  cover,
}: ProjectDetailIntroProps) {
  const publishedLabel = formatContentDate(publishedAt);

  return (
    <header className="max-w-3xl">
      <p className="text-sm text-black/50">
        {publishedLabel}
        {timeline ? ` · ${timeline}` : ""}
      </p>

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
        <IntroDefinitionRow label="Role">{role}</IntroDefinitionRow>
        <IntroDefinitionRow label="Stack">{stack.join(" · ")}</IntroDefinitionRow>
        {liveUrl || repoUrl ? (
          <IntroDefinitionRow label="Links">
            <span className="flex flex-wrap gap-x-4 gap-y-2">
              {liveUrl ? (
                <a
                  href={liveUrl}
                  className={proseLinkClassName}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Live
                </a>
              ) : null}
              {repoUrl ? (
                <a
                  href={repoUrl}
                  className={proseLinkClassName}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Repository
                </a>
              ) : null}
            </span>
          </IntroDefinitionRow>
        ) : null}
      </dl>
    </header>
  );
}

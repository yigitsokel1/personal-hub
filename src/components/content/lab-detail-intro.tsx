import { ContentCover } from "@/components/content/content-cover";
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
  experimentType: string;
  maturityLevel?: "idea" | "poc" | "exploration";
  tools: string[];
  hypothesis?: string;
};

export function LabDetailIntro({
  title,
  summary,
  publishedAt,
  tags,
  cover,
  experimentType,
  maturityLevel,
  tools,
  hypothesis,
}: LabDetailIntroProps) {
  return (
    <header className="max-w-3xl">
      <p className="text-sm leading-relaxed text-black/50">
        {formatContentDate(publishedAt)}
      </p>

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

      <dl className="mt-10 space-y-4 sm:mt-12">
        <IntroDefinitionRow label="Maturity">
          {(maturityLevel ?? "exploration").toUpperCase()}
        </IntroDefinitionRow>
        <IntroDefinitionRow label="Experiment">{experimentType}</IntroDefinitionRow>
        {tools.length ? (
          <IntroDefinitionRow label="Tools">
            <span className="leading-relaxed">{tools.join(" · ")}</span>
          </IntroDefinitionRow>
        ) : null}
        {hypothesis ? (
          <IntroDefinitionRow label="Hypothesis">
            <span className="leading-relaxed">{hypothesis}</span>
          </IntroDefinitionRow>
        ) : null}
      </dl>
    </header>
  );
}

import type { ReactNode } from "react";
import { ContentTagLink } from "@/components/content/content-tag-link";
import type { WorkContent } from "@/lib/content/types";
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
};

function IntroRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4">
      <dt className="text-sm text-black/45">{label}</dt>
      <dd className="text-sm text-black/80">{children}</dd>
    </div>
  );
}

export function WorkDetailIntro({
  title,
  summary,
  publishedAt,
  timeline,
  tags,
  role,
  client,
  engagementType,
}: WorkDetailIntroProps) {
  const publishedLabel = formatContentDate(publishedAt);

  return (
    <header className="max-w-3xl">
      {timeline ? (
        <p className="text-sm text-black/50">{timeline}</p>
      ) : null}
      <p className={`text-sm text-black/50 ${timeline ? "mt-1.5" : ""}`}>
        Published {publishedLabel}
      </p>

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
        <IntroRow label="Client">{client}</IntroRow>
        <IntroRow label="Engagement">
          {formatEngagementType(engagementType)}
        </IntroRow>
        <IntroRow label="Role">{role}</IntroRow>
      </dl>
    </header>
  );
}

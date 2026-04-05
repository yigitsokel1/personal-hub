import type { ReactNode } from "react";
import { ContentTagLink } from "@/components/content/content-tag-link";
import { formatContentDate } from "@/lib/format-content-date";

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
};

function IntroRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4">
      <dt className="text-sm text-black/45">{label}</dt>
      <dd className="text-sm text-black/80">{children}</dd>
    </div>
  );
}

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
}: ProjectDetailIntroProps) {
  const publishedLabel = formatContentDate(publishedAt);

  return (
    <header className="max-w-3xl">
      <p className="text-sm text-black/50">
        {publishedLabel}
        {timeline ? ` · ${timeline}` : ""}
      </p>

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

      <dl className="mt-10 space-y-4 border-t border-black/10 pt-8">
        <IntroRow label="Role">{role}</IntroRow>
        <IntroRow label="Stack">{stack.join(" · ")}</IntroRow>
        {liveUrl || repoUrl ? (
          <IntroRow label="Links">
            <span className="flex flex-wrap gap-x-4 gap-y-2">
              {liveUrl ? (
                <a
                  href={liveUrl}
                  className="underline decoration-black/25 underline-offset-4 hover:decoration-black/50"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Live
                </a>
              ) : null}
              {repoUrl ? (
                <a
                  href={repoUrl}
                  className="underline decoration-black/25 underline-offset-4 hover:decoration-black/50"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Repository
                </a>
              ) : null}
            </span>
          </IntroRow>
        ) : null}
      </dl>
    </header>
  );
}

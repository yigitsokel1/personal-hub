import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ContentBody } from "@/components/content/content-body";
import { ContentDetailMain } from "@/components/content/content-detail-main";
import { ContentPageIntro } from "@/components/content/content-page-intro";
import { LabDetailIntro } from "@/components/content/lab-detail-intro";
import { ProjectDetailIntro } from "@/components/content/project-detail-intro";
import { RelatedContentLinks } from "@/components/content/related-content-links";
import { WorkDetailIntro } from "@/components/content/work-detail-intro";
import { WritingPrevNext } from "@/components/content/writing-prev-next";
import { CONTENT_PATH_PREFIX } from "@/lib/content/config";
import { getPreviewBySlug, type PreviewDomain } from "@/lib/content-source/get-preview-by-slug";
import { getRelatedLabs } from "@/lib/content-source/get-labs";
import { getRelatedProjects } from "@/lib/content-source/get-projects";
import { getRelatedWork } from "@/lib/content-source/get-work";
import { getRelatedWriting, getWritingNeighbors } from "@/lib/content-source/get-writing";
import { isAdminAuthenticated } from "@/lib/admin/auth";

type PreviewPageProps = {
  params: Promise<{ domain: string; slug: string }>;
};

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

function isPreviewDomain(value: string): value is PreviewDomain {
  return value === "writing" || value === "projects" || value === "work" || value === "labs";
}

function PreviewBanner({ state }: { state: "Draft" | "Published" }) {
  return (
    <div className="mb-6 rounded-md border border-amber-800/20 bg-amber-50 px-3 py-2 text-xs text-amber-900/85">
      Preview mode - not publicly visible. State: {state}
    </div>
  );
}

export default async function PreviewDetailPage({ params }: PreviewPageProps) {
  const { domain, slug } = await params;

  if (!(await isAdminAuthenticated())) {
    const nextPath = `/preview/${domain}/${slug}`;
    redirect(`/admin/login?error=preview_auth_required&next=${encodeURIComponent(nextPath)}`);
  }

  if (!isPreviewDomain(domain)) {
    notFound();
  }

  const item = await getPreviewBySlug(domain, slug);
  if (!item) {
    notFound();
  }

  const state: "Draft" | "Published" = item.status === "published" ? "Published" : "Draft";

  if (item.type === "writing") {
    const related = await getRelatedWriting(slug, item.tags);
    const relatedLinks = related.map((r) => ({
      href: `${CONTENT_PATH_PREFIX.writing}/${r.slug}`,
      title: r.title,
    }));
    const neighbors = await getWritingNeighbors(slug);

    return (
      <ContentDetailMain>
        <PreviewBanner state={state} />
        <ContentPageIntro
          title={item.title}
          summary={item.summary}
          publishedAt={item.publishedAt}
          category={item.category}
          readingTime={item.readingTime}
          tags={item.tags}
          cover={item.cover}
        />
        <ContentBody body={item.body} context={{ domain: "writing", slug: item.slug, isPreview: true }} />
        <WritingPrevNext prev={neighbors.prev} next={neighbors.next} />
        <RelatedContentLinks
          heading="Related writing"
          items={relatedLinks}
          emptyMessage="No other writing shares these tags yet."
          sectionHref="/writing"
          sectionLinkLabel="Browse all writing"
        />
      </ContentDetailMain>
    );
  }

  if (item.type === "project") {
    const related = await getRelatedProjects(slug, item.tags);
    const relatedLinks = related.map((r) => ({
      href: `${CONTENT_PATH_PREFIX.project}/${r.slug}`,
      title: r.title,
    }));
    const architectureHighlights = item.architectureHighlights?.filter(Boolean) ?? [];
    const outcomes = item.outcomes?.filter(Boolean) ?? [];
    const showHighlights = architectureHighlights.length >= 2 || outcomes.length >= 2;

    return (
      <ContentDetailMain>
        <PreviewBanner state={state} />
        <ProjectDetailIntro
          title={item.title}
          summary={item.summary}
          publishedAt={item.publishedAt}
          timeline={item.timeline}
          tags={item.tags}
          role={item.role}
          stack={item.stack}
          liveUrl={item.liveUrl}
          repoUrl={item.repoUrl}
          cover={item.cover}
        />
        {showHighlights ? (
          <section className="mt-10 max-w-3xl border-l border-black/10 pl-4 sm:mt-12 sm:pl-5">
            <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-black/50">
              Architecture highlights
            </h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-black/75">
              {architectureHighlights.length ? <p>{architectureHighlights.slice(0, 3).join(" ")}</p> : null}
              {outcomes.length ? <p>{outcomes.slice(0, 3).join(" ")}</p> : null}
            </div>
          </section>
        ) : null}
        <ContentBody body={item.body} context={{ domain: "projects", slug: item.slug, isPreview: true }} />
        <RelatedContentLinks
          heading="Related projects"
          items={relatedLinks}
          emptyMessage="No other projects share these tags yet."
          sectionHref="/projects"
          sectionLinkLabel="Browse all projects"
        />
      </ContentDetailMain>
    );
  }

  if (item.type === "work") {
    const related = await getRelatedWork(slug, item.tags);
    const relatedLinks = related.map((r) => ({
      href: `${CONTENT_PATH_PREFIX.work}/${r.slug}`,
      title: r.title,
    }));

    return (
      <ContentDetailMain>
        <PreviewBanner state={state} />
        <WorkDetailIntro
          title={item.title}
          summary={item.summary}
          publishedAt={item.publishedAt}
          timeline={item.timeline}
          tags={item.tags}
          role={item.role}
          client={item.client}
          engagementType={item.engagementType}
          confidentialityLevel={item.confidentialityLevel}
          scope={item.scope}
          impact={item.impact}
          cover={item.cover}
        />
        <ContentBody body={item.body} context={{ domain: "work", slug: item.slug, isPreview: true }} />
        <RelatedContentLinks
          heading="Related work"
          items={relatedLinks}
          emptyMessage="No other work shares these tags yet."
          sectionHref="/work"
          sectionLinkLabel="Browse all work"
        />
      </ContentDetailMain>
    );
  }

  const related = await getRelatedLabs(slug, item.tags);
  const relatedLinks = related.map((r) => ({
    href: `${CONTENT_PATH_PREFIX.lab}/${r.slug}`,
    title: r.title,
  }));

  return (
    <ContentDetailMain>
      <PreviewBanner state={state} />
      <LabDetailIntro
        title={item.title}
        summary={item.summary}
        publishedAt={item.publishedAt}
        tags={item.tags}
        cover={item.cover}
        status={item.status}
      />
      <p className="mt-8 max-w-3xl text-sm leading-relaxed text-black/55 sm:mt-10">
        Exploration note: this page captures an active experiment, so outcomes may
        be partial while the direction evolves.
      </p>
      <ContentBody body={item.body} context={{ domain: "labs", slug: item.slug, isPreview: true }} />
      <RelatedContentLinks
        heading="Related labs"
        items={relatedLinks}
        emptyMessage="No other labs share these tags yet."
        sectionHref="/labs"
        sectionLinkLabel="Browse all labs"
      />
    </ContentDetailMain>
  );
}

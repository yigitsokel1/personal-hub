import type { Metadata } from "next";
import Link from "next/link";
import { ContentListItem } from "@/components/content/content-list-item";
import { HomeHero } from "@/components/home/home-hero";
import { HomeSection } from "@/components/home/home-section";
import { homepageCopy } from "@/lib/content/homepage-copy";
import { getAllContent, getFeaturedContent } from "@/lib/content/get-content";
import { formatContentDate } from "@/lib/format-content-date";
import { formatEngagementType } from "@/lib/format-engagement-type";

const PREVIEW_LIMIT = 3;

export const metadata: Metadata = {
  title: { absolute: homepageCopy.siteTitle },
  description: homepageCopy.siteDescription,
  openGraph: {
    title: homepageCopy.siteTitle,
    description: homepageCopy.siteDescription,
    url: "/",
  },
};

export default function HomePage() {
  const featuredWork = getFeaturedContent("work").slice(0, PREVIEW_LIMIT);
  const featuredProjects = getFeaturedContent("project").slice(0, PREVIEW_LIMIT);
  const latestWriting = getAllContent("writing").slice(0, PREVIEW_LIMIT);
  const featuredLabs = getFeaturedContent("lab");
  const labsPreview = (
    featuredLabs.length > 0 ? featuredLabs : getAllContent("lab")
  ).slice(0, PREVIEW_LIMIT);

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <HomeHero />

      {featuredWork.length > 0 ? (
        <HomeSection
          title={homepageCopy.sections.featuredWork.title}
          viewAllHref={homepageCopy.sections.featuredWork.viewAllHref}
          viewAllLabel={homepageCopy.sections.featuredWork.viewAllLabel}
        >
          {featuredWork.map((item) => (
            <ContentListItem
              key={item.id}
              href={`/work/${item.slug}`}
              publishedAt={formatContentDate(item.publishedAt)}
              title={item.title}
              summary={item.summary}
              tags={item.tags}
              meta={[
                item.client,
                formatEngagementType(item.engagementType),
                item.role,
              ]}
            />
          ))}
        </HomeSection>
      ) : null}

      {featuredProjects.length > 0 ? (
        <HomeSection
          title={homepageCopy.sections.featuredProjects.title}
          viewAllHref={homepageCopy.sections.featuredProjects.viewAllHref}
          viewAllLabel={homepageCopy.sections.featuredProjects.viewAllLabel}
        >
          {featuredProjects.map((project) => (
            <ContentListItem
              key={project.id}
              href={`/projects/${project.slug}`}
              publishedAt={formatContentDate(project.publishedAt)}
              title={project.title}
              summary={project.summary}
              tags={project.tags}
              meta={[
                project.role,
                project.stack.slice(0, 3).join(", "),
              ].filter(Boolean)}
            />
          ))}
        </HomeSection>
      ) : null}

      {latestWriting.length > 0 ? (
        <HomeSection
          title={homepageCopy.sections.writing.title}
          viewAllHref={homepageCopy.sections.writing.viewAllHref}
          viewAllLabel={homepageCopy.sections.writing.viewAllLabel}
        >
          {latestWriting.map((item) => {
            const meta: string[] = [];
            if (item.category) meta.push(item.category);
            if (item.readingTime != null)
              meta.push(`${item.readingTime} min read`);

            return (
              <ContentListItem
                key={item.id}
                href={`/writing/${item.slug}`}
                publishedAt={formatContentDate(item.publishedAt)}
                title={item.title}
                summary={item.summary}
                tags={item.tags}
                meta={meta.length ? meta : undefined}
              />
            );
          })}
        </HomeSection>
      ) : null}

      {labsPreview.length > 0 ? (
        <HomeSection
          title={homepageCopy.sections.labs.title}
          viewAllHref={homepageCopy.sections.labs.viewAllHref}
          viewAllLabel={homepageCopy.sections.labs.viewAllLabel}
        >
          {labsPreview.map((lab) => (
            <ContentListItem
              key={lab.id}
              href={`/labs/${lab.slug}`}
              publishedAt={formatContentDate(lab.publishedAt)}
              title={lab.title}
              summary={lab.summary}
              tags={lab.tags}
              meta={[
                lab.experimentType,
                lab.maturityLevel
                  ? lab.maturityLevel.toUpperCase()
                  : undefined,
              ].filter(Boolean) as string[]}
            />
          ))}
        </HomeSection>
      ) : null}

      <section className="mt-20 max-w-2xl sm:mt-24">
        <h2 className="text-xl font-semibold tracking-tight">
          {homepageCopy.sections.about.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-black/75">
          {homepageCopy.compactAbout}
        </p>
        <p className="mt-4">
          <Link
            href={homepageCopy.sections.about.href}
            className="text-sm text-black/55 underline decoration-black/20 underline-offset-4 hover:text-black/75 hover:decoration-black/40"
          >
            {homepageCopy.sections.about.linkLabel}
          </Link>
        </p>
      </section>

      <p className="mt-16 text-base">
        <Link
          href={homepageCopy.cta.href}
          className="font-medium text-foreground underline decoration-black/25 underline-offset-4 hover:decoration-black/50"
        >
          {homepageCopy.cta.label}
        </Link>
      </p>
    </main>
  );
}

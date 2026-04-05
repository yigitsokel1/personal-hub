import type { Metadata } from "next";
import Link from "next/link";
import { ContentListItem } from "@/components/content/content-list-item";
import { HomeHero } from "@/components/home/home-hero";
import { HomeSection } from "@/components/home/home-section";
import { homepageCopy } from "@/lib/content/homepage-copy";
import { getFeaturedContent, getPublishedContent } from "@/lib/content/get-content";
import { homepageSections } from "@/lib/content/homepage-sections";
import { formatContentDate } from "@/lib/format-content-date";
import { formatEngagementType } from "@/lib/format-engagement-type";
import { buildWebSiteJsonLd } from "@/lib/seo/json-ld";

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
  const webSiteLd = buildWebSiteJsonLd();
  const featuredWork = getFeaturedContent("work").slice(0, PREVIEW_LIMIT);
  const featuredProjects = getFeaturedContent("project").slice(0, PREVIEW_LIMIT);
  const latestWriting = getPublishedContent("writing").slice(0, PREVIEW_LIMIT);
  const featuredLabs = getFeaturedContent("lab");
  const labsPreview = (
    featuredLabs.length > 0 ? featuredLabs : getPublishedContent("lab")
  ).slice(0, PREVIEW_LIMIT);

  return (
    <>
      {webSiteLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteLd) }}
        />
      ) : null}
      <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <HomeHero />

        {homepageSections.featuredWork && featuredWork.length > 0 ? (
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

        {homepageSections.featuredProjects && featuredProjects.length > 0 ? (
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

        {homepageSections.writing && latestWriting.length > 0 ? (
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

        {homepageSections.labs && labsPreview.length > 0 ? (
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

        {homepageSections.about ? (
          <section className="mt-16 max-w-2xl sm:mt-20">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {homepageCopy.sections.about.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-black/75">
              {homepageCopy.compactAbout}
            </p>
            <p className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <Link
                href={homepageCopy.sections.about.href}
                className="text-sm text-black/45 underline decoration-black/15 underline-offset-4 hover:text-black/65 hover:decoration-black/30"
              >
                {homepageCopy.sections.about.linkLabel}
              </Link>
              <Link
                href={homepageCopy.cta.href}
                className="text-sm text-black/45 underline decoration-black/15 underline-offset-4 hover:text-black/65 hover:decoration-black/30"
              >
                {homepageCopy.cta.label}
              </Link>
            </p>
          </section>
        ) : null}
      </main>
    </>
  );
}

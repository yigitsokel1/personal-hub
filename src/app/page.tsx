import type { Metadata } from "next";
import Link from "next/link";
import { HomeHero } from "@/components/home/home-hero";
import { HomeSection } from "@/components/home/home-section";
import { SectionReveal } from "@/components/ui/section-reveal";
import { homepageCopy } from "@/lib/content/homepage-copy";
import { getPublishedProjects } from "@/lib/content-source/get-projects";
import { getSiteSettings } from "@/lib/content-source/get-site-settings";
import { getPublishedLabs } from "@/lib/content-source/get-labs";
import { getPublishedWork } from "@/lib/content-source/get-work";
import { getPublishedWriting } from "@/lib/content-source/get-writing";
import { homepageSections } from "@/lib/content/homepage-sections";
import { formatContentYearMonth } from "@/lib/format-content-date";
import { formatEngagementType } from "@/lib/format-engagement-type";
import { buildHomepageSelection } from "@/lib/content-intelligence/homepage-selection";
import { CONTENT_PATH_PREFIX } from "@/lib/content/config";
import { buildWebSiteJsonLd } from "@/lib/seo/json-ld";
import {
  getDefaultOgImageAbsolute,
  getSiteMetadataBase,
} from "@/lib/seo/build-metadata";
import {
  TREE_PREFIX,
  ARROW,
  sectionLabelClassName,
  terminalButtonClassName,
  cardIndex,
} from "@/lib/ui/terminal-tokens";
import {
  shellSecondaryLinkClassName,
  homeCardClassName,
  homeWritingRowClassName,
} from "@/lib/ui/link-tokens";

const siteBase = getSiteMetadataBase();
const homeOgUrl = siteBase ? new URL("/", siteBase).toString() : "/";
const defaultShare = siteBase ? getDefaultOgImageAbsolute(siteBase) : null;

export const metadata: Metadata = {
  title: { absolute: homepageCopy.siteTitle },
  description: homepageCopy.siteDescription,
  ...(siteBase ? { alternates: { canonical: homeOgUrl } } : {}),
  openGraph: {
    title: homepageCopy.siteTitle,
    description: homepageCopy.siteDescription,
    url: homeOgUrl,
    ...(defaultShare
      ? {
          images: [
            {
              url: defaultShare.url,
              width: defaultShare.width,
              height: defaultShare.height,
            },
          ],
        }
      : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: homepageCopy.siteTitle,
    description: homepageCopy.siteDescription,
    ...(defaultShare ? { images: [defaultShare.url] } : {}),
  },
};

export default async function HomePage() {
  const webSiteLd = buildWebSiteJsonLd();
  const { value: settings } = await getSiteSettings();
  const { value: allWork } = await getPublishedWork();
  const { value: allProjects } = await getPublishedProjects();
  const { value: allWriting } = await getPublishedWriting();
  const { value: allLabs } = await getPublishedLabs();
  const selection = buildHomepageSelection({
    writing: allWriting,
    projects: allProjects,
    work: allWork,
    labs: allLabs,
  });
  const featuredWork = selection.featuredWork;
  const featuredProjects = selection.featuredProjects;
  const writingItems = [...selection.featuredWriting, ...selection.domainHighlights.writing];
  const latestLabs = selection.domainHighlights.labs;
  const isSingleWork = featuredWork.length === 1;
  const isSingleProject = featuredProjects.length === 1;
  const hasHomepageContent =
    featuredWork.length > 0 ||
    featuredProjects.length > 0 ||
    writingItems.length > 0 ||
    latestLabs.length > 0;

  return (
    <>
      {webSiteLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteLd) }}
        />
      ) : null}
      <main className="mx-auto max-w-5xl px-6 py-16 sm:py-20 lg:py-24">
        <div className="border-b border-black/6 pb-12 sm:pb-16 lg:pb-20">
          <HomeHero title={settings.heroTitle} subtitle={settings.heroSubtitle} />
        </div>

        {!hasHomepageContent ? (
          <SectionReveal>
            <section className="mt-12 max-w-3xl border-t border-black/8 pt-8 sm:mt-14 sm:pt-10">
              <p className={sectionLabelClassName}>{TREE_PREFIX} UPDATES</p>
              <p className="mt-3 text-base leading-relaxed text-black/62">
                New projects and writing are being prepared. Explore the current archive.
              </p>
              <p className="mt-4">
                <Link href="/projects" className={shellSecondaryLinkClassName}>
                  view all projects {ARROW}
                </Link>
              </p>
            </section>
          </SectionReveal>
        ) : null}

        {homepageSections.featuredWork && featuredWork.length > 0 ? (
          <SectionReveal>
            <HomeSection
              title={homepageCopy.sections.featuredWork.title}
              viewAllHref={homepageCopy.sections.featuredWork.viewAllHref}
              viewAllLabel={homepageCopy.sections.featuredWork.viewAllLabel}
            >
              <div className={isSingleWork ? "max-w-3xl" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"}>
                {featuredWork.map((item, i) => (
                  <Link
                    key={item.id}
                    href={`/work/${item.slug}`}
                    className={`${homeCardClassName} ${isSingleWork ? "px-6 py-6 sm:px-7" : "p-5"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-black/35">
                        {cardIndex(i + 1)}
                      </span>
                      <span className="font-mono text-sm text-black/35 transition-transform duration-200 group-hover:translate-x-0.5">
                        {ARROW}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-medium tracking-tight sm:text-xl">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 font-mono text-sm text-black/50">
                      {[
                        item.client,
                        formatEngagementType(item.engagementType),
                      ]
                        .filter(Boolean)
                        .join(" \u00b7 ")}
                    </p>
                    <p className="mt-1 font-mono text-sm text-black/40">
                      {item.role}
                    </p>
                  </Link>
                ))}
              </div>
            </HomeSection>
          </SectionReveal>
        ) : null}

        {homepageSections.featuredProjects && featuredProjects.length > 0 ? (
          <SectionReveal>
            <HomeSection
              title={homepageCopy.sections.featuredProjects.title}
              viewAllHref={homepageCopy.sections.featuredProjects.viewAllHref}
              viewAllLabel={homepageCopy.sections.featuredProjects.viewAllLabel}
            >
              <div className={isSingleProject ? "max-w-3xl" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"}>
                {featuredProjects.map((project, i) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.slug}`}
                    className={`${homeCardClassName} ${isSingleProject ? "px-6 py-6 sm:px-7" : "p-5"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-black/35">
                        {cardIndex(i + 1)}
                      </span>
                      <span className="font-mono text-sm text-black/35 transition-transform duration-200 group-hover:translate-x-0.5">
                        {ARROW}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-medium tracking-tight sm:text-xl">
                      {project.title}
                    </h3>
                    <p className="mt-1.5 font-mono text-sm text-black/50">
                      {(project.tags ?? []).slice(0, 2).join(" \u00b7 ")}
                    </p>
                    <p className="mt-1 font-mono text-sm text-black/40">
                      {[
                        project.role,
                        project.stack.slice(0, 2).join(", "),
                      ]
                        .filter(Boolean)
                        .join(" \u00b7 ")}
                    </p>
                  </Link>
                ))}
              </div>
            </HomeSection>
          </SectionReveal>
        ) : null}

        {homepageSections.writing && writingItems.length > 0 ? (
          <SectionReveal>
            <HomeSection
              title={homepageCopy.sections.writing.title}
              viewAllHref={homepageCopy.sections.writing.viewAllHref}
              viewAllLabel={homepageCopy.sections.writing.viewAllLabel}
              density="compact"
            >
              <div className="space-y-1.5">
                {writingItems.map((item) => {
                  const monoDate = formatContentYearMonth(item.publishedAt);

                  return (
                    <Link
                      key={item.id}
                      href={`/writing/${item.slug}`}
                      className={homeWritingRowClassName}
                    >
                      <span className="text-base font-medium tracking-tight sm:text-[1.05rem]">
                        {item.title}
                      </span>
                      <span className="ml-4 shrink-0 font-mono text-sm text-black/40">
                        {monoDate}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </HomeSection>
          </SectionReveal>
        ) : null}

        <SectionReveal>
          <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-14 w-screen bg-terminal-bg py-12 text-white sm:mt-16 sm:py-16">
            <div className="mx-auto max-w-5xl px-6">
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-white/50">
                {TREE_PREFIX} ENGINEERING SIGNALS
              </p>
              <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6">
                {settings.productSignals.map((signal) => (
                  <div key={signal.label}>
                    <p className="font-mono text-sm text-white/65">{signal.label}</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">
                      {signal.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </SectionReveal>

        {homepageSections.labs ? (
          <SectionReveal>
            <section className="mt-12 sm:mt-14 md:mt-16">
              <p className={sectionLabelClassName}>
                {TREE_PREFIX} {homepageCopy.sections.labs.title.toUpperCase()}
              </p>
              <div className="mt-4 border-l-2 border-foreground pl-6">
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Labs and Experiments
                </h2>
                <p className="mt-3 max-w-lg text-base leading-relaxed text-black/62">
                  Fast experiments, architecture spikes, and technical notes in
                  progress.
                </p>
                {latestLabs.length > 0 ? (
                  <div className="mt-5 space-y-2.5">
                    {latestLabs.map((item) => (
                      <Link
                        key={item.id}
                        href={`/labs/${item.slug}`}
                        className="block font-mono text-sm text-black/58 transition-colors duration-200 ease-out hover:text-black/80"
                      >
                        {ARROW} {item.title}
                      </Link>
                    ))}
                  </div>
                ) : null}
                <Link
                  href={homepageCopy.sections.labs.viewAllHref}
                  className={`${terminalButtonClassName} mt-6`}
                >
                  {ARROW} {homepageCopy.sections.labs.viewAllLabel.toLowerCase()}
                </Link>
              </div>
            </section>
          </SectionReveal>
        ) : null}

        {homepageSections.about ? (
          <SectionReveal>
            <section className="mt-14 max-w-3xl sm:mt-16">
              <h2 className={sectionLabelClassName}>
                {TREE_PREFIX}{" "}
                {homepageCopy.sections.about.title.toUpperCase()}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-black/75">
                {settings.aboutShort}
              </p>
              <p className="mt-5">
                <Link
                  href={homepageCopy.sections.about.href}
                  className={shellSecondaryLinkClassName}
                >
                  {homepageCopy.sections.about.linkLabel.toLowerCase()} {ARROW}
                </Link>
              </p>
            </section>
          </SectionReveal>
        ) : null}

        <SectionReveal>
          <section className="mt-12 border-t border-black/8 pt-6 sm:mt-14 sm:pt-8">
            <p className="font-mono text-sm text-black/50">
              {TREE_PREFIX} next
            </p>
            <p className="mt-2">
              <Link
                href={homepageCopy.cta.href}
                className={shellSecondaryLinkClassName}
              >
                {homepageCopy.cta.label.toLowerCase()} {ARROW}
              </Link>
            </p>
          </section>
        </SectionReveal>
      </main>
    </>
  );
}

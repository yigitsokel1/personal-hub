import type { Metadata } from "next";
import { homepageCopy } from "@/lib/content/homepage-copy";
import { getSiteSettings } from "@/lib/content-source/get-site-settings";
import { buildSimplePageMetadata } from "@/lib/seo/build-metadata";
import { buildAboutPersonJsonLd } from "@/lib/seo/json-ld";
import { sectionLabelClassName } from "@/lib/ui/terminal-tokens";

export const metadata: Metadata = buildSimplePageMetadata({
  pathname: "/about",
  title: homepageCopy.aboutPage.title,
  description: homepageCopy.compactAbout,
});

export default async function AboutPage() {
  const { title, intro, sections } = homepageCopy.aboutPage;
  const { value: settings } = await getSiteSettings();
  const personLd = buildAboutPersonJsonLd();

  return (
    <>
      {personLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
      ) : null}
      <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <div className="max-w-3xl">
          <p className={sectionLabelClassName}>ABOUT</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-black/74">
            {settings.aboutShort || intro}
          </p>

          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-mono text-base font-semibold tracking-tight text-foreground">
                  {section.heading}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-black/75">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

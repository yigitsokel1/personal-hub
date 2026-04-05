import type { Metadata } from "next";
import { homepageCopy } from "@/lib/content/homepage-copy";
import { buildSimplePageMetadata } from "@/lib/seo/build-metadata";
import { buildAboutPersonJsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = buildSimplePageMetadata({
  pathname: "/about",
  title: homepageCopy.aboutPage.title,
  description: homepageCopy.compactAbout,
});

export default function AboutPage() {
  const { title, intro, sections } = homepageCopy.aboutPage;
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
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-black/75">{intro}</p>

          {sections.map((section) => (
            <section key={section.heading} className="mt-12">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                {section.heading}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-black/75">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}

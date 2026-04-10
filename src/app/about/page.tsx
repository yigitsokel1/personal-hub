import type { Metadata } from "next";
import { getAboutPageContent } from "@/lib/content-source/get-about-page";
import { buildSimplePageMetadata } from "@/lib/seo/build-metadata";
import { buildAboutPersonJsonLd } from "@/lib/seo/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  const { value: about } = await getAboutPageContent();
  return buildSimplePageMetadata({
    pathname: "/about",
    title: about.title,
    description: about.intro,
  });
}

export default async function AboutPage() {
  const { value: about } = await getAboutPageContent();
  const personLd = await buildAboutPersonJsonLd();

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
            {about.title}
          </h1>
          <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-black/74">
            {about.intro}
          </p>

          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            {about.sections.map((section) => (
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

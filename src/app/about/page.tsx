import { homepageCopy } from "@/lib/content/homepage-copy";

export default function AboutPage() {
  const { title, intro, sections } = homepageCopy.aboutPage;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        {title}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-black/75">{intro}</p>

      {sections.map((section) => (
        <section key={section.heading} className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight">
            {section.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-black/75">
            {section.body}
          </p>
        </section>
      ))}
    </main>
  );
}

import { homepageCopy } from "@/lib/content/homepage-copy";

export function HomeHero() {
  const { kicker, title, subtitle } = homepageCopy.hero;

  return (
    <header className="max-w-3xl">
      <p className="text-sm uppercase tracking-[0.2em] text-black/50">{kicker}</p>
      <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        {title}
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-black/75 sm:mt-6">
        {subtitle}
      </p>
    </header>
  );
}

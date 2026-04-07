import Link from "next/link";
import { HeroDepth } from "@/components/home/hero-depth";
import { homepageCopy } from "@/lib/content/homepage-copy";
import { primaryEmphasisLinkClassName } from "@/lib/ui/link-tokens";

export function HomeHero() {
  const { kicker, titleLines, subtitle } = homepageCopy.hero;
  const { label: ctaLabel, href: ctaHref } = homepageCopy.cta;

  return (
    <HeroDepth>
      <header className="max-w-4xl">
        <p className="max-w-xs text-sm uppercase tracking-[0.2em] text-black/50">
          {kicker}
        </p>
        <h1 className="mt-5 max-w-3xl text-3xl font-semibold leading-[1.14] tracking-tight sm:mt-6 sm:text-5xl sm:leading-[1.1]">
          {titleLines.map((line, i) => (
            <span key={i} className="block md:whitespace-nowrap">
              {line}
            </span>
          ))}
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-black/75 sm:mt-6 sm:text-lg">
          {subtitle}
        </p>
        <p className="mt-8 sm:mt-9">
          <Link href={ctaHref} className={primaryEmphasisLinkClassName}>
            {ctaLabel}
          </Link>
        </p>
      </header>
    </HeroDepth>
  );
}

import Link from "next/link";
import { HeroDepth } from "@/components/home/hero-depth";
import { homepageCopy } from "@/lib/content/homepage-copy";
import {
  ARROW,
  terminalButtonClassName,
  terminalButtonOutlineClassName,
} from "@/lib/ui/terminal-tokens";

type HomeHeroProps = {
  title: string;
  subtitle: string;
};

export function HomeHero({ title, subtitle }: HomeHeroProps) {
  const { kicker } = homepageCopy.hero;
  const { label: ctaLabel, href: ctaHref } = homepageCopy.cta;

  return (
    <HeroDepth>
      <header className="max-w-4xl">
        <p className="font-mono text-sm text-black/50">
          <span className="text-foreground">$</span> {kicker.toLowerCase()}
        </p>
        <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-[1.14] tracking-tight sm:mt-6 sm:text-5xl sm:leading-[1.1]">
          {title}
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-black/75 sm:mt-6 sm:text-lg">
          {subtitle}
        </p>
        <div className="mt-8 flex flex-wrap gap-3 sm:mt-9">
          <Link href={ctaHref} className={terminalButtonClassName}>
            {ARROW} {ctaLabel.toLowerCase()}
          </Link>
          <Link href="/about" className={terminalButtonOutlineClassName}>
            {ARROW} about
          </Link>
        </div>
      </header>
    </HeroDepth>
  );
}

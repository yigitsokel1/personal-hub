import Link from "next/link";
import { HeroDepth } from "@/components/home/hero-depth";
import { homepageCopy } from "@/lib/content/homepage-copy";
import {
  ARROW,
  terminalButtonClassName,
  terminalButtonOutlineClassName,
} from "@/lib/ui/terminal-tokens";

type HomeHeroProps = {
  kicker: string;
  title: string;
  subtitle: string;
};

export function HomeHero({ kicker, title, subtitle }: HomeHeroProps) {
  const { label: ctaLabel, href: ctaHref } = homepageCopy.cta;

  return (
    <HeroDepth>
      <header className="max-w-5xl">
        <p className="font-mono text-sm text-black/50">
          <span className="text-foreground">$</span> {kicker.toLowerCase()}
        </p>
        <h1 className="mt-5 max-w-[18ch] text-3xl font-bold leading-[1.14] tracking-tight text-balance sm:mt-6 sm:max-w-[19ch] sm:text-5xl sm:leading-[1.1] lg:max-w-[20ch]">
          {title}
        </h1>
        <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-black/75 text-pretty sm:mt-6 sm:max-w-[62ch] sm:text-lg lg:max-w-[66ch]">
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

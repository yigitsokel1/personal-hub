import Link from "next/link";
import {
  contentInlineLinkClassName,
  contentTitleLinkClassName,
} from "@/lib/ui/link-tokens";

export type RelatedLinkItem = {
  href: string;
  title: string;
};

type RelatedContentLinksProps = {
  heading: string;
  items: RelatedLinkItem[];
  emptyMessage: string;
  sectionHref: string;
  sectionLinkLabel: string;
};

export function RelatedContentLinks({
  heading,
  items,
  emptyMessage,
  sectionHref,
  sectionLinkLabel,
}: RelatedContentLinksProps) {
  return (
    <section className="mt-16 max-w-3xl border-t border-black/8 pt-9 sm:mt-18 sm:pt-11">
      <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-black/50">
        {heading}
      </h2>

      {items.length === 0 ? (
        <div className="mt-5 space-y-3">
          <p className="text-base leading-relaxed text-black/60">{emptyMessage}</p>
          <p>
            <Link href={sectionHref} className={contentInlineLinkClassName}>
              {sectionLinkLabel}
            </Link>
          </p>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-black/6 border-y border-black/6 sm:mt-7">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block py-3 text-lg font-medium tracking-tight transition-colors duration-200 hover:text-black/80 ${contentTitleLinkClassName}`}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

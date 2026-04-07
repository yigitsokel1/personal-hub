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
    <section className="mt-16 max-w-3xl border-t border-black/10 pt-10">
      <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-black/50">
        {heading}
      </h2>

      {items.length === 0 ? (
        <div className="mt-4 space-y-3">
          <p className="text-base leading-relaxed text-black/60">
            {emptyMessage}
          </p>
          <p>
            <Link href={sectionHref} className={contentInlineLinkClassName}>
              {sectionLinkLabel}
            </Link>
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-2">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`group/rel -mx-1 block rounded-sm px-1 py-1.5 text-lg font-medium tracking-tight transition-[background-color] duration-200 ease-out hover:bg-black/[0.025] focus-visible:bg-black/[0.03] motion-reduce:transition-none ${contentTitleLinkClassName}`}
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

import Link from "next/link";

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
            <Link
              href={sectionHref}
              className="text-sm underline decoration-black/25 underline-offset-4 hover:decoration-black/50"
            >
              {sectionLinkLabel}
            </Link>
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-6">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-lg font-medium tracking-tight text-foreground underline decoration-black/20 underline-offset-4 hover:decoration-black/45"
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

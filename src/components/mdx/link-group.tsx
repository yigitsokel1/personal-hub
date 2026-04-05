import { mdxLinkClassName } from "@/lib/mdx/link-styles";

export type LinkGroupItem = { href: string; label: string };

type LinkGroupProps = {
  links: LinkGroupItem[];
  heading?: string;
};

/**
 * MDX: grouped external links (same treatment as Live / Repository in project intros).
 */
export function LinkGroup({ links, heading }: LinkGroupProps) {
  return (
    <div className="mt-8">
      {heading ? (
        <p className="text-sm text-black/45">{heading}</p>
      ) : null}
      <div
        className={`flex flex-wrap gap-x-4 gap-y-2 ${heading ? "mt-2" : ""}`}
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={mdxLinkClassName}
            rel="noopener noreferrer"
            target="_blank"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

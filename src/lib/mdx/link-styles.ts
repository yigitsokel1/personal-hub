import { proseLinkClassName } from "@/lib/ui/link-tokens";

/** Shared classes for prose links (MDX + inline content). */
export const mdxLinkClassName = proseLinkClassName;

export function isExternalHttpHref(href: string | undefined): boolean {
  if (!href) return false;
  return /^https?:\/\//i.test(href);
}

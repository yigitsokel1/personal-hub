/** Shared classes for prose links (MDX + inline content). */
export const mdxLinkClassName =
  "underline decoration-black/25 underline-offset-4 hover:decoration-black/50";

export function isExternalHttpHref(href: string | undefined): boolean {
  if (!href) return false;
  return /^https?:\/\//i.test(href);
}

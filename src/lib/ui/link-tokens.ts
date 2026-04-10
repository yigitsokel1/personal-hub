/**
 * Shared link affordances: underline rhythm, timing, and focus-visible treatment.
 * Compose these in components; avoid one-off underline classes elsewhere.
 */

export const linkTransitionClassName =
  "transition-[color,text-decoration-color,opacity] duration-200 ease-out";

/** Keyboard focus ring for text links (in addition to decoration where applicable). */
export const linkFocusVisibleClassName =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground/25";

/** Muted chrome: footer, view-all, about secondary, empty states. */
export const shellSecondaryLinkClassName = [
  "text-sm text-black/45 underline decoration-black/15 underline-offset-4",
  linkTransitionClassName,
  "hover:text-black/65 hover:decoration-black/30",
  linkFocusVisibleClassName,
  "focus-visible:text-black/70 focus-visible:decoration-black/45",
].join(" ");

/** List titles, related items, prev/next titles, tag index entry titles. Use `font-medium` / `font-semibold` on the link when no parent heading sets weight. */
export const contentTitleLinkClassName = [
  "text-foreground underline decoration-black/20 underline-offset-4",
  linkTransitionClassName,
  "hover:decoration-black/45",
  linkFocusVisibleClassName,
  "focus-visible:decoration-foreground/55",
].join(" ");

/** Smaller inline emphasis inside lists (e.g. related fallback link). */
export const contentInlineLinkClassName = [
  "text-sm underline decoration-black/25 underline-offset-4",
  linkTransitionClassName,
  "hover:decoration-black/50",
  linkFocusVisibleClassName,
  "focus-visible:decoration-foreground/55",
].join(" ");

/** Prose / MDX anchors and external resource links (Live, Repository). */
export const proseLinkClassName = [
  "underline decoration-black/25 underline-offset-4",
  linkTransitionClassName,
  "hover:decoration-black/50",
  linkFocusVisibleClassName,
  "focus-visible:decoration-foreground/55",
].join(" ");

/** Primary on-page CTA (e.g. hero). */
export const primaryEmphasisLinkClassName = [
  "text-sm font-medium text-foreground underline decoration-black/25 underline-offset-4",
  linkTransitionClassName,
  "hover:decoration-black/55",
  linkFocusVisibleClassName,
  "focus-visible:decoration-foreground/60",
].join(" ");

/** Tag pills: quiet by default, same motion/focus as other links. */
export const tagLinkClassName = [
  "text-sm text-black/45 underline decoration-transparent underline-offset-4",
  linkTransitionClassName,
  "hover:text-black/70 hover:decoration-black/25",
  linkFocusVisibleClassName,
  "focus-visible:text-foreground focus-visible:decoration-foreground/40",
].join(" ");

/** Home featured cards: subtle border-only interaction. */
export const homeCardClassName = [
  "group block w-full rounded-lg border border-black/10",
  "min-h-56",
  "transition-[border-color,box-shadow,transform] duration-200 ease-out",
  "hover:border-black/18 hover:shadow-[0_1px_0_0_rgba(0,0,0,0.04)]",
  "active:translate-y-[1px]",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground/25",
].join(" ");

/** Home writing rows: lightweight editorial interaction. */
export const homeWritingRowClassName = [
  "flex items-center justify-between border-l-2 border-black/10 py-3 pl-4 pr-2",
  "transition-[border-color,color,opacity,transform] duration-200 ease-out",
  "hover:border-black/35 hover:text-black/90",
  "active:translate-x-[1px]",
  linkFocusVisibleClassName,
].join(" ");

export function homeWritingRowVariantClassName(isFeatured: boolean): string {
  if (isFeatured) {
    return `${homeWritingRowClassName} border-black/25 py-4 pl-5 text-black/92`;
  }
  return `${homeWritingRowClassName} text-black/75`;
}

const navBase = [
  "font-mono text-sm tracking-tight",
  "transition-colors duration-200 ease-out",
  linkFocusVisibleClassName,
].join(" ");

export function siteNavLinkClassName(active: boolean): string {
  if (active) {
    return [navBase, "text-foreground"].join(" ");
  }
  return [
    navBase,
    "text-foreground/50",
    "hover:text-foreground",
  ].join(" ");
}

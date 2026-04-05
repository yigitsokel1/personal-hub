import { getPublishedContent } from "./get-content";

export type WritingNeighbor = {
  slug: string;
  title: string;
};

export function getWritingNeighbors(slug: string): {
  prev: WritingNeighbor | null;
  next: WritingNeighbor | null;
} {
  const all = getPublishedContent("writing");
  const asc = [...all].sort(
    (a, b) =>
      new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
  );
  const i = asc.findIndex((w) => w.slug === slug);
  if (i === -1) return { prev: null, next: null };

  const prevItem = i > 0 ? asc[i - 1]! : null;
  const nextItem = i < asc.length - 1 ? asc[i + 1]! : null;

  return {
    prev: prevItem
      ? { slug: prevItem.slug, title: prevItem.title }
      : null,
    next: nextItem
      ? { slug: nextItem.slug, title: nextItem.title }
      : null,
  };
}

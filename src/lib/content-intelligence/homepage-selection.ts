import { getFeaturedLimit } from "@/lib/content-policies/featured";
import type {
  HomepageSelectionInput,
  HomepageSectionItem,
  HomepageSelectionResult,
} from "@/lib/content-intelligence/types";

const RECENT_HIGHLIGHT_LIMIT = 4;
const DOMAIN_HIGHLIGHT_LIMIT = 2;

function selectFeaturedOnly<T extends HomepageSectionItem>(
  items: T[],
  limit: number,
  usedIds: Set<string>
): T[] {
  const featured = items.filter((item) => item.featured && !usedIds.has(item.id)).slice(0, limit);
  for (const entry of featured) usedIds.add(entry.id);
  return featured;
}

function selectRecentHighlights<
  TWriting extends HomepageSectionItem,
  TProjects extends HomepageSectionItem,
  TWork extends HomepageSectionItem,
  TLabs extends HomepageSectionItem
>(
  input: HomepageSelectionInput<TWriting, TProjects, TWork, TLabs>,
  usedIds: Set<string>,
  limit: number
): Array<TWriting | TProjects | TWork | TLabs> {
  const merged = [...input.writing, ...input.projects, ...input.work, ...input.labs].filter(
    (item) => !usedIds.has(item.id)
  );
  const selected = merged.slice(0, limit);
  for (const entry of selected) usedIds.add(entry.id);
  return selected;
}

function selectDomainHighlights<T extends HomepageSectionItem>(
  items: T[],
  usedIds: Set<string>,
  limit: number
): T[] {
  const selected = items.filter((item) => !usedIds.has(item.id)).slice(0, limit);
  for (const entry of selected) usedIds.add(entry.id);
  return selected;
}

export function buildHomepageSelection<
  TWriting extends HomepageSectionItem,
  TProjects extends HomepageSectionItem,
  TWork extends HomepageSectionItem,
  TLabs extends HomepageSectionItem
>(
  input: HomepageSelectionInput<TWriting, TProjects, TWork, TLabs>
): HomepageSelectionResult<TWriting, TProjects, TWork, TLabs> {
  const usedIds = new Set<string>();

  const featuredWriting = selectFeaturedOnly(input.writing, getFeaturedLimit("writing"), usedIds);
  const featuredProjects = selectFeaturedOnly(
    input.projects,
    getFeaturedLimit("projects"),
    usedIds
  );
  const featuredWork = selectFeaturedOnly(input.work, getFeaturedLimit("work"), usedIds);
  const featuredLabs = selectFeaturedOnly(input.labs, getFeaturedLimit("labs"), usedIds);

  const recentHighlights = selectRecentHighlights(input, usedIds, RECENT_HIGHLIGHT_LIMIT);

  const domainHighlights = {
    writing: selectDomainHighlights(input.writing, usedIds, DOMAIN_HIGHLIGHT_LIMIT),
    projects: selectDomainHighlights(input.projects, usedIds, DOMAIN_HIGHLIGHT_LIMIT),
    work: selectDomainHighlights(input.work, usedIds, DOMAIN_HIGHLIGHT_LIMIT),
    labs: selectDomainHighlights(input.labs, usedIds, DOMAIN_HIGHLIGHT_LIMIT),
  };

  return {
    featuredWriting,
    featuredProjects,
    featuredWork,
    featuredLabs,
    recentHighlights,
    domainHighlights,
  };
}

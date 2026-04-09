import type { ContentType } from "@/lib/content/types";

export type RelatedCandidate = {
  id: string;
  slug: string;
  title: string;
  tags?: string[];
  publishedAt: string;
  featured?: boolean;
  published?: boolean;
};

export type RelatedResult = {
  slug: string;
  title: string;
};

export type DomainCollection<T> = {
  writing: T[];
  projects: T[];
  work: T[];
  labs: T[];
};

export type HomepageDomain = keyof DomainCollection<unknown>;

export type HomepageSectionItem = {
  id: string;
  type: ContentType;
  slug: string;
  featured?: boolean;
};

export type HomepageSelectionInput<
  TWriting extends HomepageSectionItem,
  TProjects extends HomepageSectionItem,
  TWork extends HomepageSectionItem,
  TLabs extends HomepageSectionItem
> = {
  writing: TWriting[];
  projects: TProjects[];
  work: TWork[];
  labs: TLabs[];
};

export type HomepageSelectionResult<
  TWriting extends HomepageSectionItem,
  TProjects extends HomepageSectionItem,
  TWork extends HomepageSectionItem,
  TLabs extends HomepageSectionItem
> = {
  featuredWriting: TWriting[];
  featuredProjects: TProjects[];
  featuredWork: TWork[];
  featuredLabs: TLabs[];
  recentHighlights: Array<TWriting | TProjects | TWork | TLabs>;
  domainHighlights: {
    writing: TWriting[];
    projects: TProjects[];
    work: TWork[];
    labs: TLabs[];
  };
};

export type TagListEntry = {
  tag: string;
  displayTag: string;
  totalCount: number;
  domains: Partial<Record<ContentType, number>>;
};

export type TaggedEntry = {
  id: string;
  type: ContentType;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  tags?: string[];
};

export type GroupedTagEntries = {
  tag: string;
  displayTag: string;
  totalCount: number;
  groups: Record<ContentType, TaggedEntry[]>;
};

export type SearchDocument = {
  id: string;
  domain: ContentType;
  slug: string;
  title: string;
  summary: string;
  bodyText: string;
  tags: string[];
  searchableText: string;
};

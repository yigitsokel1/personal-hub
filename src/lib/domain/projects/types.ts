export type ProjectInput = {
  title: string;
  slug: string;
  summary: string;
  body: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  publishedAt?: string;
  role: string;
  stack: string[];
  platform?: string;
  problem: string;
  solution: string;
  architectureHighlights: string[];
  decisions: string[];
  outcomes: string[];
  repoUrl?: string;
  liveUrl?: string;
  timeline?: string;
};

export type ProjectValidationErrors = Partial<
  Record<
    | keyof ProjectInput
    | "stack"
    | "tags"
    | "featured"
    | "repoUrl"
    | "liveUrl",
    string
  >
>;

export type ProjectFormInput = {
  title: string;
  slug: string;
  summary: string;
  body: string;
  tagsRaw: string;
  featured: boolean;
  published: boolean;
  publishedAt: string;
  role: string;
  stackRaw: string;
  platform: string;
  problem: string;
  solution: string;
  architectureHighlightsRaw: string;
  decisionsRaw: string;
  outcomesRaw: string;
  repoUrl: string;
  liveUrl: string;
  timeline: string;
};

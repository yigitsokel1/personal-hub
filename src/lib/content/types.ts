export type ContentType = "project" | "work" | "writing" | "lab";

export type ContentStatus = "draft" | "published";

export type BaseContent = {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  summary: string;
  publishedAt: string;
  updatedAt?: string;
  featured?: boolean;
  status?: ContentStatus;
  tags?: string[];
  cover?: {
    src: string;
    alt?: string;
  };
  seo?: {
    title?: string;
    description?: string;
  };
};

export type ProjectContent = BaseContent & {
  type: "project";
  role: string;
  stack: string[];
  platform?: string;
  problem: string;
  solution: string;
  architectureHighlights?: string[];
  decisions?: string[];
  outcomes?: string[];
  repoUrl?: string;
  liveUrl?: string;
  timeline?: string;
};

export type WorkContent = BaseContent & {
  type: "work";
  client: string;
  engagementType: "freelance" | "contract" | "full-time";
  role: string;
  scope: string[];
  responsibilities: string[];
  constraints?: string[];
  impact?: string[];
  timeline?: string;
  confidentialityLevel?: "public" | "limited";
};

export type WritingContent = BaseContent & {
  type: "writing";
  excerpt: string;
  readingTime?: number;
  category?: string;
  series?: string;
};

export type LabContent = BaseContent & {
  type: "lab";
  experimentType: string;
  tools: string[];
  hypothesis?: string;
  learnings?: string[];
  nextSteps?: string[];
  maturityLevel?: "idea" | "poc" | "exploration";
};

export type ContentEntry =
  | ProjectContent
  | WorkContent
  | WritingContent
  | LabContent;

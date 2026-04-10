export type WorkEngagementType = "freelance" | "contract" | "full-time";

export type WorkConfidentialityLevel = "public" | "limited";

export type WorkInput = {
  title: string;
  slug: string;
  summary: string;
  body: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  publishedAt?: string;
  client: string;
  engagementType: WorkEngagementType;
  role: string;
  timeline?: string;
  liveUrl?: string;
  confidentialityLevel?: WorkConfidentialityLevel;
  scope: string[];
  responsibilities: string[];
  constraints: string[];
  impact: string[];
};

export type WorkValidationErrors = Partial<
  Record<
    | keyof WorkInput
    | "tags"
    | "featured"
    | "engagementType"
    | "confidentialityLevel"
    | "scope"
    | "responsibilities",
    string
  >
>;

export type WorkFormInput = {
  title: string;
  slug: string;
  summary: string;
  body: string;
  tagsRaw: string;
  featured: boolean;
  published: boolean;
  publishedAt: string;
  client: string;
  engagementType: "freelance" | "contract" | "full-time";
  role: string;
  timeline: string;
  liveUrl: string;
  confidentialityLevel: "public" | "limited" | "";
  scopeRaw: string;
  responsibilitiesRaw: string;
  constraintsRaw: string;
  impactRaw: string;
};

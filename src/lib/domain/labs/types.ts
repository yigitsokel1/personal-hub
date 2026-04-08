export const LAB_STATUSES = ["idea", "exploring", "building", "paused", "completed"] as const;

export type LabStatus = (typeof LAB_STATUSES)[number];

export type LabInput = {
  title: string;
  slug: string;
  summary: string;
  body: string;
  tags: string[];
  status: LabStatus;
  featured: boolean;
  published: boolean;
  publishedAt?: string;
};

export type LabValidationErrors = Partial<
  Record<keyof LabInput | "tags" | "featured" | "status", string>
>;

export type LabFormInput = {
  title: string;
  slug: string;
  summary: string;
  body: string;
  tagsRaw: string;
  status: LabStatus;
  featured: boolean;
  published: boolean;
  publishedAt: string;
};

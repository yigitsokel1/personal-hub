export type WritingInput = {
  title: string;
  slug: string;
  summary: string;
  body: string;
  tags: string[];
  category?: string;
  series?: string;
  featured: boolean;
  published: boolean;
  readingTime?: number;
  publishedAt?: string;
};

export type WritingValidationErrors = Partial<Record<keyof WritingInput, string>>;

export type WritingFormInput = {
  title: string;
  slug: string;
  summary: string;
  body: string;
  tagsRaw: string;
  category: string;
  series: string;
  featured: boolean;
  published: boolean;
  readingTime: string;
  publishedAt: string;
};

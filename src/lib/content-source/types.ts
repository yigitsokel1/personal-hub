import type { ContentEntry } from "@/lib/content/types";

export type ContentWithBody<T extends ContentEntry = ContentEntry> = T & {
  body: string;
};

export type ContentDomain = "projects" | "work" | "writing" | "labs";

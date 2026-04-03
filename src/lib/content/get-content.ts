import fs from "node:fs";
import path from "node:path";
import { CONTENT_DIRS } from "./config";
import { parseMdxFile, toContentEntry } from "./parse";
import type {
  ContentEntry,
  ContentType,
  LabContent,
  ProjectContent,
  WorkContent,
  WritingContent,
} from "./types";

export type ContentWithBody<T extends ContentEntry = ContentEntry> = T & {
  body: string;
};

type ContentByType = {
  project: ProjectContent;
  work: WorkContent;
  writing: WritingContent;
  lab: LabContent;
};

function getMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => path.join(dir, file));
}

function sortByPublishedDateDesc<T extends { publishedAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

export function getAllContent<T extends ContentType>(
  type: T
): ContentWithBody<ContentByType[T]>[] {
  const dir = CONTENT_DIRS[type];
  const files = getMdxFiles(dir);

  const items = files.map((filePath) => {
    const source = fs.readFileSync(filePath, "utf-8");
    const parsed = parseMdxFile(source);
    const entry = toContentEntry(parsed.data);

    if (entry.type !== type) {
      throw new Error(
        `Type mismatch in ${filePath}. Expected "${type}", got "${entry.type}".`
      );
    }

    return {
      ...entry,
      body: parsed.content,
    } as unknown as ContentWithBody<ContentByType[T]>;
  });

  return sortByPublishedDateDesc(items);
}

export function getContentBySlug<T extends ContentType>(
  type: T,
  slug: string
): ContentWithBody<ContentByType[T]> | null {
  const all = getAllContent(type);
  return all.find((item) => item.slug === slug) ?? null;
}

export function getFeaturedContent<T extends ContentType>(
  type: T
): ContentWithBody<ContentByType[T]>[] {
  return getAllContent(type).filter((item) => item.featured);
}

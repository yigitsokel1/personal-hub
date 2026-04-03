import matter from "gray-matter";
import type {
  ContentEntry,
  ContentType,
  LabContent,
  ProjectContent,
  WorkContent,
  WritingContent,
} from "./types";

type ParsedMdxFile = {
  data: Record<string, unknown>;
  content: string;
};

export function parseMdxFile(source: string): ParsedMdxFile {
  const { data, content } = matter(source);
  return {
    data: data as Record<string, unknown>,
    content,
  };
}

function assertString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid or missing string field: ${field}`);
  }
  return value;
}

function assertStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    throw new Error(`Invalid or missing string[] field: ${field}`);
  }
  return value;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function optionalStringArray(value: unknown): string[] | undefined {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
    ? value
    : undefined;
}

function optionalBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function optionalNumber(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}

function parseBase(data: Record<string, unknown>) {
  return {
    id: assertString(data.id, "id"),
    type: assertString(data.type, "type") as ContentType,
    title: assertString(data.title, "title"),
    slug: assertString(data.slug, "slug"),
    summary: assertString(data.summary, "summary"),
    publishedAt: assertString(data.publishedAt, "publishedAt"),
    updatedAt: optionalString(data.updatedAt),
    featured: optionalBoolean(data.featured),
    status: optionalString(data.status) as "draft" | "published" | undefined,
    tags: optionalStringArray(data.tags),
    cover:
      data.cover && typeof data.cover === "object"
        ? {
            src: optionalString((data.cover as Record<string, unknown>).src) ?? "",
            alt: optionalString((data.cover as Record<string, unknown>).alt),
          }
        : undefined,
    seo:
      data.seo && typeof data.seo === "object"
        ? {
            title: optionalString((data.seo as Record<string, unknown>).title),
            description: optionalString(
              (data.seo as Record<string, unknown>).description
            ),
          }
        : undefined,
  };
}

export function toContentEntry(data: Record<string, unknown>): ContentEntry {
  const base = parseBase(data);

  switch (base.type) {
    case "project":
      return {
        ...base,
        type: "project",
        role: assertString(data.role, "role"),
        stack: assertStringArray(data.stack, "stack"),
        platform: optionalString(data.platform),
        problem: assertString(data.problem, "problem"),
        solution: assertString(data.solution, "solution"),
        architectureHighlights: optionalStringArray(data.architectureHighlights),
        decisions: optionalStringArray(data.decisions),
        outcomes: optionalStringArray(data.outcomes),
        repoUrl: optionalString(data.repoUrl),
        liveUrl: optionalString(data.liveUrl),
        timeline: optionalString(data.timeline),
      } satisfies ProjectContent;

    case "work":
      return {
        ...base,
        type: "work",
        client: assertString(data.client, "client"),
        engagementType: assertString(
          data.engagementType,
          "engagementType"
        ) as WorkContent["engagementType"],
        role: assertString(data.role, "role"),
        scope: assertStringArray(data.scope, "scope"),
        responsibilities: assertStringArray(
          data.responsibilities,
          "responsibilities"
        ),
        constraints: optionalStringArray(data.constraints),
        impact: optionalStringArray(data.impact),
        timeline: optionalString(data.timeline),
        confidentialityLevel: optionalString(
          data.confidentialityLevel
        ) as WorkContent["confidentialityLevel"],
      } satisfies WorkContent;

    case "writing":
      return {
        ...base,
        type: "writing",
        excerpt: assertString(data.excerpt, "excerpt"),
        readingTime: optionalNumber(data.readingTime),
        category: optionalString(data.category),
        series: optionalString(data.series),
      } satisfies WritingContent;

    case "lab":
      return {
        ...base,
        type: "lab",
        experimentType: assertString(data.experimentType, "experimentType"),
        tools: assertStringArray(data.tools, "tools"),
        hypothesis: optionalString(data.hypothesis),
        learnings: optionalStringArray(data.learnings),
        nextSteps: optionalStringArray(data.nextSteps),
        maturityLevel: optionalString(
          data.maturityLevel
        ) as LabContent["maturityLevel"],
      } satisfies LabContent;

    default:
      throw new Error(`Unsupported content type: ${String(base.type)}`);
  }
}

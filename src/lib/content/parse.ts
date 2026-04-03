import matter from "gray-matter";
import type {
  BaseContent,
  ContentEntry,
  ContentStatus,
  ContentType,
  LabContent,
  ProjectContent,
  WorkContent,
  WritingContent,
} from "./types";

const CONTENT_TYPES = ["project", "work", "writing", "lab"] as const satisfies readonly ContentType[];

const CONTENT_STATUSES = ["draft", "published"] as const satisfies readonly ContentStatus[];

const ENGAGEMENT_TYPES = ["freelance", "contract", "full-time"] as const satisfies readonly WorkContent["engagementType"][];

const CONFIDENTIALITY_LEVELS = ["public", "limited"] as const satisfies readonly NonNullable<
  WorkContent["confidentialityLevel"]
>[];

const MATURITY_LEVELS = ["idea", "poc", "exploration"] as const satisfies readonly NonNullable<
  LabContent["maturityLevel"]
>[];

function parseRequiredEnum<T extends string>(
  value: unknown,
  field: string,
  allowed: readonly T[]
): T {
  const s = assertString(value, field);
  if (!(allowed as readonly string[]).includes(s)) {
    throw new Error(
      `Invalid ${field}: expected one of ${allowed.join(", ")}, got ${JSON.stringify(s)}`
    );
  }
  return s as T;
}

function parseOptionalEnum<T extends string>(
  value: unknown,
  field: string,
  allowed: readonly T[]
): T | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") {
    throw new Error(`Invalid ${field}: expected string or omitted, got ${typeof value}`);
  }
  if (!(allowed as readonly string[]).includes(value)) {
    throw new Error(
      `Invalid ${field}: expected one of ${allowed.join(", ")}, got ${JSON.stringify(value)}`
    );
  }
  return value as T;
}

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

function parseCover(data: Record<string, unknown>): BaseContent["cover"] {
  const raw = data.cover;
  if (raw === undefined || raw === null) return undefined;
  if (typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("cover must be an object with src (string) and optional alt");
  }
  const obj = raw as Record<string, unknown>;
  const src = optionalString(obj.src);
  if (!src) {
    throw new Error(
      "cover requires a non-empty src when cover is set; omit cover entirely if unused"
    );
  }
  return { src, alt: optionalString(obj.alt) };
}

function parseBase(data: Record<string, unknown>) {
  return {
    id: assertString(data.id, "id"),
    type: parseRequiredEnum(data.type, "type", CONTENT_TYPES),
    title: assertString(data.title, "title"),
    slug: assertString(data.slug, "slug"),
    summary: assertString(data.summary, "summary"),
    publishedAt: assertString(data.publishedAt, "publishedAt"),
    updatedAt: optionalString(data.updatedAt),
    featured: optionalBoolean(data.featured),
    status: parseOptionalEnum(data.status, "status", CONTENT_STATUSES),
    tags: optionalStringArray(data.tags),
    cover: parseCover(data),
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
        engagementType: parseRequiredEnum(
          data.engagementType,
          "engagementType",
          ENGAGEMENT_TYPES
        ),
        role: assertString(data.role, "role"),
        scope: assertStringArray(data.scope, "scope"),
        responsibilities: assertStringArray(
          data.responsibilities,
          "responsibilities"
        ),
        constraints: optionalStringArray(data.constraints),
        impact: optionalStringArray(data.impact),
        timeline: optionalString(data.timeline),
        confidentialityLevel: parseOptionalEnum(
          data.confidentialityLevel,
          "confidentialityLevel",
          CONFIDENTIALITY_LEVELS
        ),
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
        maturityLevel: parseOptionalEnum(
          data.maturityLevel,
          "maturityLevel",
          MATURITY_LEVELS
        ),
      } satisfies LabContent;

    default:
      throw new Error(`Unsupported content type: ${String(base.type)}`);
  }
}

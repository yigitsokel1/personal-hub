import {
  MAX_PROJECT_TAGS,
} from "@/lib/domain/projects/mapper";
import type { ProjectInput, ProjectValidationErrors } from "@/lib/domain/projects/types";
import { parseTags } from "@/lib/tags/normalize-tag";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateProjectInput(input: ProjectInput): {
  success: boolean;
  value: ProjectInput;
  errors: ProjectValidationErrors;
} {
  const value: ProjectInput = {
    title: input.title.trim(),
    slug: input.slug.trim().toLowerCase(),
    summary: input.summary.trim(),
    body: input.body.trim(),
    tags: parseTags(input.tags),
    featured: input.featured,
    published: input.published,
    publishedAt: input.publishedAt?.trim() || undefined,
    role: input.role.trim(),
    stack: input.stack.map((item) => item.trim()).filter(Boolean),
    platform: input.platform?.trim() || undefined,
    problem: input.problem.trim(),
    solution: input.solution.trim(),
    architectureHighlights: input.architectureHighlights
      .map((item) => item.trim())
      .filter(Boolean),
    decisions: input.decisions.map((item) => item.trim()).filter(Boolean),
    outcomes: input.outcomes.map((item) => item.trim()).filter(Boolean),
    repoUrl: input.repoUrl?.trim() || undefined,
    liveUrl: input.liveUrl?.trim() || undefined,
    timeline: input.timeline?.trim() || undefined,
  };

  const errors: ProjectValidationErrors = {};

  if (!value.title) errors.title = "Title is required.";
  if (!value.slug) {
    errors.slug = "Slug is required.";
  } else if (!SLUG_PATTERN.test(value.slug)) {
    errors.slug = "Slug must use lowercase letters, numbers, and hyphens only.";
  }
  if (!value.summary) errors.summary = "Summary is required.";
  if (!value.body) errors.body = "Body is required.";
  if (!value.role) errors.role = "Role is required.";
  if (!value.problem) errors.problem = "Problem is required.";
  if (!value.solution) errors.solution = "Solution is required.";

  if (value.stack.length === 0) {
    errors.stack = "At least one stack item is required.";
  }
  if (value.tags.length > MAX_PROJECT_TAGS) {
    errors.tags = `You can add up to ${MAX_PROJECT_TAGS} tags.`;
  }
  if (value.published && !value.publishedAt) {
    errors.publishedAt = "Set a publish date when Published is enabled.";
  }
  if (value.repoUrl && !isValidHttpUrl(value.repoUrl)) {
    errors.repoUrl = "Repo URL must be a valid http(s) URL.";
  }
  if (value.liveUrl && !isValidHttpUrl(value.liveUrl)) {
    errors.liveUrl = "Live URL must be a valid http(s) URL.";
  }

  return {
    success: Object.keys(errors).length === 0,
    value,
    errors,
  };
}

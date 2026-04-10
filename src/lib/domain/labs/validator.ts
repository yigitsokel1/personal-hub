import { MAX_LAB_TAGS } from "@/lib/domain/labs/mapper";
import { isValidDateOnly } from "@/lib/datetime/published-at";
import { LAB_STATUSES, type LabInput, type LabValidationErrors } from "@/lib/domain/labs/types";
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

export function validateLabInput(input: LabInput): {
  success: boolean;
  value: LabInput;
  errors: LabValidationErrors;
} {
  const value: LabInput = {
    title: input.title.trim(),
    slug: input.slug.trim().toLowerCase(),
    summary: input.summary.trim(),
    body: input.body.trim(),
    tags: parseTags(input.tags),
    status: input.status,
    featured: input.featured,
    published: input.published,
    publishedAt: input.publishedAt?.trim() || undefined,
    liveUrl: input.liveUrl?.trim() || undefined,
  };

  const errors: LabValidationErrors = {};

  if (!value.title) errors.title = "Title is required.";
  if (!value.slug) {
    errors.slug = "Slug is required.";
  } else if (!SLUG_PATTERN.test(value.slug)) {
    errors.slug = "Slug must use lowercase letters, numbers, and hyphens only.";
  }
  if (!value.summary) errors.summary = "Summary is required.";
  if (!value.body) errors.body = "Body is required.";

  if (!LAB_STATUSES.includes(value.status)) {
    errors.status = "Status is invalid.";
  }
  if (value.tags.length > MAX_LAB_TAGS) {
    errors.tags = `You can add up to ${MAX_LAB_TAGS} tags.`;
  }
  if (value.publishedAt && !isValidDateOnly(value.publishedAt)) {
    errors.publishedAt = "Published date must use YYYY-MM-DD format.";
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

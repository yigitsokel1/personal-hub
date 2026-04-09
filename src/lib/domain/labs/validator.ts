import { MAX_LAB_TAGS } from "@/lib/domain/labs/mapper";
import { LAB_STATUSES, type LabInput, type LabValidationErrors } from "@/lib/domain/labs/types";
import { parseTags } from "@/lib/tags/normalize-tag";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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
  if (value.published && !value.publishedAt) {
    errors.publishedAt = "Set a publish date when Published is enabled.";
  }

  return {
    success: Object.keys(errors).length === 0,
    value,
    errors,
  };
}

import { MAX_WRITING_TAGS } from "@/lib/domain/writing/mapper";
import type { WritingInput, WritingValidationErrors } from "@/lib/domain/writing/types";
import { parseTags } from "@/lib/tags/normalize-tag";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateWritingInput(input: WritingInput): {
  success: boolean;
  value: WritingInput;
  errors: WritingValidationErrors;
} {
  const value: WritingInput = {
    title: input.title.trim(),
    slug: input.slug.trim().toLowerCase(),
    summary: input.summary.trim(),
    body: input.body.trim(),
    tags: parseTags(input.tags),
    category: input.category?.trim() || undefined,
    series: input.series?.trim() || undefined,
    featured: input.featured,
    published: input.published,
    readingTime: input.readingTime,
    publishedAt: input.publishedAt?.trim() || undefined,
  };

  const errors: WritingValidationErrors = {};

  if (!value.title) errors.title = "Title is required.";
  if (!value.slug) {
    errors.slug = "Slug is required.";
  } else if (!SLUG_PATTERN.test(value.slug)) {
    errors.slug = "Slug must use lowercase letters, numbers, and hyphens only.";
  }

  if (!value.summary) errors.summary = "Summary is required.";
  if (!value.body) errors.body = "Body is required.";
  if (value.tags.length > MAX_WRITING_TAGS) {
    errors.tags = `You can add up to ${MAX_WRITING_TAGS} tags.`;
  }
  if (value.readingTime != null && (!Number.isInteger(value.readingTime) || value.readingTime <= 0)) {
    errors.readingTime = "Reading time must be a positive whole number.";
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

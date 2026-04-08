import { MAX_WORK_TAGS, WORK_CONFIDENTIALITY_LEVELS, WORK_ENGAGEMENT_TYPES } from "@/lib/domain/work/mapper";
import type { WorkInput, WorkValidationErrors } from "@/lib/domain/work/types";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateWorkInput(input: WorkInput): {
  success: boolean;
  value: WorkInput;
  errors: WorkValidationErrors;
} {
  const value: WorkInput = {
    title: input.title.trim(),
    slug: input.slug.trim().toLowerCase(),
    summary: input.summary.trim(),
    body: input.body.trim(),
    tags: input.tags.map((item) => item.trim()).filter(Boolean),
    featured: input.featured,
    published: input.published,
    publishedAt: input.publishedAt?.trim() || undefined,
    client: input.client.trim(),
    engagementType: input.engagementType,
    role: input.role.trim(),
    timeline: input.timeline?.trim() || undefined,
    confidentialityLevel: input.confidentialityLevel?.trim()
      ? input.confidentialityLevel
      : undefined,
    scope: input.scope.map((item) => item.trim()).filter(Boolean),
    responsibilities: input.responsibilities.map((item) => item.trim()).filter(Boolean),
    constraints: input.constraints.map((item) => item.trim()).filter(Boolean),
    impact: input.impact.map((item) => item.trim()).filter(Boolean),
  };

  const errors: WorkValidationErrors = {};

  if (!value.title) errors.title = "Title is required.";
  if (!value.slug) {
    errors.slug = "Slug is required.";
  } else if (!SLUG_PATTERN.test(value.slug)) {
    errors.slug = "Slug must use lowercase letters, numbers, and hyphens only.";
  }
  if (!value.summary) errors.summary = "Summary is required.";
  if (!value.body) errors.body = "Body is required.";
  if (!value.client) errors.client = "Client is required.";
  if (!value.role) errors.role = "Role is required.";

  if (!WORK_ENGAGEMENT_TYPES.includes(value.engagementType)) {
    errors.engagementType = "Engagement type is invalid.";
  }
  if (
    value.confidentialityLevel &&
    !WORK_CONFIDENTIALITY_LEVELS.includes(value.confidentialityLevel)
  ) {
    errors.confidentialityLevel = "Confidentiality level is invalid.";
  }

  if (value.tags.length > MAX_WORK_TAGS) {
    errors.tags = `Maximum ${MAX_WORK_TAGS} tags allowed.`;
  }
  if (value.published && !value.publishedAt) {
    errors.publishedAt = "publishedAt is required when published is enabled.";
  }

  if (value.scope.length === 0) {
    errors.scope = "Add at least one scope item.";
  }
  if (value.responsibilities.length === 0) {
    errors.responsibilities = "Add at least one responsibility item.";
  }

  return {
    success: Object.keys(errors).length === 0,
    value,
    errors,
  };
}

type PublishEligibilityInput = {
  slug: string;
  summary: string;
  body: string;
};

export function getPublishEligibility(input: PublishEligibilityInput): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!input.slug.trim()) errors.slug = "Slug is required before publishing.";
  if (!input.summary.trim()) errors.summary = "Summary is required before publishing.";
  if (!input.body.trim()) errors.body = "Body is required before publishing.";

  if (Object.keys(errors).length > 0) {
    errors._global =
      "Cannot publish yet. Complete all required publishing fields and try again.";
  }

  return errors;
}

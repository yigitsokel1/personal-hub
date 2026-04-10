import type { AboutPageInput } from "@/lib/domain/about-page/types";

export type AboutPageValidationErrors = Partial<Record<keyof AboutPageInput | "sections", string>>;

const MAX_SECTIONS = 6;

export function validateAboutPageInput(input: AboutPageInput): {
  success: boolean;
  value: AboutPageInput;
  errors: AboutPageValidationErrors;
} {
  const value: AboutPageInput = {
    title: input.title.trim(),
    intro: input.intro.trim(),
    sections: input.sections
      .map((section) => ({ heading: section.heading.trim(), body: section.body.trim() }))
      .filter((section) => section.heading && section.body),
  };

  const errors: AboutPageValidationErrors = {};
  if (!value.title) errors.title = "About title is required.";
  if (!value.intro) errors.intro = "About intro is required.";
  if (value.sections.length === 0) {
    errors.sections = "Add at least one section.";
  } else if (value.sections.length > MAX_SECTIONS) {
    errors.sections = `Maximum ${MAX_SECTIONS} sections allowed.`;
  }

  return {
    success: Object.keys(errors).length === 0,
    value,
    errors,
  };
}

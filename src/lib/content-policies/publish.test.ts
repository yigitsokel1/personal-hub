import { describe, expect, it } from "vitest";
import { getPublishEligibility } from "@/lib/content-policies/publish";

describe("publish eligibility", () => {
  it("returns field-level errors and global error for invalid payload", () => {
    const errors = getPublishEligibility({
      slug: "",
      summary: "",
      body: "",
      publishedAt: "",
    });

    expect(errors.slug).toBeDefined();
    expect(errors.summary).toBeDefined();
    expect(errors.body).toBeDefined();
    expect(errors.publishedAt).toBeDefined();
    expect(errors._global).toBeDefined();
  });

  it("returns no errors for valid payload", () => {
    const errors = getPublishEligibility({
      slug: "valid-slug",
      summary: "summary",
      body: "body",
      publishedAt: "2026-04-09T12:00",
    });
    expect(errors).toEqual({});
  });
});

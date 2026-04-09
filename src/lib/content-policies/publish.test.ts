import { describe, expect, it } from "vitest";
import { getPublishEligibility } from "@/lib/content-policies/publish";

describe("publish eligibility", () => {
  it("returns field-level errors and global error for invalid payload", () => {
    const errors = getPublishEligibility({
      slug: "",
      summary: "",
      body: "",
    });

    expect(errors.slug).toBeDefined();
    expect(errors.summary).toBeDefined();
    expect(errors.body).toBeDefined();
    expect(errors._global).toBeDefined();
  });

  it("returns no errors for valid payload", () => {
    const errors = getPublishEligibility({
      slug: "valid-slug",
      summary: "summary",
      body: "body",
    });
    expect(errors).toEqual({});
  });
});

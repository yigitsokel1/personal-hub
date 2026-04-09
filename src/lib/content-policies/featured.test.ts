import { describe, expect, it } from "vitest";
import { assertFeaturedLimit, getFeaturedLimit } from "@/lib/content-policies/featured";

describe("featured policy", () => {
  it("returns domain-specific limits", () => {
    expect(getFeaturedLimit("writing")).toBe(1);
    expect(getFeaturedLimit("projects")).toBe(2);
    expect(getFeaturedLimit("work")).toBe(2);
    expect(getFeaturedLimit("labs")).toBe(2);
  });

  it("enforces limits with domain-aware messages", () => {
    expect(assertFeaturedLimit("writing", 0)).toBeNull();
    expect(assertFeaturedLimit("writing", 1)).toBe("Maximum 1 featured writing items are allowed.");
    expect(assertFeaturedLimit("projects", 2)).toBe(
      "Maximum 2 featured projects items are allowed."
    );
  });
});

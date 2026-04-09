import { describe, expect, it } from "vitest";
import { normalizeTag, parseTags } from "@/lib/tags/normalize-tag";

describe("normalizeTag", () => {
  it("normalizes to lowercase kebab-case", () => {
    expect(normalizeTag("  AI Tools  ")).toBe("ai-tools");
    expect(normalizeTag("System   Design")).toBe("system-design");
    expect(normalizeTag("C++ / Rust")).toBe("c-rust");
  });
});

describe("parseTags", () => {
  it("keeps input order while deduping normalized tags", () => {
    expect(parseTags("AI Tools,backend, ai-tools, System Design")).toEqual([
      "ai-tools",
      "backend",
      "system-design",
    ]);
  });

  it("filters out empty normalized tags", () => {
    expect(parseTags(["", "   ", "AI"])).toEqual(["ai"]);
  });
});

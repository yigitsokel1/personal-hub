import { describe, expect, it } from "vitest";
import { rankSearchDocuments } from "@/lib/content-intelligence/search-ranking";
import type { SearchDocument } from "@/lib/content-intelligence/types";

const docs: SearchDocument[] = [
  {
    id: "1",
    domain: "writing",
    slug: "system-design",
    title: "System Design Patterns",
    summary: "Designing reliable platforms",
    bodyText: "system design architecture reliability",
    tags: ["system-design", "architecture"],
    searchableText: "system design architecture reliability",
  },
  {
    id: "2",
    domain: "project",
    slug: "prisma-stack",
    title: "Prisma Stack",
    summary: "Typed backend with prisma",
    bodyText: "typed backend prisma postgres",
    tags: ["prisma", "backend"],
    searchableText: "typed backend prisma postgres",
  },
];

describe("rankSearchDocuments", () => {
  it("prioritizes exact title matches over tag and body matches", () => {
    const results = rankSearchDocuments(docs, "system design patterns");
    expect(results[0]?.document.slug).toBe("system-design");
  });

  it("returns tag and summary/body matches", () => {
    const tagResults = rankSearchDocuments(docs, "prisma");
    expect(tagResults[0]?.document.slug).toBe("prisma-stack");

    const none = rankSearchDocuments(docs, "no-such-term");
    expect(none).toEqual([]);
  });

  it("does not score body-only matches for very short queries", () => {
    const results = rankSearchDocuments(
      [
        {
          id: "3",
          domain: "lab",
          slug: "alpha-only-body",
          title: "Noise title",
          summary: "Noise summary",
          bodyText: "alpha details live here",
          tags: ["experiment"],
          searchableText: "noise summary experiment",
        },
      ],
      "al"
    );
    expect(results).toEqual([]);
  });
});

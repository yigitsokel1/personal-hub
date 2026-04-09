import { describe, expect, it } from "vitest";
import { rankRelatedContent } from "@/lib/content-intelligence/related-ranking";

describe("rankRelatedContent", () => {
  it("excludes current slug and ranks shared tags highest", () => {
    const results = rankRelatedContent(
      "current",
      ["system-design", "prisma"],
      [
        {
          id: "1",
          slug: "current",
          title: "Current",
          tags: ["system-design"],
          publishedAt: "2026-01-10T00:00:00.000Z",
          published: true,
        },
        {
          id: "2",
          slug: "best-match",
          title: "Best Match",
          tags: ["system-design", "prisma"],
          publishedAt: "2026-02-01T00:00:00.000Z",
          published: true,
        },
        {
          id: "3",
          slug: "single-match",
          title: "Single Match",
          tags: ["system-design"],
          publishedAt: "2026-02-10T00:00:00.000Z",
          published: true,
        },
      ]
    );

    expect(results).toEqual([
      { slug: "best-match", title: "Best Match" },
      { slug: "single-match", title: "Single Match" },
    ]);
  });

  it("falls back to newest same-domain content when no shared tags", () => {
    const results = rankRelatedContent(
      "current",
      ["ai"],
      [
        {
          id: "1",
          slug: "alpha",
          title: "Alpha",
          tags: ["backend"],
          publishedAt: "2026-01-01T00:00:00.000Z",
          published: true,
        },
        {
          id: "2",
          slug: "beta",
          title: "Beta",
          tags: ["infra"],
          publishedAt: "2026-03-01T00:00:00.000Z",
          published: true,
        },
      ]
    );

    expect(results).toEqual([
      { slug: "beta", title: "Beta" },
      { slug: "alpha", title: "Alpha" },
    ]);
  });
});

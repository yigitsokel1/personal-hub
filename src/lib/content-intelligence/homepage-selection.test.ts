import { describe, expect, it } from "vitest";
import { buildHomepageSelection } from "@/lib/content-intelligence/homepage-selection";

function entry(id: string, type: "project" | "work" | "writing" | "lab", featured = false) {
  return {
    id,
    type,
    slug: id,
    featured,
    title: id,
    publishedAt: "2026-01-01T00:00:00.000Z",
  };
}

describe("buildHomepageSelection", () => {
  it("enforces featured limits and avoids duplicates across sections", () => {
    const selection = buildHomepageSelection({
      writing: [entry("w1", "writing", true), entry("w2", "writing")],
      projects: [entry("p1", "project", true), entry("p2", "project", true), entry("p3", "project")],
      work: [entry("k1", "work", true), entry("k2", "work", true), entry("k3", "work")],
      labs: [entry("l1", "lab"), entry("l2", "lab")],
    });

    expect(selection.featuredWriting.map((item) => item.id)).toEqual(["w1"]);
    expect(selection.featuredProjects.map((item) => item.id)).toEqual(["p1", "p2"]);
    expect(selection.featuredWork.map((item) => item.id)).toEqual(["k1", "k2"]);
    expect(selection.featuredLabs.map((item) => item.id)).toEqual(["l1", "l2"]);

    const selectedIds = new Set([
      ...selection.featuredWriting,
      ...selection.featuredProjects,
      ...selection.featuredWork,
      ...selection.featuredLabs,
      ...selection.recentHighlights,
      ...selection.domainHighlights.writing,
      ...selection.domainHighlights.projects,
      ...selection.domainHighlights.work,
      ...selection.domainHighlights.labs,
    ].map((item) => item.id));

    const totalItems =
      selection.featuredWriting.length +
      selection.featuredProjects.length +
      selection.featuredWork.length +
      selection.featuredLabs.length +
      selection.recentHighlights.length +
      selection.domainHighlights.writing.length +
      selection.domainHighlights.projects.length +
      selection.domainHighlights.work.length +
      selection.domainHighlights.labs.length;

    expect(selectedIds.size).toBe(totalItems);
  });

  it("falls back to recent content when featured is missing", () => {
    const selection = buildHomepageSelection({
      writing: [entry("w1", "writing"), entry("w2", "writing")],
      projects: [entry("p1", "project")],
      work: [],
      labs: [],
    });

    expect(selection.featuredWriting.map((item) => item.id)).toEqual(["w1"]);
    expect(selection.featuredProjects.map((item) => item.id)).toEqual(["p1"]);
  });
});

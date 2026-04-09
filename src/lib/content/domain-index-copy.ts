/**
 * Short leads for domain index pages (under the page h1). Keeps copy out of route files.
 */
export const domainIndexCopy = {
  projects: {
    sectionLabel: "PRODUCTION WORK",
    title: "Real systems in production",
    cardStatusLabel: "Production",
    cardCtaLabel: "View case study",
    lead:
      "Productized systems with decision trails: how they were validated, what architecture held, and what shipped.",
  },
  work: {
    sectionLabel: "ENGAGEMENTS",
    title: "Work",
    cardCtaLabel: "View case study",
    lead:
      "Engagements framed as delivery systems: scope, constraints, ownership, and outcomes, anonymized when required.",
  },
  writing: {
    sectionLabel: "TECHNICAL WRITING",
    title: "Deep dives into system design and architecture",
    featuredLabel: "FEATURED",
    allArticlesLabel: "ALL ARTICLES",
    lead:
      "Long-form notes on architecture, delivery pipelines, and product-engineering decisions.",
    tagsLinePrefix: "Browse by topic across the site —",
    tagsLinkLabel: "all tags",
  },
  labs: {
    sectionLabel: "ITERATION LOG",
    title: "Labs",
    statusLabelActive: "Active",
    statusLabelIdea: "Idea",
    statusLabelPoc: "POC",
    findingsLabel: "Key Findings",
    lead:
      "Short iteration logs from active experiments: hypotheses, state changes, failures, and what is worth shipping.",
  },
} as const;

/**
 * Short leads for domain index pages (under the page h1). Keeps copy out of route files.
 */
export const domainIndexCopy = {
  projects: {
    lead:
      "Productized systems and technical narratives—how they are shaped, what was decided, and what shipped.",
  },
  work: {
    lead:
      "Engagements framed as case studies: scope, constraints, and delivery, anonymized where that is the right tradeoff.",
  },
  writing: {
    lead:
      "Longer-form notes on architecture, delivery, and product engineering judgment.",
    tagsLinePrefix: "Browse by topic across the site —",
    tagsLinkLabel: "all tags",
  },
  labs: {
    lead:
      "Experiments and spikes—tools, hypotheses, maturity, and honest outcomes.",
  },
} as const;

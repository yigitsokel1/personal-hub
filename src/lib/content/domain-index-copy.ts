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
      "Productized systems and technical narratives—how they are shaped, what was decided, and what shipped.",
  },
  work: {
    sectionLabel: "ENGAGEMENTS",
    title: "Work",
    cardCtaLabel: "View case study",
    lead:
      "Engagements framed as case studies: scope, constraints, and delivery, anonymized where that is the right tradeoff.",
  },
  writing: {
    sectionLabel: "TECHNICAL WRITING",
    title: "Deep dives into system design and architecture",
    featuredLabel: "FEATURED",
    allArticlesLabel: "ALL ARTICLES",
    lead:
      "Longer-form notes on architecture, delivery, and product engineering judgment.",
    tagsLinePrefix: "Browse by topic across the site —",
    tagsLinkLabel: "all tags",
  },
  labs: {
    sectionLabel: "ACTIVE EXPERIMENTS",
    title: "Labs",
    statusLabelActive: "Active",
    statusLabelIdea: "Idea",
    statusLabelPoc: "POC",
    findingsLabel: "Key Findings",
    lead:
      "Experiments and spikes—tools, hypotheses, maturity, and honest outcomes.",
  },
} as const;

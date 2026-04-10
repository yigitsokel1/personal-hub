/**
 * Short leads for domain index pages (under the page h1). Keeps copy out of route files.
 */
export const domainIndexCopy = {
  projects: {
    sectionLabel: "PRODUCTION WORK",
    title: "Projects",
    cardStatusLabel: "Production",
    cardCtaLabel: "View case study",
    lead: "End-to-end systems built from idea to production.",
  },
  work: {
    sectionLabel: "ENGAGEMENTS",
    title: "Work",
    cardCtaLabel: "View case study",
    lead: "Real-world client work, focused on delivery, constraints, and measurable impact.",
  },
  writing: {
    sectionLabel: "TECHNICAL WRITING",
    title: "Writing",
    featuredLabel: "FEATURED",
    allArticlesLabel: "ALL ARTICLES",
    lead: "Essays and technical notes on system design, product engineering decisions, and practical trade-offs.",
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
    lead: "Fast experiments to validate ideas, capture failure signals, and decide what deserves production investment.",
  },
} as const;

/**
 * Curated structural copy for homepage/public surfaces.
 *
 * Source-of-truth policy:
 * - Editable product identity copy (brandLabel, positioningLine, footerSignature, heroTitle, heroSubtitle)
 *   lives in Site Settings (DB/admin).
 * - This file stays code-based for structural labels and UI wording:
 *   section titles, CTA text, fallback/default copy skeleton.
 */
export const homepageCopy = {
  siteName: "Osman Yiğit Sökel",
  /** Default `<title>` and primary brand line for metadata (layout + homepage). */
  siteTitle: "OYS — Personal Hub",
  hero: {
    kicker: "Product engineer",

    /** Intentional line breaks for the hero heading (single column, editorial rhythm). */
    titleLines: [
      "I build production-grade systems by combining",
      "AI, backend engineering, and product thinking.",
    ],
    subtitle:
      "I ship systems end to end and document the decisions behind projects, work, writing, and labs.",
  },
  sections: {
    featuredWork: {
      title: "Work",
      viewAllLabel: "View all work",
      viewAllHref: "/work",
    },
    featuredProjects: {
      title: "Projects",
      viewAllLabel: "View all projects",
      viewAllHref: "/projects",
    },
    writing: {
      title: "Writing",
      viewAllLabel: "View all writing",
      viewAllHref: "/writing",
    },
    labs: {
      title: "Labs",
      viewAllLabel: "View all labs",
      viewAllHref: "/labs",
    },
  },
  cta: {
    label: "Explore selected projects",
    href: "/projects",
  },
  aboutPage: {
    title: "About",
    intro:
      "I am a product engineer who builds systems, not demos. I own problems end to end: framing, tradeoffs, architecture, shipping, validation, and iteration.",
    sections: [
      {
        heading: "How I work",
        body: "I combine AI-assisted workflows with disciplined backend and product execution: small vertical slices, explicit failure modes, and systems teams can operate. I optimize for decisions that stay correct under real constraints.",
      },
      {
        heading: "What you will find here",
        body: "Projects are productized systems with architecture and outcomes. Work covers real engagements and decision context. Writing captures technical judgment. Labs are raw experiments with clear learnings, not polished launches.",
      },
    ],
  },
} as const;

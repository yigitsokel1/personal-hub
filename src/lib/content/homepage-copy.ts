/**
 * Curated homepage and shell copy. Featured project/work/lab lists are driven by
 * `featured: true` in MDX frontmatter (`getFeaturedContent`).
 *
 * Edit `siteName` / `siteTitle` to match your public name or byline (also used in JSON-LD).
 */
export const homepageCopy = {
  siteName: "Osman Yiğit Sökel",
  /** Default `<title>` and primary brand line for metadata (layout + homepage). */
  siteTitle: "OYS — Personal Hub",
  /** Root layout / OG description; aligned with the hero subtitle. */
  siteDescription:
    "Systems-focused product engineering across projects, client work, writing, and labs.",
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
  compactAbout:
    "I frame, build, and operate real systems with an emphasis on product outcomes and technical clarity.",
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
    about: {
      title: "About",
      linkLabel: "Read about my approach",
      href: "/about",
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

export type HomepageCopy = typeof homepageCopy;

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
    "Production systems, engagements, technical writing, and experiments—organized as an operating hub.",
  hero: {
    kicker: "Product engineer",

    /** Intentional line breaks for the hero heading (single column, editorial rhythm). */
    titleLines: [
      "I build production-grade systems by combining",
      "AI, backend engineering, and product thinking.",
    ],
    subtitle:
      "Production systems, engagements, writing, and experiments—organized as an operating hub.",
  },
  compactAbout:
    "I build and ship real systems end to end: framing, architecture, validation, and iteration after launch. This site documents that operating practice.",
  sections: {
    featuredWork: {
      title: "Selected work",
      viewAllLabel: "All work",
      viewAllHref: "/work",
    },
    featuredProjects: {
      title: "Featured projects",
      viewAllLabel: "All projects",
      viewAllHref: "/projects",
    },
    writing: {
      title: "Latest writing",
      viewAllLabel: "All writing",
      viewAllHref: "/writing",
    },
    labs: {
      title: "Labs",
      viewAllLabel: "All labs",
      viewAllHref: "/labs",
    },
    about: {
      title: "About",
      linkLabel: "Read more",
      href: "/about",
    },
  },
  cta: {
    label: "Explore projects",
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

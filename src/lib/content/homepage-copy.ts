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
    "Case studies, engagements, writing, and experiments—organized as a hub, not a deck.",
  hero: {
    kicker: "Product engineer",

    /** Intentional line breaks for the hero heading (single column, editorial rhythm). */
    titleLines: [
      "I build production-grade systems by combining",
      "AI, backend engineering, and product thinking.",
    ],
    subtitle:
      "Case studies, engagements, writing, and experiments—organized as a hub, not a deck.",
  },
  compactAbout:
    "I ship real systems end to end: clarity on the problem, boring-when-it-matters tech choices, and follow-through after launch. This site is where I document that work.",
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
      "I am a product engineer: I own problems end to end—from framing and tradeoffs to shipping, measurement, and iteration. This site is my hub for how that work actually happens, not a slide deck of highlights.",
    sections: [
      {
        heading: "How I work",
        body: "I combine AI-assisted tooling with disciplined backend and product practice: small vertical slices, explicit failure modes, and systems you can operate. I care as much about what we choose not to build as what we ship.",
      },
      {
        heading: "What you will find here",
        body: "Projects are productized systems I have shaped or led. Work is real engagements, anonymized where needed. Writing is longer-form judgment on architecture and delivery. Labs are honest experiments—some stick, some do not.",
      },
    ],
  },
} as const;

export type HomepageCopy = typeof homepageCopy;

# Content authoring guide

Authoritative rules for MDX content in this repo. The **machine-readable contract** is [`src/lib/content/types.ts`](../src/lib/content/types.ts) and [`src/lib/content/parse.ts`](../src/lib/content/parse.ts). Site URL, `updatedAt`, `seo`, and `status` consumption are described in [`src/lib/seo/metadata-conventions.md`](../src/lib/seo/metadata-conventions.md).

Copy new entries from [`src/content/templates/`](../src/content/templates/) (templates are **not** loaded by the app).

---

## Content domains

### Projects

**What goes here:** Productized systems you ship, own, maintain, or iterate on—something with a clear boundary and lifecycle, not a one-off demo.

**What does not:** Paid client engagements (use **work**). A personal repo can be a **project** if you frame it as a product or platform you are building, not as “work for a client.”

### Work

**What goes here:** Real engagements presented as case studies. Use anonymized clients, blended timelines, or public-safe detail when necessary.

**What does not:** The same story as a **project** unless the angle is clearly “engagement” (stakeholders, contract, delivery constraints) vs “system I productized.”

### Writing

**What goes here:** Long-form pieces—essays, technical judgment, editorials—with a single thesis and readable arc.

**What does not:** Short experiment notes or spike write-ups (use **labs**).

### Labs

**What goes here:** Experiments, spikes, PoCs, explorations—honest about maturity and whether the idea stuck.

**What does not:** Production case studies or client delivery narratives (use **work** or **projects**).

---

## Base frontmatter (all types)

Required on every entry:

| Field | Type | Notes |
|-------|------|--------|
| `id` | string | Stable unique id; convention `project-…`, `work-…`, `writing-…`, `lab-…`. Never rename casually (feeds, future references). |
| `type` | enum | `project` \| `work` \| `writing` \| `lab` |
| `title` | string | Page title and default SEO segment. |
| `slug` | string | URL segment (`/projects/{slug}` etc.). **kebab-case**, ASCII, no slashes. Must stay stable. |
| `summary` | string | Short description; used in lists and default meta description. |
| `publishedAt` | string | ISO date (`YYYY-MM-DD` recommended). |

Optional (all types):

| Field | Type | Notes |
|-------|------|--------|
| `updatedAt` | string | When the **published** piece changes in a meaningful way. See metadata conventions. Omit if unchanged since `publishedAt`. |
| `featured` | boolean | `true` surfaces entry on the homepage for that domain. Use sparingly (see below). |
| `status` | enum | Omit or `published` for public surfaces; `draft` excludes lists, sitemap, RSS, tag aggregation, and static params. |
| `tags` | string[] | See [Tags](#tags). |
| `cover` | object | `{ src: string, alt?: string }` for OG / cover when wired. |
| `seo` | object | `{ title?: string, description?: string }` overrides HTML title and meta description. |

**Share previews:** Without `cover`, list and detail pages use the site default image (`/opengraph-image`, defined in `src/app/opengraph-image.tsx`). With `cover`, that entry’s social cards use `cover.src`. See [`src/lib/seo/metadata-conventions.md`](../src/lib/seo/metadata-conventions.md).

### `featured`

Set `featured: true` only for entries you want in homepage “selected” blocks. **Recommendation:** at most **1–3** per domain so the homepage stays credible. Omit or `false` for everything else.

### `updatedAt`

Set when copy, structure, or facts change post-publish. Full rules: [`metadata-conventions.md`](../src/lib/seo/metadata-conventions.md).

---

## Project (`type: project`)

Required:

| Field | Type |
|-------|------|
| `role` | string |
| `stack` | string[] (non-empty) |
| `problem` | string |
| `solution` | string |

Optional:

| Field | Type |
|-------|------|
| `platform` | string |
| `architectureHighlights` | string[] |
| `decisions` | string[] |
| `outcomes` | string[] |
| `repoUrl` | string |
| `liveUrl` | string |
| `timeline` | string |

---

## Work (`type: work`)

Required:

| Field | Type |
|-------|------|
| `client` | string |
| `engagementType` | `freelance` \| `contract` \| `full-time` |
| `role` | string |
| `scope` | string[] |
| `responsibilities` | string[] |

Optional:

| Field | Type |
|-------|------|
| `constraints` | string[] |
| `impact` | string[] |
| `timeline` | string |
| `confidentialityLevel` | `public` \| `limited` |

---

## Writing (`type: writing`)

Required:

| Field | Type |
|-------|------|
| `excerpt` | string |

Optional:

| Field | Type |
|-------|------|
| `readingTime` | number (minutes) |
| `category` | string |
| `series` | string |

---

## Lab (`type: lab`)

Required:

| Field | Type |
|-------|------|
| `experimentType` | string |
| `tools` | string[] |

Optional:

| Field | Type |
|-------|------|
| `hypothesis` | string |
| `learnings` | string[] |
| `nextSteps` | string[] |
| `maturityLevel` | `idea` \| `poc` \| `exploration` |

---

## Slugs and files

- Put each entry in **`src/content/projects/`**, **`work/`**, **`writing/`**, or **`labs/`** as a single `.mdx` file.
- **`slug` in frontmatter** must match the URL you intend; filename can match slug for sanity (e.g. `my-system.mdx` with `slug: my-system`).
- Do not put authoring templates or drafts inside those four folders unless they should be built as real routes (templates live in `src/content/templates/`).

---

## Structured frontmatter vs MDX body

Detail pages render **title, summary, metadata rows, and tags** from frontmatter, then the **MDX body** as the long-form narrative.

Many structured fields (`problem`, `solution`, `architectureHighlights`, `scope`, `responsibilities`, `impact`, etc.) are **validated at build time** but are **not** all shown as separate UI blocks today. They still matter:

- They keep **list cards, future UI, and JSON-LD** aligned with a single model.
- They force **discipline**: short, scannable summaries that **must agree** with the body.

**Rule:** Write the body as the reader-visible story. Use frontmatter strings and arrays as **tight summaries or bullets** of the same facts—never contradict the body.

---

## MDX body

- **Do not use `#` (h1) in the body.** The page already uses `title` as the document h1. Start at **`##`** for the first section heading to avoid duplicate h1s and a broken outline.
- Follow the section flow in the templates for each domain (`src/content/templates/`).

---

## Tags

**Purpose:** Tags describe **topics, technologies, or patterns** (e.g. `nextjs`, `api-design`, `reliability`). They are not for narrative, client names, or repeating the content `type`.

**Format:**

- **Lowercase**
- **kebab-case** for multi-word values (`image-processing`, `product-engineering`)
- No spaces; ASCII preferred

**Pluralization:** Prefer **singular** nouns for topics (`migration` not `migrations`) unless the tag is a proper stack name (`aws`).

**How many:** Prefer **3–5** tags per entry; **6** as a hard upper bound so list views stay readable.

There is no runtime tag whitelist—consistency is enforced by this guide and review.

---

## SEO (`seo.title` / `seo.description`)

- **Default title:** `{title} — {section}` plus site name via the root layout template (see `buildContentDetailMetadata` in [`src/lib/seo/build-metadata.ts`](../src/lib/seo/build-metadata.ts)).
- If **`seo.title`** is set, it is used as an **absolute** title (root template does not apply).
- **Description:** `seo.description` if set, otherwise **`summary`**.

Override when the default title or summary is awkward for search or sharing (length, disambiguation, campaign wording).

---

## Confidential work

When details cannot be public: anonymize the client string, use **`confidentialityLevel: limited`** when it helps your own records, and add **one** explicit line in the body that you are describing the engagement in a public-safe way—without undermining the rest of the case study.

---

## Related documentation

- [`src/lib/seo/metadata-conventions.md`](../src/lib/seo/metadata-conventions.md) — `NEXT_PUBLIC_SITE_URL`, `updatedAt`, `seo`, `status`

---

## Sprint 17 authoring contract

This section defines the minimum authoring behavior required for the unified content surfaces.

### Required fields (all entries)

- `id`, `type`, `title`, `slug`, `summary`, `publishedAt`

### Optional fields (all entries)

- `featured`, `tags`, `updatedAt`, `cover`, `seo`, `status`

### Domain-specific requirements

- `project`: `role`, `stack`, `problem`, `solution`
- `work`: `client`, `engagementType`, `role`, `scope`, `responsibilities`
- `writing`: `excerpt` (optional: `readingTime`, `category`, `series`)
- `lab`: `experimentType`, `tools` (optional: `maturityLevel`, `hypothesis`, `learnings`, `nextSteps`)

### Summary writing standard

- Keep `summary` to one tight sentence (about 14-26 words).
- Write for list readability first: concrete outcome, system context, and scope.
- Avoid hype adjectives and generic claims.
- `summary` should stand alone in archive cards/lists and remain valid as default meta description.

### Tag limit and format

- Preferred: 3-5 tags.
- Hard upper bound: 6 tags.
- Always lowercase; use kebab-case for multi-word tags.
- Use topical/system tags, not content type labels (`project`, `work`, etc.).

### Featured selection rules

- Featured is used by archive pages and homepage selected blocks.
- Mark only 1-2 entries as featured per domain for active editorial cycles.
- Featured entries should represent current best signal for the domain; rotate intentionally, not frequently.

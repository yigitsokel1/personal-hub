# Metadata conventions

Site-level rules for frontmatter, env, and SEO helpers (`build-metadata.ts`, `json-ld.ts`, sitemap, RSS).

## `NEXT_PUBLIC_SITE_URL`

- Set in **production** to the public origin with no trailing path (e.g. `https://example.com`).
- Used for: `metadataBase`, canonical and Open Graph URLs, sitemap absolute URLs, RSS links, JSON-LD `url` fields.
- If unset, canonical/OG URLs and JSON-LD may be omitted or relative; set the variable before shipping.

## `updatedAt`

- Optional ISO date string in MDX frontmatter.
- Set when a **published** piece changes in a meaningful way (copy, structure, factual fixes).
- Omit if nothing changed since `publishedAt`.
- Consumed for: sitemap `lastModified`, Article JSON-LD `dateModified` (falls back to `publishedAt` when omitted).

## `seo.title` / `seo.description`

- Optional overrides for HTML `<title>` / meta description and sharing cards.
- **Title:** If `seo.title` is set, detail pages use an **absolute** title (the root layout template does not apply). Otherwise the default segment is `{contentTitle} — {sectionLabel}` plus the site name via the layout template (see `buildContentDetailMetadata`).
- **Description:** `seo.description` if set, otherwise `summary`.

## `status`

- Omit or `published`: included in public lists, sitemap, RSS, tag aggregation, and static params.
- `draft`: excluded from those surfaces; direct URLs should 404 in production builds that only pre-render published slugs.

## Related documentation

- **[Content authoring guide](../../../docs/content-authoring.md)** — domain definitions, required and optional frontmatter per type, slugs, tags, MDX body conventions, and how structured fields relate to the narrative. Tag rules live there; this file stays focused on env, dates, SEO overrides, and publish state.
- **[Deployment checklist](../../../docs/deployment-checklist.md)** — env vars, build, sitemap/RSS, canonical/`metadataBase`, images, and post-deploy routes.

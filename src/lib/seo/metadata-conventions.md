# Metadata conventions

Site-level rules for DB-backed content metadata, env, and SEO helpers (`build-metadata.ts`, `json-ld.ts`, sitemap, RSS).

## `NEXT_PUBLIC_SITE_URL`

- Set in **production** to the public origin with no trailing path (e.g. `https://example.com`).
- Used for: `metadataBase`, canonical and Open Graph URLs, sitemap absolute URLs, RSS links, JSON-LD `url` fields.
- If unset, canonical/OG URLs and JSON-LD may be omitted or relative; set the variable before shipping.

## `updatedAt`

- Optional ISO date string persisted per DB record.
- Set when a **published** piece changes in a meaningful way (copy, structure, factual fixes).
- Omit if nothing changed since `publishedAt`.
- Consumed for: sitemap `lastModified`, Article JSON-LD `dateModified` (falls back to `publishedAt` when omitted).

## `seo.title` / `seo.description`

- Optional overrides for HTML `<title>` / meta description and sharing cards.
- **Title:** If `seo.title` is set, detail pages use an **absolute** title (the root layout template does not apply). Otherwise the default segment is `{contentTitle} — {sectionLabel}` plus the site name via the layout template (see `buildContentDetailMetadata`).
- **Description:** `seo.description` if set, otherwise `summary`.

## Default share image vs `cover`

- **Site default:** At build time, [`src/app/opengraph-image.tsx`](../../app/opengraph-image.tsx) (and matching `twitter-image.tsx`) produce the fallback card for Open Graph and Twitter (`summary_large_image`). Programmatic helpers in [`build-metadata.ts`](./build-metadata.ts) point crawlers at `/opengraph-image` when `NEXT_PUBLIC_SITE_URL` is set, so URLs are absolute in production.
- **Per entry:** If DB content includes `cover.src`, detail routes use that image for OG/Twitter instead of the default. Use a **root-relative** path under `public/` (e.g. `/photos/post.png`) or an absolute `https://` URL if remote patterns are configured in `next.config.ts`.
- **Dynamic OG generators** (per-request image APIs) are optional and out of scope for v1; the static default plus optional `cover` is the supported strategy.

## Publish state

- Public visibility is gated by DB fields `published` + `publishedAt`.
- Unpublished content is excluded from public lists, sitemap, RSS, and tag aggregation.
- Preview routes can include unpublished content through explicit preview data paths.

## Related documentation

- **[Content authoring guide](../../../docs/content-authoring.md)** — domain definitions, required and optional content fields per type, slugs, tags, MDX body conventions, and how structured fields relate to the narrative. Tag rules live there; this file stays focused on env, dates, SEO overrides, and publish state.
- **[Deployment checklist](../../../docs/deployment-checklist.md)** — env vars, build, sitemap/RSS, canonical/`metadataBase`, images, and post-deploy routes.

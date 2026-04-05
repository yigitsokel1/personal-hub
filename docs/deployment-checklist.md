# Deployment checklist

Use this before and after shipping the Personal Hub to production (Vercel or any Node host).

## Environment variables

| Variable | Required in production | Purpose |
|----------|------------------------|---------|
| `NEXT_PUBLIC_SITE_URL` | **Yes** | Public site origin with **no** trailing slash (e.g. `https://example.com`). Drives `metadataBase`, canonical and Open Graph URLs, JSON-LD `url` fields, absolute RSS item links, and valid sitemap URLs. |
| `CONTENT_HEALTH_STRICT` | No | Set to `1` to **fail the build** on blocking content issues (duplicate slug/id, invalid or future `publishedAt`, tag collisions). Also enforced when `CI=true`. Does not fail on missing `NEXT_PUBLIC_SITE_URL` (that remains an advisory warning). |

See [.env.example](../.env.example) for a template.

## Build and start

```bash
npm install
npm run build
npm run start
```

Smoke locally on `http://localhost:3000` after `npm run start`.

## Production checks (pre-deploy)

- **`NEXT_PUBLIC_SITE_URL`** matches the domain users will open (including `https` and no trailing path).
- **Canonical URLs**: View source or devtools on a detail page and confirm `<link rel="canonical">` points at the production origin when the env var is set.
- **`metadataBase`**: Set indirectly via `NEXT_PUBLIC_SITE_URL` in [src/app/layout.tsx](../src/app/layout.tsx). Without it, Open Graph and canonical tags are incomplete.
- **Sitemap**: With `NEXT_PUBLIC_SITE_URL` unset, [src/app/sitemap.ts](../src/app/sitemap.ts) returns **no entries** (path-only URLs are invalid for sitemaps). After deploy, open `/sitemap.xml` and confirm full `https://` URLs for static routes, content slugs, and tag pages.
- **RSS**: Open `/writing/feed.xml`. Item `<link>` and `<guid>` must be absolute `https://` URLs in production. Relative links appear only when the site URL env is missing (feed readers will not resolve them correctly).
- **Content health**: Run `npm run build` with `CI=true` or `CONTENT_HEALTH_STRICT=1` in CI so duplicate slugs, duplicate ids, bad dates, and tag issues fail the pipeline. Advisory messages (missing site URL, optional `cover` alt reminders) log as warnings and do not fail strict mode.

## Image strategy

- **Local assets**: Place files under `public/` and reference them with a root-relative path (e.g. `/og.png`) in frontmatter `cover` or MDX.
- **Remote images**: Configure `images.remotePatterns` in [next.config.ts](../next.config.ts) before using `https://` image URLs with `next/image`.
- **RSS / OG**: Cover images use the `src` string as-is; prefer absolute URLs if feeds or social crawlers must fetch them without a base URL.

## Post-deploy verification

Hit these routes on the **production** origin:

- `/` — homepage, WebSite JSON-LD when `NEXT_PUBLIC_SITE_URL` is set
- `/about` — Person JSON-LD
- `/projects`, `/work`, `/writing`, `/labs`, `/tags` — index pages and metadata
- One **detail** URL per domain (e.g. one project, one writing post)
- `/tags/{known-tag}` — tag hub; an unknown tag path should **404**
- `/sitemap.xml` — non-empty, absolute URLs
- `/writing/feed.xml` — channel and items use absolute links

Optional: use your host’s or a social debugger’s “Open Graph” / “link preview” tool on the homepage and a writing article.

## Authoring and accessibility (light)

- **MDX headings**: Page templates already provide the main `h1`. Start MDX body at `##` / `###` unless the page intentionally has no chrome title.
- **`cover.alt`**: Recommended when `cover.src` is set; content health logs an advisory if `alt` is omitted (decorative images may use empty alt with a deliberate choice).

## Related docs

- [Content authoring](content-authoring.md)
- [Metadata conventions](../src/lib/seo/metadata-conventions.md)

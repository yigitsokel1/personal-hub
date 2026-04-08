# Personal Hub

A **personal hub platform** (not a portfolio template): structured content for projects, work, writing, and labs, rendered with Next.js.

## Stack

- Next.js (App Router), React, TypeScript
- Tailwind CSS
- MDX via `gray-matter` + `next-mdx-remote` (labs)
- Prisma + Postgres (admin-managed writing + projects + work + settings)

## Content

- Writing is admin-managed and database-backed (`/admin/writing`).
- Projects are admin-managed and database-backed (`/admin/projects`).
- Work is admin-managed and database-backed (`/admin/work`).
- Labs remain MDX-managed under `src/content/labs`.
- Legacy work MDX entries are archived under `src/content/_legacy/work/` and are not runtime sources.
- Legacy project MDX entries are archived under `src/content/_legacy/projects/` and are not runtime sources.
- The UI reads through content-source/domain layers; see `CLAUDE.md` for architecture notes.

## Scripts

```bash
npm run dev    # local dev
npm run build  # production build
npm run start  # run production server
npm run lint   # ESLint
npm run migrate:projects-db # import legacy project MDX into DB
npm run migrate:work-db # import legacy work MDX into DB
```

## Environment

Set `NEXT_PUBLIC_SITE_URL` in production (e.g. `https://your-domain.com`, no trailing path) so canonical URLs, Open Graph, Twitter cards, sitemap, RSS, and JSON-LD resolve correctly. See `src/lib/seo/metadata-conventions.md`.

## Icons, manifest, and social preview

- Favicon: `src/app/icon.svg` (served at `/icon.svg`). Apple touch: `src/app/apple-icon.tsx`.
- Web manifest: `public/manifest.webmanifest` (update `name` / `short_name` if you change branding in `src/lib/content/homepage-copy.ts`).
- Default link-preview image: `src/app/opengraph-image.tsx` (route `/opengraph-image`), with Twitter parity via `twitter-image.tsx`. Entry `cover` in MDX overrides the default on detail pages when set.

## Deploy

Designed for static-friendly deployment (e.g. Vercel). Run `npm run build` before shipping.

## Operational docs

- Admin setup: `docs/admin-setup.md`
- Migration runbook: `docs/db-migrations.md`

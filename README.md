# Personal Hub

A **personal hub platform** (not a portfolio template): structured content for projects, work, writing, and labs, rendered with Next.js.

## Stack

- Next.js (App Router), React, TypeScript
- Tailwind CSS
- MDX via `gray-matter` + `next-mdx-remote` (body rendering)
- Prisma + Postgres (admin-managed writing + projects + work + labs + settings)

## Content

- Writing is admin-managed and database-backed (`/admin/writing`).
- Projects are admin-managed and database-backed (`/admin/projects`).
- Work is admin-managed and database-backed (`/admin/work`).
- Labs are admin-managed and database-backed (`/admin/labs`).
- Admin panel is the primary content entry point for all runtime domains.
- Legacy artifacts are documented in `docs/legacy-content.md`.
- The UI reads through content-source/domain layers; see `CLAUDE.md` for architecture notes.

## Scripts

```bash
npm run dev    # local dev
npm run build  # production build
npm run start  # run production server
npm run lint   # ESLint
npm run legacy:migrate:projects-db # archive migration tool (one-time use)
npm run legacy:migrate:work-db # archive migration tool (one-time use)
npm run legacy:migrate:labs-db # archive migration tool (one-time use)
```

## Environment

Set `NEXT_PUBLIC_SITE_URL` in production (e.g. `https://your-domain.com`, no trailing path) so canonical URLs, Open Graph, Twitter cards, sitemap, RSS, and JSON-LD resolve correctly. See `src/lib/seo/metadata-conventions.md`.

## Icons, manifest, and social preview

- Favicon: `src/app/icon.svg` (served at `/icon.svg`). Apple touch: `src/app/apple-icon.tsx`.
- Web manifest: `public/manifest.webmanifest` (update `name` / `short_name` if you change branding in `src/lib/content/homepage-copy.ts`).
- Default link-preview image: `src/app/opengraph-image.tsx` (route `/opengraph-image`), with Twitter parity via `twitter-image.tsx`. Entry `cover` in database records overrides the default on detail pages when set.

## Deploy

Designed for static-friendly deployment (e.g. Vercel). Run `npm run build` before shipping.

## Operational docs

- Admin setup: `docs/admin-setup.md`
- Migration runbook: `docs/db-migrations.md`
- Legacy policy: `docs/legacy-content.md`
- Post-migration snapshot: `docs/post-migration-state.md`

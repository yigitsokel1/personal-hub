# Personal Hub

A **personal hub platform** (not a portfolio template): structured MDX content for projects, work, writing, and labs, rendered with Next.js.

## Stack

- Next.js (App Router), React, TypeScript
- Tailwind CSS
- MDX via `gray-matter` + `next-mdx-remote`

## Content

Content lives under `src/content/{projects,work,writing,labs}` as `.mdx` files with typed frontmatter. The UI reads only through the content layer in `src/lib/content/`—see `CLAUDE.md` for product and architecture notes.

## Scripts

```bash
npm run dev    # local dev
npm run build  # production build
npm run start  # run production server
npm run lint   # ESLint
```

## Environment

Set `NEXT_PUBLIC_SITE_URL` in production (e.g. `https://your-domain.com`, no trailing path) so canonical URLs, Open Graph, sitemap, RSS, and JSON-LD resolve correctly. See `src/lib/seo/metadata-conventions.md`.

## Deploy

Designed for static-friendly deployment (e.g. Vercel). Run `npm run build` before shipping.

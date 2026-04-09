# Release Checklist V1

This checklist is the final go/no-go gate before production deploy.

## 1) Environment Variables

- Confirm `NEXT_PUBLIC_SITE_URL` is set to the production origin.
- Confirm `DATABASE_URL` points to the production database.
- Confirm `ADMIN_PASSWORD` is set and rotated for release.
- Confirm `ADMIN_SESSION_SECRET` is set and high-entropy.

## 2) Database & Migrations

- Run migration status check:
  - `npx prisma migrate status`
- Ensure all pending migrations are applied:
  - `npx prisma migrate deploy`
- Confirm slug redirect table migration is present and applied:
  - `content_slug_redirects`

## 3) Audit Scripts

- Run featured overflow audit:
  - `npm run audit:featured-overflow`
- Review output and ensure no domain exceeds featured policy limits.

## 4) Auth & Preview Security

- Verify `/admin` routes are auth-protected.
- Verify `/preview/*` routes redirect unauthenticated users to login.
- Verify successful login returns to requested preview route when `next` is provided.
- Verify `robots.txt` disallows `/admin` and `/preview`.
- Verify admin/preview routes emit `noindex`.

## 5) Build Quality Gates

- `npm run lint`
- `npm run test:run`
- `npm run build`

Release is blocked unless all three commands pass.

## 6) Manual Smoke Checklist

- Public routes:
  - homepage (`/`)
  - writing detail (`/writing/[slug]`)
  - project detail (`/projects/[slug]`)
  - work detail (`/work/[slug]`)
  - lab detail (`/labs/[slug]`)
  - tags index/detail (`/tags`, `/tags/[tag]`)
  - search (`/search`)
- Admin flow:
  - login
  - CRUD for writing/projects/work/labs
  - publish/unpublish
  - preview routes
- Machine surfaces:
  - sitemap (`/sitemap.xml`)
  - feed (`/writing/feed.xml`)
  - robots (`/robots.txt`)

## 7) Content Quality Pass

- Review homepage featured titles and summaries for clarity.
- Remove weak/noisy featured entries if needed.
- Check writing headlines for readability and specificity.
- Check project/work case-study tone consistency.
- Review lab entries for signal vs noise.

## 8) Rollback Notes

- Application rollback:
  - redeploy previous stable commit/tag
- Content rollback:
  - unpublish problematic entries in admin
- Migration rollback strategy:
  - avoid destructive rollback in production
  - apply forward-fix migration if schema hotfix is required
- Cache/route consistency:
  - revalidate impacted paths after rollback actions

## 9) Post-Deploy Sanity

- Re-run quick smoke on homepage + one detail per domain.
- Validate canonical + OG metadata on key pages.
- Confirm sitemap and feed serve current published content only.
- Confirm old slugs 301 to new slugs after recent slug edits.
- Verify admin login and preview access controls in production.

# Tech Debt / Follow-up Notes

## Sprint 24 migration status

- Projects runtime source is now DB/admin-managed.
- Legacy project MDX files are archived under `src/content/_legacy/projects/`.
- Work runtime source is now DB/admin-managed.
- Legacy work MDX files are archived under `src/content/_legacy/work/`.
- Labs runtime source is now DB/admin-managed.
- Legacy labs MDX files are archived under `src/content/_legacy/labs/`.
- Remaining operational cleanup:
  - resolve Prisma migration drift in local/dev databases before rerunning migration scripts
  - keep migration scripts and docs aligned with `_legacy/*` source paths until legacy cleanup sprint

---

## From Sprint 2

### 1. Runtime validation for enum-like fields

**Resolved (Sprint 5):** [`parse.ts`](../src/lib/content/parse.ts) uses `parseRequiredEnum` / `parseOptionalEnum` for `type`, `status`, `engagementType`, `confidentialityLevel`, and `maturityLevel`.

---

### 2. cover object parsing cleanup

**Resolved (Sprint 5):** `cover` is only set when `cover.src` is a non-empty string; invalid shapes or empty `src` throw with a clear error.

---

### 3. Metadata standardization

Partially addressed by Sprint 5 (`build-metadata.ts`, root `title.template`, `seo` overrides on detail routes).

**Sprint 12:** Default Open Graph / Twitter images use `/opengraph-image` when `NEXT_PUBLIC_SITE_URL` is set; per-entry `cover` overrides on detail routes. Icons (`icon.svg`, `apple-icon`), manifest, and docs are aligned. Optional later work: dynamic OG generation per URL, richer `twitter` fields, or stricter frontmatter docs for `featured` / `updatedAt`.

Priority: low

---

# Tech Debt / Follow-up Notes

## From Sprint 2

### 1. Runtime validation for enum-like fields

**Resolved (Sprint 5):** [`parse.ts`](../src/lib/content/parse.ts) uses `parseRequiredEnum` / `parseOptionalEnum` for `type`, `status`, `engagementType`, `confidentialityLevel`, and `maturityLevel`.

---

### 2. cover object parsing cleanup

**Resolved (Sprint 5):** `cover` is only set when `cover.src` is a non-empty string; invalid shapes or empty `src` throw with a clear error.

---

### 3. Metadata standardization

Partially addressed by Sprint 5 (`build-metadata.ts`, root `title.template`, `seo` overrides on detail routes).

Still open for frontmatter consistency docs or stricter rules if needed for:

- `featured`
- `updatedAt`

Priority: low

---

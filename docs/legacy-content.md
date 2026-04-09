# Legacy Content Policy

This document is the single reference for legacy classification, archive policy, and removal gates.

## Operational Definition

`legacy` is an operational category, not a generic label:

- no runtime import path
- no runtime data source role
- retained only for audit, migration traceability, or historical context

## Runtime Boundary

- Runtime content source for writing, projects, work, and labs is database/admin.
- `src/content/_legacy/*`, `src/content/templates/*`, and `scripts/legacy-migrations/*` are non-runtime.
- Legacy references are allowed only in docs and archive scripts.

## Legacy Inventory and Classification

### A — Keep as archive

- `scripts/legacy-migrations/*` (one-time migration artifacts, audit/reference only)
- `scripts/legacy-migrations/README.md` (retention policy)
- `docs/legacy-content.md` (this policy)

### B — Move to docs/reference

- Historical template structures from:
  - `src/content/templates/project-template.mdx`
  - `src/content/templates/work-template.mdx`
  - `src/content/templates/writing-template.mdx`
  - `src/content/templates/lab-template.mdx`
- These are consolidated in `docs/content-authoring.md` and removed as files.

### C — Delete now

- `src/content/_legacy/projects/*`
- `src/content/_legacy/work/*`
- `src/content/_legacy/labs/*`
- empty `src/content/_legacy/writing/` expectation
- `src/content/templates/*`

Removal in C is gated by parity and runtime checks documented below.

## Parity Gate (Sprint 29)

Before deleting legacy files, confirm for each domain:

- `title`
- `summary`
- `body`
- `tags`
- ordering semantics (`publishedAt` driven)
- `featured`
- key metadata

Sprint 29 parity decision:

- writing: PASS (legacy folder already empty/non-operational)
- projects: PASS
- work: PASS
- labs: PASS

## Runtime Safety Checklist

- no runtime imports from `_legacy`
- no runtime imports from `templates`
- no runtime imports from `legacy-migrations`
- sitemap and tags operate from DB-backed content-source flow

## Archive Policy

- Keep only migration artifacts with clear one-time semantics.
- Keep archive artifacts out of active script paths and runtime paths.
- Any future migration utility must be explicitly marked operational or archive.

# Legacy Content Policy

## Purpose

`src/content/_legacy/*` is retained as historical migration input and audit context from the pre-admin phase.

## Runtime Boundary

- Legacy MDX content is not used as a runtime source.
- Runtime content for writing, projects, work, and labs is admin-managed and DB-backed.
- Any references to legacy files are documentation-only or migration-only.

## Current Structure

```text
_legacy/
  writing/
  projects/
  work/
  labs/
```

Note: if one legacy domain folder is temporarily missing, treat that as a cleanup gap and do not re-introduce runtime fallback.

## Retention and Removal

- Keep legacy files only while migration verification and historical traceability are still needed.
- Planned removal target: Sprint 28.
- Before removal, confirm:
  - no runtime import references under `src/lib/content-source` or public routes
  - migration scripts no longer depend on legacy inputs
  - docs are updated to remove legacy migration guidance

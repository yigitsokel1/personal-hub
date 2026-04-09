# Post-Migration State

This snapshot defines the active system after migration closure.

## Active Content Architecture

- Writing, projects, work, and labs are DB-backed.
- Admin routes are the only operational authoring path:
  - `/admin/writing`
  - `/admin/projects`
  - `/admin/work`
  - `/admin/labs`
- Public routes read through `src/lib/content-source/*` DB adapters.

## Runtime Boundaries

The following are explicitly non-runtime:

- `src/content/_legacy/*`
- `src/content/templates/*` (removed; now docs-only reference)
- `scripts/legacy-migrations/*`

Runtime must not import from these paths.

## Archive Policy

- Archive artifacts are retained only for audit/reference.
- One-time migration scripts live under `scripts/legacy-migrations/`.
- Legacy policy is centralized in `docs/legacy-content.md`.

## Template Strategy

- File-based templates were removed to avoid false active-path signals.
- Historical structure examples are preserved in `docs/content-authoring.md`.

## Preview and Publishing

- Preview route is admin-auth gated and uses DB source with `includeUnpublished` support.
- Published content appears on public routes based on DB `published` and `publishedAt`.

## Operating Rule

If a file/path is archive-only, it must not participate in runtime imports or route data-source logic.

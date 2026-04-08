# Content Authoring Guide

This document is the operational authoring contract for content domains.

All runtime domains are admin-managed and DB-backed. MDX templates and legacy MDX files are historical references only.

## Admin-Managed Domains

### Writing (source of truth: database/admin)

- Creation/edit path: `/admin/writing`.
- MDX files are **not** used for writing runtime content.
- Required fields: `title`, `slug`, `summary`, `body`.
- Optional fields: `tags`, `category`, `series`, `readingTime`, `featured`, `published`, `publishedAt`.
- Rules:
  - `tags` max **3**
  - `featured` max **1** active item
  - if `published = true`, `publishedAt` is required

Legacy note:
- `src/content/templates/writing-template.mdx` is historical reference only.

### Projects (source of truth: database/admin)

- Creation/edit path: `/admin/projects`.
- Public runtime source is DB-only (`getPublishedProjects`, `getProjectBySlug`).
- Required fields: `title`, `slug`, `summary`, `body`, `role`, `problem`, `solution`.
- Structured fields:
  - `stack` (required, non-empty)
  - `architectureHighlights`, `decisions`, `outcomes` (line-based arrays in admin UI)
- Optional fields: `tags`, `featured`, `published`, `publishedAt`, `platform`, `repoUrl`, `liveUrl`, `timeline`.
- Rules:
  - `tags` max **3**
  - `featured` max **2** active projects
  - if `published = true`, `publishedAt` is required
  - `repoUrl` / `liveUrl` must be valid http(s) URLs when provided

Legacy note:
- `src/content/_legacy/projects/` is archival only and not a runtime source.
- `src/content/templates/project-template.mdx` is historical reference only.

### Work (source of truth: database/admin)

- Creation/edit path: `/admin/work`.
- Public runtime source is DB-only (`getPublishedWork`, `getWorkBySlug`).
- Required fields: `title`, `slug`, `summary`, `body`, `client`, `engagementType`, `role`.
- Structured fields:
  - `scope` (required, non-empty)
  - `responsibilities` (required, non-empty)
  - `constraints`, `impact` (line-based arrays in admin UI)
- Optional fields: `tags`, `featured`, `published`, `publishedAt`, `timeline`, `confidentialityLevel`.
- Rules:
  - `tags` max **3**
  - `featured` max **2** active work items
  - if `published = true`, `publishedAt` is required
  - `engagementType` must be one of: `freelance | contract | full-time`
  - `confidentialityLevel` must be one of: `public | limited` when provided

Legacy note:
- `src/content/_legacy/work/` is archival only and not a runtime source.
- `src/content/templates/work-template.mdx` is historical reference only.

### Labs (source of truth: database/admin)

- Creation/edit path: `/admin/labs`.
- Public runtime source is DB-only (`getPublishedLabs`, `getLabBySlug`).
- Required fields: `title`, `slug`, `summary`, `body`, `status`.
- Optional fields: `tags`, `featured`, `published`, `publishedAt`.
- Rules:
  - `tags` max **3**
  - `featured` max **2** active lab items
  - if `published = true`, `publishedAt` is required
  - `status` must be one of: `idea | exploring | building | paused | completed`

Legacy note:
- `src/content/_legacy/labs/` is archival only and not a runtime source.
- `src/content/templates/lab-template.mdx` is historical reference only.

## Shared Content Rules

- Use stable slugs (kebab-case, ASCII).
- Do not use `#` headings in MDX body; start from `##`.
- Tags should be lowercase and kebab-case.
- For legacy MDX references, keep tags concise and editorially meaningful.

## Related Docs

- `docs/admin-setup.md`
- `docs/db-migrations.md`
- `src/lib/seo/metadata-conventions.md`

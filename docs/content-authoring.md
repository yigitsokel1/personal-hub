# Content Authoring Guide

This document is the operational authoring contract for content domains.

## Admin-Managed Domain

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

## MDX-Managed Domains

### Projects / Work / Labs (source of truth: MDX)

- Files live in:
  - `src/content/projects/`
  - `src/content/work/`
  - `src/content/labs/`
- Authoring templates live in `src/content/templates/`.
- Required base fields per MDX entry:
  - `id`, `type`, `title`, `slug`, `summary`, `publishedAt`
- Optional base fields:
  - `updatedAt`, `featured`, `tags`, `cover`, `seo`, `status`

Domain-specific MDX requirements:
- `project`: `role`, `stack`, `problem`, `solution`
- `work`: `client`, `engagementType`, `role`, `scope`, `responsibilities`
- `lab`: `experimentType`, `tools`

## Shared Content Rules

- Use stable slugs (kebab-case, ASCII).
- Do not use `#` headings in MDX body; start from `##`.
- Tags should be lowercase and kebab-case.
- For MDX-managed domains, keep tags concise and editorially meaningful.

## Related Docs

- `docs/admin-setup.md`
- `docs/db-migrations.md`
- `src/lib/seo/metadata-conventions.md`

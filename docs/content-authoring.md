# Content Authoring Guide

This document is the operational authoring contract for content domains.

All runtime domains are admin-managed and DB-backed.

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

## Shared Content Rules

- Use stable slugs (kebab-case, ASCII).
- Do not use `#` headings in MDX body; start from `##`.
- Tags should be lowercase and kebab-case.
- For archive references, keep tags concise and editorially meaningful.

## Historical Template Reference (Docs-Only)

These structures are retained as documentation examples only. They are not runtime sources and are not active file-based authoring paths.

### Project structure example

```md
---
id: project-your-slug-here
type: project
title: "Your project title"
slug: your-slug-here
summary: "One or two sentences: what this system is and why it exists."
publishedAt: "2026-04-01"
tags:
  - nextjs
  - typescript
role: "Your role"
stack:
  - nextjs
  - typescript
problem: "Short summary of the problem."
solution: "Short summary of the approach."
---
## Overview
## Problem
## Solution
## Architecture
## Key Decisions
## Outcomes
```

### Work structure example

```md
---
id: work-your-slug-here
type: work
title: "Engagement title"
slug: your-slug-here
summary: "What the engagement was and expected outcome."
publishedAt: "2026-04-01"
client: "Public or anonymized client label"
engagementType: contract
role: "Your role"
tags:
  - api-design
  - reliability
scope:
  - "Area one"
responsibilities:
  - "Responsibility one"
---
## Context
## Scope
## Responsibilities
## Constraints
## Delivery / impact
```

### Lab structure example

```md
---
id: lab-your-slug-here
type: lab
title: "Experiment name"
slug: your-slug-here
summary: "What you tried in one sentence."
publishedAt: "2026-04-01"
tags:
  - tool-one
status: exploring
---
## Experiment
## Hypothesis
## Process
## Learnings
## Next steps
```

### Writing structure example

Writing is fully admin-driven. Historical MDX writing used:

- `title`
- `slug`
- `summary`
- markdown body (`##` heading start)

## Related Docs

- `docs/admin-setup.md`
- `docs/db-migrations.md`
- `docs/legacy-content.md`
- `src/lib/seo/metadata-conventions.md`

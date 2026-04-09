# Runtime Content Architecture

This document defines the active content runtime boundary for the platform.

## Source Of Truth

- Source of truth: database tables (`projects`, `work`, `writing`, `labs`).
- Authoring source: admin panel routes under `/admin/*`.
- Body format: MDX string stored in DB `body` fields.
- Rendering engine: `next-mdx-remote/rsc` via `src/components/content/content-body.tsx`.
- File-based content source: deprecated and removed from runtime paths.

## Preview Model

- Preview uses the same presentation path and component tree as public detail pages.
- The only difference is data access: preview reads with `includeUnpublished`.
- Public routes use published-only reads.

## Domain Pipeline

`persistence -> content-source -> domain -> presentation -> UI`

- persistence: Prisma + Postgres rows
- content-source: `src/lib/content-source/*`
- domain: `src/lib/domain/*`
- presentation: metadata + page composition
- UI: app routes + components

## Runtime Boundary Classification

- `src/lib/content/get-content.ts`: DELETE (legacy file-reader, removed)
- `src/lib/content/parse.ts`: DELETE (legacy frontmatter parser, removed)
- `src/lib/content/related.ts`: DELETE (legacy file-based related calculator, removed)
- `src/lib/content/content-health.ts`: REWRITE (now DB-backed through content-source)
- `src/lib/mdx/*`: ACTIVE (render mapping/components for MDX body rendering)
- `src/components/content/content-body.tsx`: ACTIVE (runtime MDX renderer)

## Truth Language

- Correct: file-based MDX authoring removed.
- Correct: runtime body rendering is still MDX-based.
- Correct: DB is the runtime source of truth.
- Correct: content files are no longer runtime source inputs.

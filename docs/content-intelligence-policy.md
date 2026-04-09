# Content Intelligence Policy (Sprint 33)

This policy defines how content is selected and ranked across homepage, related content, tags, and search surfaces.

## Related Content

- Scope: same-domain only (no cross-domain related in this sprint).
- Exclusions: current content and unpublished entries.
- Ranking signals:
  - shared tags (primary)
  - recency bonus (secondary)
  - very small featured bonus (tie softener)
- Fallback: if tag matches are weak, use latest same-domain published entries.
- Limit: maximum 3 related items per detail page.

## Homepage Selection

- Featured caps:
  - writing: max 1
  - projects: max 2
  - work: max 2
  - labs: max 2
- Fallback: if featured is missing, use recent published entries.
- De-duplication: the same content item must not appear in multiple homepage sections.
- Empty behavior: when a domain has no content, hide that section.
- Ordering intent:
  1. featured sections
  2. recent highlights
  3. domain highlights

## Tag Surfaces

- `/tags` ordering: usage count descending, alphabetic tiebreak.
- Tag display: convert canonical slug form to readable title form (e.g. `system-design` -> `System Design`).
- `/tags/[tag]` view:
  - group results by domain (Writing, Projects, Work, Labs)
  - show total and per-domain counts
  - keep weak tags visible with a clean minimal presentation

## Search Foundation

- Shared search document shape:
  - `domain`, `slug`, `title`, `summary`, `tags`, `searchableText`, `bodyText`
- Initial server-side ranking:
  - exact title match > tag match > summary contains > body contains (body scoring is gated for longer queries)
- Scope of this sprint:
  - minimal `/search?q=` experience
  - no external search infrastructure

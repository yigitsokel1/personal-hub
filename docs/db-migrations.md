# DB Migrations Runbook

This runbook documents migration drift seen during Writing domain rollout and how to handle it safely.

## Current State

- Writing model evolved across multiple sprints.
- One historical migration folder was reused as a compatibility placeholder.
- Local databases may report drift between migration history and live schema.

## Why Drift Happened

- Early iterative schema changes were applied before migration history stabilized.
- Manual/local fixes were used to keep development moving.
- Result: migration chain and live DB can diverge in development environments.

## Safe Local Workflow

1. Pull latest branch.
2. Run `npx prisma generate`.
3. If `prisma migrate dev` works, continue normally.
4. If drift is reported:
   - prefer explicit SQL patch (`prisma db execute`) for non-destructive alignment
   - re-run `npx prisma generate`
   - verify with `npx tsc --noEmit` and `npm run lint`

## When Reset Is Safe

`npx prisma migrate reset` is safe only when:
- environment is local/dev
- data can be dropped
- no shared QA data is needed

Do not use reset on shared or production-like databases.

## When Manual Baseline Is Better

Use manual baseline/alignment when:
- local data must be preserved
- migration drift is schema-only (column naming/order/history mismatch)
- team needs continuity without destructive reset

## Related Docs

- `docs/admin-setup.md`
- `docs/content-authoring.md`

# Legacy Migration Scripts

These scripts are retained for historical audit/reference only.

## Policy

- one-time migration artifacts from MDX to DB
- not part of runtime
- not part of default development flow
- kept only for controlled recovery/backfill scenarios

## Safety Notes

- verify `DATABASE_URL` target before execution
- run only when backfill/recovery is explicitly needed
- scripts are idempotent by `slug` but still mutate data

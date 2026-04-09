# Admin Setup

This guide boots the admin panel on a fresh local database.

## 1) Environment setup

1. Copy `.env.example` to `.env`.
2. Fill required values:
   - `DATABASE_URL`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`

## 2) Install dependencies

```bash
npm install
```

## 3) Apply Prisma migrations

```bash
npx prisma migrate dev
```

## 4) Seed site settings

```bash
npm run seed:settings
```

This creates `site_settings` row with `id=1` only when missing.

## 5) Run local dev server

```bash
npm run dev
```

## 6) Admin login flow

1. Open `http://localhost:3000/admin/login`.
2. Sign in with `ADMIN_PASSWORD`.
3. You will be redirected to `/admin/settings`.
4. Writing CMS operations live under `/admin/writing` (create/edit/delete).
5. Projects CMS operations live under `/admin/projects` (create/edit/delete).
6. Work CMS operations live under `/admin/work` (create/edit/delete).

## Local dev workflow

1. Make schema changes in `prisma/schema.prisma`.
2. Run `npx prisma migrate dev`.
3. Update admin/public code.
4. Re-test:
   - `/admin/login`
   - `/admin/settings`
   - `/admin/writing`
   - `/admin/writing/new`
   - `/admin/projects`
   - `/admin/projects/new`
   - `/admin/work`
   - `/admin/work/new`
   - `/writing`
   - `/projects`
   - `/work`

## Migration notes

If you see Prisma drift warnings in local development, follow:
- `docs/db-migrations.md`

## Legacy migration helpers (archive)

After applying migrations, import project MDX into DB with:

```bash
npm run legacy:migrate:projects-db
```

This script is archived under `scripts/legacy-migrations/`, reads historical MDX inputs, and upserts by `slug`.

## Legacy migration helper (work)

After applying migrations, import work MDX into DB with:

```bash
npm run legacy:migrate:work-db
```

This script is archived under `scripts/legacy-migrations/`, reads historical MDX inputs, and upserts by `slug`.

## Legacy migration helper (labs)

```bash
npm run legacy:migrate:labs-db
```

This script is archived under `scripts/legacy-migrations/` and should be used only for controlled backfill/recovery.

For archive policy and runtime boundaries, see:
- `docs/legacy-content.md`

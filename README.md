# Deportal (Next.js 14 App Portal)

Production-ready personal app portal dashboard built with Next.js 14 App Router, TypeScript, Tailwind, Prisma, NextAuth, and SQLite.

## Features
- Credentials auth (email/password) with JWT session
- Role-based access (`USER`, `ADMIN`)
- Protected routes via middleware (`/`, `/admin`)
- Dashboard with grouped apps, search, category filters, favorites, and recent opens
- Admin portal with tabs for apps, categories, users, and settings
- Prisma schema + seed with initial admin and sample data

## Default Admin
- **Email:** `admin@local.test`
- **Password:** `Admin123!`

## Setup
> In production (e.g., Vercel), set either `AUTH_SECRET` or `NEXTAUTH_SECRET` to a long random value.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env
   ```
3. Run migration:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Seed database:
   ```bash
   npm run prisma:seed
   ```
5. Start dev server:
   ```bash
   npm run dev
   ```

## Production checks
```bash
npm run lint
npm run build
```

## Database URL notes
- `DATABASE_URL` must be set in production.
- As a safety fallback, if it is missing the app uses `file:/tmp/deportal.db` on Vercel and `file:./prisma/dev.db` locally.
- For stable production data, configure a persistent database URL (recommended: Postgres).

## Auth secret notes
- `AUTH_SECRET` is preferred in this project.
- `NEXTAUTH_SECRET` is also supported for compatibility.
- If neither is provided, the app now falls back to Vercel-provided env (`VERCEL_PROJECT_PRODUCTION_URL` or `VERCEL_URL`) to prevent runtime crashes, but you should still set an explicit strong secret in production.

## Switching to Postgres
- Update `prisma/schema.prisma` datasource `provider` to `postgresql`
- Set `DATABASE_URL` accordingly
- Run a new migration (`npx prisma migrate dev`)

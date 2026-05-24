# ketic-pilot

KETIC pilot dashboard — a Next.js 14 app for showing prospect hotels what
they're bleeding in energy costs before any KETIC hardware is installed.
Data comes from the hotel's PMS (Cloudbeds). Hotels view a read-only URL
with a slug; the founder runs the admin side.

## Stack

- Next.js 14 (App Router) + TypeScript (strict)
- Tailwind CSS (custom design tokens only)
- Supabase (Postgres) via `@supabase/supabase-js`
- Recharts for the trend bar chart
- Lucide React (icons only when functionally necessary)
- Deployed on Vercel

No component libraries. No icon libraries beyond Lucide. Every component
is hand-built in `/components`.

## Setup

1. **Clone and install**
   ```bash
   git clone <repo> ketic-pilot
   cd ketic-pilot
   npm install
   ```

2. **Create a Supabase project**
   - Go to https://supabase.com and create a new project.
   - Copy the project URL, anon key, and service role key from
     **Settings → API**.

3. **Run the migration + seed**
   - Open the Supabase **SQL editor**.
   - Paste the contents of `supabase/migrations/001_initial.sql`.
   - Run it. You should see one property (`The Meridian`) and ~335
     room events inserted.

4. **Configure environment**
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=        # from Supabase Settings → API
   NEXT_PUBLIC_SUPABASE_ANON_KEY=   # from Supabase Settings → API
   SUPABASE_SERVICE_ROLE_KEY=       # from Supabase Settings → API (server only)
   ADMIN_PASSWORD=                  # your chosen admin password
   ```

5. **Run dev server**
   ```bash
   npm run dev
   ```

6. **Open the admin**
   - Visit `http://localhost:3000/admin`.
   - Enter the `ADMIN_PASSWORD` you set in `.env.local`.

7. **Open the hotel dashboard**
   - Visit `http://localhost:3000/dashboard/the-meridian-austin` to see
     the seeded data.

8. **Deploy to Vercel**
   ```bash
   vercel
   ```
   In the Vercel dashboard, set the four env vars from `.env.local`.
   Redeploy. The dashboard is then live at
   `https://<your-deployment>.vercel.app/dashboard/the-meridian-austin`.

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run typecheck` — TS compile check
- `npm run lint` — Next lint
- `npm run seed` — regenerate seed SQL via the tsx-compatible mjs script
  (`node scripts/generate-seed.mjs > supabase/seed.sql`)

## Cloudbeds sync

The sync runs on demand from the admin **Sync now** button, which POSTs
to `/api/sync/[propertyId]`. The endpoint also accepts a service role
bearer token so it can be triggered from Vercel Cron later.

The sync is a no-op in dev unless the property row has a real
`api_key`. The seeded property has `null` for `api_key` — the seed
data exists so the dashboard renders for sales demos.

## Project map

```
app/
  dashboard/[slug]/page.tsx     ← hotel-facing dashboard
  admin/page.tsx                ← password gate → property list
  admin/[slug]/page.tsx         ← admin detail view
  api/admin/auth/route.ts       ← password POST / DELETE
  api/admin/properties/route.ts ← create property
  api/sync/[propertyId]/route.ts← trigger Cloudbeds sync
components/
  dashboard/                    ← Header, Hero, TrendChart, RoomTable, ...
  admin/                        ← PasswordGate, PropertyList, AddPropertyForm, ...
  ui/                           ← Card, Button, Input, Select, Badge, Skeleton, Table
lib/
  supabase/{client,server,types}.ts
  cloudbeds/{client,sync,types}.ts
  calculations.ts               ← energy math + constants
  format.ts                     ← currency / hours / date formatters
  cn.ts                         ← clsx + tailwind-merge
  admin-auth.ts                 ← cookie check
supabase/migrations/001_initial.sql
scripts/generate-seed.mjs       ← deterministic seed generator
```

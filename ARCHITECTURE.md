# Money Diary Architecture (Phase 3)

## Current State

- Next.js App Router
- TypeScript (strict)
- Tailwind
- LocalStorage persistence (v1)
- No backend yet
- No auth yet

## Key Modules

- `app/`: route pages and layouts (keep pages thin)
- `components/`: client components (form, lists, dashboard UI)
- `lib/types.ts`: domain types (`Transaction`, etc.)
- `lib/storage/transactions.ts`: localStorage repository (browser-only access; SSR-safe no-op guards)
- `lib/analytics.ts`: pure aggregation functions for dashboard
- `lib/format.ts`: money parsing/formatting utilities
- `lib/categories.ts`: extensible category definitions (id + label)

## Data Model (V0)

Transaction:

- id: uuid
- occurredAt: ISO string
- amountCents: integer (cents)
- currency: 'USD'
- merchantRaw: string
- category: string (category id)
- note?: string
- createdAt: ISO string

## Design Decisions

- Store money in integer cents (avoid floating point issues)
- Versioned storage key for localStorage
- ISO strings for timestamps
- Keep SSR-safe boundaries: localStorage only accessed in client components or guarded functions
- Keep analytics pure and separate from storage/UI

## Part 4 Plan (Database + API Layer)

Goal: replace local-only persistence with a real backend while keeping UI and analytics stable.

- Database: Postgres (e.g., Supabase/Neon)
- ORM: Prisma
- API layer: Next.js Route Handlers under `app/api/*`
- Keep aggregation logic reusable (analytics stays in `lib/analytics.ts`).
- Initially single-user (no auth), then add `userId` in Part 5 for per-user data isolation.

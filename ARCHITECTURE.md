# Money Diary Architecture (Phase 1)

## Current State

- Next.js App Router
- TypeScript strict
- Tailwind
- LocalStorage persistence (v1)
- No backend
- No auth

## Data Model (V0)

Transaction:
- id: uuid
- occurredAt: ISO string
- amountCents: integer
- currency: 'USD'
- merchantRaw: string
- category: string
- note?: string
- createdAt: ISO string

## Design Decisions

- Store money in cents (avoid floating point)
- Versioned localStorage key
- ISO strings for all timestamps
- No SSR-side storage access

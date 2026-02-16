## money-diary

A personal expense tracking + analytics MVP built with Next.js App Router, TypeScript, and Tailwind CSS.
This project is also used to practice an AI-coding workflow (iterate in small parts, keep architecture clean, and ship usable increments).

## Progress

- [x] Part 0: scaffold + tooling (Next.js App Router, TS, Tailwind, ESLint, Prettier)
- [x] Part 1: local transaction data layer (localStorage v1)
- [x] Part 2: Add Expense form + recent transactions list
- [x] Part 3: Monthly dashboard analytics (tables, no charts)
- [ ] Part 4: Database + API layer (Postgres + Prisma + route handlers)
- [ ] Part 5: Auth + per-user data isolation
- [ ] Part 6: ML features (auto categorization + feedback loop)

## Current Features (Phase 3)

- Add expense with validation (string-based dollars → cents conversion)
- LocalStorage persistence with versioned key
- Double-submit prevention
- Monthly dashboard:
  - Month selector
  - Total monthly spending
  - Category breakdown (table)
  - Top merchants (table)
- SSR-safe client components
- Hydration mismatch fixed

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Scripts

- `npm run dev` start local dev server
- `npm run build` production build
- `npm run start` run built app
- `npm run lint` run ESLint
- `npm run format` auto-format with Prettier
- `npm run format:check` check formatting with Prettier
- `npm run db:generate` generate Prisma client
- `npm run db:migrate` run Prisma dev migrations
- `npm run db:studio` open Prisma Studio

## Database Setup (Part 4A)

1. Set `DATABASE_URL` in `.env.local`:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
```

2. Run Prisma generate + migration:

```bash
npm run db:generate
npm run db:migrate
```

3. Open Prisma Studio:

```bash
npm run db:studio
```

Then open the URL shown by Studio and inspect the `Transaction` model (`transactions` table).

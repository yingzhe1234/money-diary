# Agent Rules

- Keep App Router pages thin; put logic in lib/ or components/.
- Do not access localStorage in server components; client-only or guarded utilities only.
- Money is stored as integer cents (`amountCents`).
- Timestamps are ISO strings.
- Prefer minimal dependencies.
- For Part 4: use Postgres + Prisma + Next.js route handlers under `app/api/*`.
- Do not add auth until Part 5.
- Run: npm run lint, npm run format:check, npm run build after changes.

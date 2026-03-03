# Database (Drizzle + Postgres)

## Env

Set `DATABASE_URL` in `apps/www/.env`.

Example:

```bash
DATABASE_URL=postgres://postgres:postgres@localhost:5432/let_traveling
```

## Commands

From `apps/www`:

```bash
bun run db:generate
bun run db:migrate
bun run db:studio
```

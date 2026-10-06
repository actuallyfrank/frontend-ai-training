# api/AGENTS.md

Express 5 + Zod, in-memory store (`src/store.ts`), resets on restart. Single player, no auth.

- Routes in `src/routes/` stay thin: parse/validate, call a service, send the response.
- Business logic in `src/services/`. Zod schemas in `src/schemas/`.
- Validate every request body with `schema.safeParse()`; on failure `throw validationError(result.error)`.
- Errors: `throw new HttpError(status, CODE, message)`. Responses always `{ error: { code, message } }`.
- `src/routes/upgrades.ts` is legacy (logic inline): don't copy it.
- Every route gets a supertest test next to it (`routes/<name>.test.ts`), using `resetStore()` in `beforeEach`.
- Bind to 127.0.0.1; port via `API_PORT`.

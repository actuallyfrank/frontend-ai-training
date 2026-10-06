---
paths:
  - "**/*.test.{ts,tsx}"
---

# TEST-01: Tests next to the component, queried like a user

- Place `Thing.test.tsx` next to `Thing.tsx`. No `__tests__/` folders.
- Query with `getByRole` (with `name`), then `getByLabelText`, then `getByText`.
- Never use `data-testid` or `getByTestId`. Use `userEvent`, not `fireEvent`.
- Use the helpers in `web/src/test/` (`renderWithGame`, `fakeGame`). Mock hooks from `web/src/api/`, not global `fetch`.

Why: tests that query like users also verify accessibility and survive refactors.

✅ `await userEvent.click(screen.getByRole('button', { name: 'Add Intern to wishlist' }))`
❌ `fireEvent.click(screen.getByTestId('star-intern'))`

Full details: docs/ai/testing.md. Mention TEST-01 under `Applied rules:`.

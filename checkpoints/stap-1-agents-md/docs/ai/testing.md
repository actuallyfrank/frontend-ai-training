# Testing

- Vitest + Testing Library + user-event. Run with `npm test`.
- Put the test next to the component: `Thing.tsx` → `Thing.test.tsx`. No `__tests__/` folders.
- Query like a user: `getByRole` (with `name`) first, then `getByLabelText`, then `getByText`.
  No `data-testid`, no `getByTestId`. If you can't find an element by role or label, fix the
  component's accessibility.
- Interact with `userEvent`, not `fireEvent`.
- Helpers in `web/src/test/`:
  - `renderWithGame(ui, { game, route })` renders inside a router with a fake `useGame()` state
  - `fakeGame()`, `testUpgrades`, `testSave()` in `fixtures.ts`
- Mock hooks from `web/src/api/` with `vi.mock(...)`; don't stub global `fetch`.

Reference: `web/src/features/profile/ProfileForm.test.tsx`.

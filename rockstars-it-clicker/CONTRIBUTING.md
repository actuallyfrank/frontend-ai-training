# Contributing

Thanks for helping out with Rockstars IT Clicker! This document describes how we work. It started
as a few notes and grew over time, so grab a coffee (preferably not from the Coffee Machine
upgrade, those are imaginary).

## Branches and commits

We work on short-lived branches off `main` and merge through pull requests. Name your branch after
what it does, for example `feature/leaderboard` or `fix/autosave-race`. We like small commits with
a clear message in the imperative mood ("Add wishlist endpoint", not "added stuff"). If a commit
needs a long explanation, that usually means it should have been two commits. Rebase on `main`
before you open a pull request so the history stays readable, and please don't force-push to
someone else's branch without asking.

Every pull request needs one approval and a green CI run. CI runs lint, Stylelint, the TypeScript
checks and all tests, so it's worth running `npm run lint && npm run lint:css && npm run typecheck
&& npm test` locally before you push.

## How we write front-end code now

The codebase has been around for a while and not everything looks the same. Over the last months
we settled on a way of working, and `web/src/features/profile` is the best example of how we write
features now. When in doubt, look at how the profile feature does it. Some older parts of the app
still do things differently; they will be migrated when someone touches them.

Features live in their own folder under `web/src/features/<name>/`, together with their styles and
tests. Shared building blocks live in `web/src/ui/` (components), `web/src/lib/` (helpers and game
logic) and `web/src/api/` (server communication). The old `web/src/components/` folder dates from
before we used feature folders; please don't add new things there.

For styling we use the design tokens in `web/src/styles/tokens.css`: every color, spacing value and
radius comes from a CSS custom property, such as `var(--rs-spotlight)` for our accent color or
`var(--rs-space-3)` for spacing. Hardcoded hex values and pixel spacing break the light theme, so
we avoid them in components. Each component has its own plain CSS file with BEM-style class names.

We build screens from the components in `web/src/ui/`: Button, Input, Select, Card and Badge.
They take care of focus styles, labels and theming, which is easy to forget when you style a native
element yourself. If a component is missing something you need, extend it in `ui/` rather than
building a one-off version inside your feature. The Card, for instance, already supports a
highlighted state.

All communication with the API goes through the client in `web/src/api/client.ts` and small hooks
next to it, like `useProfile`. The client maps errors to `ApiError` and knows the base URL, so
components never call `fetch` themselves. A hook returns `data`, `error` and `isLoading`, and the
component shows a loading state and a translated error message.

We try hard not to add dependencies. Before you reach for a package, check `web/src/lib/`:
`compact()` formats big numbers ("1.2M") and `humanizeSeconds()` formats durations ("2m 30s"). If
you really need a new package, bring it up in the team channel first.

Every text a player can see is translated. We use react-i18next with the files in
`web/src/locales/`, and every key must exist in both `en.json` and `nl.json`. Upgrade names and
flavour texts are translated too, under `upgrades.<id>`.

Tests sit next to the component they test (`ProfileForm.test.tsx` next to `ProfileForm.tsx`). We
use Testing Library and query the way a user would: by role, label or text. We don't add
`data-testid` attributes. If you can't find an element by its role or label, that's often an
accessibility problem in the component.

Accessibility is part of done. Anything clickable is a real `<button>` or a link, never a `div`
with a click handler. Every input has a visible label, and toggle buttons expose their state with
`aria-pressed`. Check new screens with the keyboard only at least once.

## The API

The API lives in `api/` and is a small Express app. Routes are thin and delegate to `services/`;
every request body is validated with a Zod schema in `schemas/`, and errors always have the shape
`{ "error": { "code": "...", "message": "..." } }`. Add a supertest test for every new route.

## Releases

We don't really release this game, but we keep a short changelog in the pull request descriptions.
Mention user-visible changes, migrations of old code, and anything that changes the savegame
format, because changing that format resets everyone's progress after an API restart anyway.

Rock on! 🤘

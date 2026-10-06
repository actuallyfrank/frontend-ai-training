# 🎸 Rockstars IT Clicker

An idle clicker game about building an IT company. Hit **Commit** to write Lines of Code (LoC),
then spend them on interns, senior devs, rubber ducks, Kubernetes clusters and Friday drinks.
Your team writes code for you while you sleep (or while you're in a meeting).

## Requirements

- Node.js 20.19 or newer
- npm 10 or newer

## Getting started

```bash
npm install
npm run dev
```

- Game: http://localhost:5173
- API: http://127.0.0.1:3000 (the web app proxies `/api` to it)

Port already in use? Pick other ports:

```bash
WEB_PORT=5174 API_PORT=3001 npm run dev
```

The API keeps everything in memory. Restarting it starts a fresh game.

## Scripts

| Command             | What it does                        |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Starts the web app and the API      |
| `npm run lint`      | ESLint for `web/` and `api/`        |
| `npm run lint:css`  | Stylelint for the web app           |
| `npm run typecheck` | TypeScript checks for both packages |
| `npm test`          | Vitest for both packages            |
| `npm run format`    | Prettier                            |

## Project layout

```
web/   React 19 + Vite front-end
api/   Express + Zod API (upgrades, savegame, wishlist, profile)
```

See `CONTRIBUTING.md` for how we work on this codebase.

## Styling

Colors and spacing live in `src/styles/theme.ts`. Import `COLORS` and `SPACING` from there and use
them in your components, so the game keeps its stage-light look everywhere.

## Workshop

This repo is used in the workshop "Context engineering voor front-end developers".
Your assignment is in `TASK.md`.

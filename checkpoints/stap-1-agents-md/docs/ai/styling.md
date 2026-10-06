# Styling

All styling uses plain CSS files next to the component, with BEM-style class names
(`block__element--modifier`), and CSS custom properties from `web/src/styles/tokens.css`.

**Why tokens:** colours follow the Team Rockstars house style (yellow `--rs-spotlight` on black), and the game has a dark "on stage" theme and a light "soundcheck" theme
(`prefers-color-scheme`). Hardcoded values break the light theme.

## Token table

| Need | Token |
| --- | --- |
| Page background | `--rs-stage-900` |
| Panel background | `--rs-stage-800` |
| Card background | `--rs-stage-700` |
| Borders, subtle surfaces | `--rs-stage-600` |
| Primary text | `--rs-amp-100` |
| Secondary / muted text | `--rs-amp-300`, `--rs-amp-500` |
| **Accent** (highlight, focus, primary action, "spotlight colour") | `--rs-spotlight` |
| Accent background | `--rs-spotlight-soft` |
| Text on accent | `--rs-spotlight-ink` |
| Success / affordable | `--rs-encore` |
| Warning / error | `--rs-pyro` |
| Info, links | `--rs-signal` |
| Spacing 4 / 8 / 12 / 16 / 24 / 32 px | `--rs-space-1` … `--rs-space-6` |
| Radius | `--rs-radius-sm`, `--rs-radius-md`, `--rs-radius-pill` |
| Fonts | `--rs-font-body`, `--rs-font-display`, `--rs-font-mono` |
| Glow / focus | `--rs-shadow-glow`, `--rs-focus-ring` |

There is no `--color-*` or `--accent` token. Don't invent token names: if it's not in
`tokens.css`, it doesn't exist.

## Highlighting something

Use `<Card highlighted>` from `web/src/ui/`. It draws a `--rs-spotlight` border and glow.

## Legacy

`web/src/styles/theme.ts` (`COLORS`, `SPACING`) is deprecated. Don't import it in new code.
The README section that mentions it is outdated.

```css
/* ✅ */
.wishlist-badge {
  padding: var(--rs-space-1) var(--rs-space-2);
  color: var(--rs-amp-300);
}

/* ❌ */
.wishlist-badge {
  padding: 4px 8px;
  color: #a69fc7;
}
```

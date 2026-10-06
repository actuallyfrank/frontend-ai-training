# Data fetching

All server communication goes through `web/src/api/client.ts`:

```ts
import { apiClient } from '../../api/client';
const profile = await apiClient.get<Profile>('/profile'); // base URL /api is added for you
```

The client maps non-2xx responses and network failures to `ApiError { status, code, message }`.

## Hooks

Components never call the client (or `fetch`) directly. Each resource gets a small hook in
`web/src/api/`, modelled on `useProfile.ts`:

- returns `{ data, error, isLoading }` plus mutation functions (e.g. `update`)
- ignores results after unmount (`cancelled` flag)
- the component renders a loading state (`role="status"`) and a translated error (`role="alert"`)

Game data (upgrades, LoC, owned, LoC/s) is already loaded by `GameProvider`. Read it with
`useGame()` from `web/src/lib/game`, don't fetch upgrades again.

## Endpoints

| Method + path | Response |
| --- | --- |
| `GET /api/upgrades` | `Upgrade[]` (`name` is deprecated: translate via `upgrades.<id>.name`) |
| `GET /api/save`, `PUT /api/save` | savegame (handled by `GameProvider`) |
| `GET /api/wishlist` | `{ upgradeIds: string[] }` |
| `POST /api/wishlist/:upgradeId` | `201 { upgradeIds }`, `404` for unknown ids |
| `DELETE /api/wishlist/:upgradeId` | `200 { upgradeIds }` |
| `GET /api/profile`, `PUT /api/profile` | profile |

Errors always look like `{ "error": { "code": "...", "message": "..." } }`.

Never store server data in `localStorage` instead of the API.

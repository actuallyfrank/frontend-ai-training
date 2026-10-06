# it-clicker/api Specification

## Purpose

Defines the HTTP API of Rockstars IT Clicker that serves the upgrade catalogue and stores the savegame, wishlist and profile for a single player.

## Requirements

### Requirement: Upgrade catalogue
`GET /api/upgrades` SHALL return the 16 seed upgrades, each with `id`, `category` (`people` | `tools` | `culture` | `infra`), `name` (English, documented as deprecated), `baseCost`, `locPerSecond` and `clickPower`.

#### Scenario: List upgrades
- **WHEN** a client requests `GET /api/upgrades`
- **THEN** the response is `200` with an array of 16 upgrades including `{ "id": "intern", "category": "people", "baseCost": 15, "locPerSecond": 0.1, "clickPower": 0 }`

### Requirement: Savegame storage
`GET /api/save` SHALL return `{ loc, owned, startedAt, totalLoc }` (a fresh savegame with zero values and the current time if none exists). `PUT /api/save` SHALL validate the body and store it, responding `204`.

#### Scenario: Fresh savegame
- **WHEN** a client requests `GET /api/save` before anything was saved
- **THEN** the response is `200` with `loc: 0`, `owned: {}`, `totalLoc: 0` and a `startedAt` timestamp

#### Scenario: Invalid savegame
- **WHEN** a client sends `PUT /api/save` with `loc: -5`
- **THEN** the response is `400` with body `{ "error": { "code": "VALIDATION_ERROR", "message": "..." } }`

### Requirement: Wishlist storage
`GET /api/wishlist` SHALL return `{ upgradeIds: string[] }`. `POST /api/wishlist/:upgradeId` SHALL add the id (idempotently) and respond `201` with the updated list, or `404` for an unknown upgrade id. `DELETE /api/wishlist/:upgradeId` SHALL remove it and respond `200` with the updated list.

#### Scenario: Add to wishlist
- **WHEN** a client sends `POST /api/wishlist/rockstar`
- **THEN** the response is `201` with `{ "upgradeIds": ["rockstar"] }`

#### Scenario: Unknown upgrade
- **WHEN** a client sends `POST /api/wishlist/unicorn`
- **THEN** the response is `404` with `{ "error": { "code": "NOT_FOUND", "message": "..." } }`

#### Scenario: Add twice
- **WHEN** a client posts the same upgrade id twice
- **THEN** it appears only once in `upgradeIds`

### Requirement: Profile storage
`GET /api/profile` SHALL return `{ companyName, avatar, language }` with sensible defaults. `PUT /api/profile` SHALL validate that `companyName` is 2–40 characters, `avatar` is one of 🎸 🥁 🎤 🎹 and `language` is `en` or `nl`, and respond `200` with the stored profile.

#### Scenario: Valid update
- **WHEN** a client sends `PUT /api/profile` with `{ "companyName": "Byte Me BV", "avatar": "🥁", "language": "nl" }`
- **THEN** the response is `200` with the same profile, and a subsequent `GET` returns it

#### Scenario: Invalid avatar
- **WHEN** a client sends `PUT /api/profile` with `avatar: "🦄"`
- **THEN** the response is `400` with the standard error body

### Requirement: Uniform error format
Every error response SHALL have the shape `{ "error": { "code": string, "message": string } }` with an appropriate HTTP status.

#### Scenario: Unknown route
- **WHEN** a client requests `GET /api/does-not-exist`
- **THEN** the response is `404` with the standard error body

### Requirement: Single player, in-memory
The API SHALL serve one implicit player without authentication. Data SHALL be kept in memory, seeded at startup; data loss on server restart is acceptable.

#### Scenario: Restart resets state
- **WHEN** the API process restarts
- **THEN** savegame, wishlist and profile return to their seeded defaults

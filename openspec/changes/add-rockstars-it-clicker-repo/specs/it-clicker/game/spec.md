# Spec Delta

## Purpose

Defines the core idle-clicker gameplay of Rockstars IT Clicker: earning Lines of Code by clicking and passively, upgrade pricing, persistence of progress, and the always-visible header.

## ADDED Requirements

### Requirement: Commit button earns Lines of Code
The game SHALL show a prominent Commit button on the Game page. Each activation SHALL add the player's current click power in Lines of Code (LoC). Click power SHALL start at 1 and increase by the `clickPower` of every owned upgrade (per unit owned). The button SHALL be operable by mouse and keyboard and SHALL have an accessible, translated name.

#### Scenario: First click
- **WHEN** a new player with 0 LoC and no upgrades activates the Commit button once
- **THEN** the LoC total becomes 1

#### Scenario: Click power from upgrades
- **WHEN** the player owns 2 Rubber Ducks (clickPower 1 each) and activates the Commit button
- **THEN** the LoC total increases by 3

#### Scenario: Keyboard activation
- **WHEN** the Commit button has focus and the player presses Enter or Space
- **THEN** LoC is added exactly as with a mouse click

### Requirement: Passive income
The game SHALL add LoC passively based on LoC per second, where LoC per second is the sum of `locPerSecond × owned` over all upgrades. Passive income SHALL be applied at least 10 times per second while the app is open, so the counter visibly increases smoothly.

#### Scenario: Income accumulates over time
- **WHEN** the player owns 10 Interns (0.1 LoC/s each) and waits 10 seconds
- **THEN** the LoC total has increased by approximately 10 (±1)

#### Scenario: No upgrades, no passive income
- **WHEN** the player owns no upgrades with `locPerSecond` and does not click
- **THEN** the LoC total does not change

### Requirement: Upgrade pricing
The price of an upgrade SHALL be `ceil(baseCost × 1.15^owned)`, where `owned` is the number already owned by the player. Buying an upgrade SHALL only succeed when the player's LoC is greater than or equal to the price, and SHALL subtract the price and increment `owned` by one.

#### Scenario: Price increases after purchase
- **WHEN** the player owns 0 Interns (baseCost 15) and buys one
- **THEN** 15 LoC is subtracted and the next Intern costs 18

#### Scenario: Cannot afford
- **WHEN** the player has 10 LoC and tries to buy an Intern costing 15
- **THEN** the purchase is rejected and LoC and owned counts are unchanged

### Requirement: Progress is persisted
The game SHALL load the savegame (LoC, owned upgrades, start time, total LoC written) from the API on startup, SHALL save it at least every 10 seconds while running, and SHALL save immediately after every purchase. Total LoC written SHALL only ever increase (spending does not reduce it).

#### Scenario: Survives a reload
- **WHEN** the player buys an upgrade and reloads the page while the API is running
- **THEN** the owned upgrade and the LoC total (minus at most 10 seconds of income) are restored

#### Scenario: API unavailable on startup
- **WHEN** the API cannot be reached on startup
- **THEN** the game shows a translated error message instead of silently starting a new game

### Requirement: Header with stats, navigation and language switch
Every page SHALL show a header with the game name, the current LoC (compact notation, e.g. "1.2M"), LoC per second, navigation links to Game, Shop and Profile, and a language switch between English and Dutch. Switching language SHALL immediately translate all translated UI text without a reload.

#### Scenario: Compact numbers
- **WHEN** the player has 1,234,567 LoC
- **THEN** the header shows "1.2M"

#### Scenario: Switch to Dutch
- **WHEN** the player selects Dutch in the language switch
- **THEN** navigation labels and translated texts on the current page appear in Dutch

### Requirement: Team summary
The Game page SHALL show the upgrades the player owns, each with its translated name and the number owned.

#### Scenario: Owned upgrades listed
- **WHEN** the player owns 3 Interns and 1 Coffee Machine
- **THEN** the team summary lists "Intern × 3" and "Coffee Machine × 1" (translated in the active language)

### Requirement: Playable balance
The upgrade catalogue SHALL contain the 16 upgrades defined in `repo-requirements.md` §2 (6 people, 4 tools, 3 culture, 3 infra) with their base costs, LoC/s and click power, so that a player can afford a Junior Dev within about two minutes of clicking.

#### Scenario: Early progression
- **WHEN** a new player clicks steadily (about 3 clicks per second) and buys the cheapest affordable upgrades
- **THEN** they can buy a Junior Dev within roughly two minutes

# Spec Delta

## Purpose

Defines the observable behaviour of the upgrade shop, the page where players browse and buy upgrades. Its implementation is intentionally legacy; this spec covers what players see, not code quality.

## ADDED Requirements

### Requirement: Upgrades listed by category
The Shop page SHALL list all upgrades returned by the API, grouped under the categories People, Tools, Culture and Infra (in that order). Each upgrade SHALL show its name, flavour text, current price, and the number owned.

#### Scenario: All categories shown
- **WHEN** the player opens the Shop page and the API returns the 16 seed upgrades
- **THEN** four category groups are shown containing 6, 4, 3 and 3 upgrades respectively

#### Scenario: Loading state
- **WHEN** the upgrades are still being fetched
- **THEN** a loading indicator is shown instead of the list

### Requirement: Affordability is visible
Each upgrade SHALL visually indicate whether the player can currently afford it, and this indication SHALL update as LoC changes.

#### Scenario: Becomes affordable
- **WHEN** the player's LoC rises from below to above an upgrade's price
- **THEN** that upgrade changes from the "not affordable" to the "affordable" appearance without a page reload

### Requirement: Buying from the shop
Selecting an affordable upgrade in the shop SHALL buy it according to the game's pricing rules and update the shown price and owned count immediately.

#### Scenario: Buy an upgrade
- **WHEN** the player has 20 LoC and selects the Intern (price 15)
- **THEN** LoC drops to 5, Intern shows "owned 1" and the new price 18

#### Scenario: Not affordable
- **WHEN** the player selects an upgrade they cannot afford
- **THEN** nothing is bought and LoC is unchanged

### Requirement: No filter or wishlist yet
The shop SHALL NOT contain search, category filtering, wishlist controls, or "affordable in" estimates on the `main` branch; these are the subject of the workshop task (`TASK.md`).

#### Scenario: Baseline shop
- **WHEN** a participant opens the Shop page on a fresh clone of `main`
- **THEN** there is no search field, no category filter, no star/wishlist button and no "affordable in" text

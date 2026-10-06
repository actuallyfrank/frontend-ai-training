# it-clicker/profile Specification

## Purpose

Defines the Profile page, where players manage their company identity and see their stats. It is the reference implementation that demonstrates every project convention.

## Requirements

### Requirement: Edit company profile
The Profile page SHALL let the player edit their company name (2–40 characters), choose an avatar from 🎸 🥁 🎤 🎹, and choose the language (English or Dutch), and save these via the API. Every form control SHALL have a visible, programmatically associated label. The avatar choice SHALL be a keyboard-operable radio group.

#### Scenario: Save profile
- **WHEN** the player changes the company name to "Byte Me BV", picks 🥁 and saves
- **THEN** the profile is stored, a translated success message is announced via a status region, and the values persist after a reload

#### Scenario: Invalid company name
- **WHEN** the player enters a one-character company name and saves
- **THEN** a translated validation error is shown next to the field and nothing is saved

#### Scenario: Language follows profile
- **WHEN** the player saves Dutch as language
- **THEN** the UI switches to Dutch

### Requirement: Player stats
The Profile page SHALL show how long the player has been playing (e.g. "3h 12m"), the total LoC written in compact notation (e.g. "1.2M LoC written"), and the total number of upgrades owned.

#### Scenario: Stats shown
- **WHEN** the player started 3 hours and 12 minutes ago, wrote 1,234,567 LoC in total and owns 42 upgrades
- **THEN** the page shows "3h 12m", "1.2M" and "42"

### Requirement: Loading and error states
The Profile page SHALL show a loading state while the profile is fetched and a translated error state when the API fails.

#### Scenario: API error
- **WHEN** fetching the profile fails
- **THEN** a translated error message is shown and the form is not rendered with empty data

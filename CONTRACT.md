# Shared contract — Smart Campus Room Availability Checker

Used unchanged for **both** the code-based and the low-code solution.

## User story

As a student, I want to check whether the campus room is free for a future time slot,
so that I get a clear Available / Unavailable decision with a reason.

## Fictional data

- One room: **Room 101 (fictional)**.
- Existing bookings (read-only): **B1 09:00–10:00**, **B2 13:00–14:00**.
- No real personal data, no login, no payment, no production database.

## Inputs

| Input | Format | Notes |
| --- | --- | --- |
| Current time | `HH:MM` | Supplied, not the real clock, so tests are reproducible (tests use 08:00) |
| Start time | `HH:MM` | Same day |
| Duration | whole minutes | 1–120 |
| Room blocked | true / false | |
| Bookings | list of `{id, start, end}` | Fixed fictional list above |

## Outputs

| Output | Values |
| --- | --- |
| `available` | true / false |
| `reasonCode` | `AVAILABLE`, `OVERLAP`, `ROOM_BLOCKED`, `INVALID_DURATION`, `PAST_START`, `ENDS_AFTER_DAY`, `INVALID_INPUT` |
| Visible message | one sentence per reason code (below) |

| reasonCode | Message |
| --- | --- |
| AVAILABLE | Available: the room is free for this time. |
| OVERLAP | Unavailable: this time overlaps an existing booking. |
| ROOM_BLOCKED | Unavailable: the room is blocked. |
| INVALID_DURATION | Duration must be between 1 and 120 minutes. |
| PAST_START | Start time must be later than the current time. |
| ENDS_AFTER_DAY | The booking must end by 24:00. |
| INVALID_INPUT | Please enter times as HH:MM and the duration as a whole number of minutes. |

Order of checks: input format → duration → past start → end of day → blocked room → overlap.
Touching intervals (10:00–11:00 after 09:00–10:00) do **not** overlap.

## Acceptance criteria

- **AC1** Start time must be in the future (later than the current time).
- **AC2** Duration must be greater than zero and at most 120 minutes.
- **AC3** Overlapping bookings are unavailable.
- **AC4** Blocked room is unavailable.
- **AC5** Display a clear decision without changing existing bookings.
- **AC6** Invalid input receives understandable feedback.

## Common test inputs (current time 08:00)

| ID | Start | Duration | Blocked | Expected |
| --- | --- | --- | --- | --- |
| T1 | 10:30 | 60 | no | Available (`AVAILABLE`) |
| T2 | 09:30 | 60 | no | Unavailable (`OVERLAP`) |
| T3 | 10:30 | 60 | yes | Unavailable (`ROOM_BLOCKED`) |
| T4 | 10:30 | 0 | no | Validation error (`INVALID_DURATION`) |
| T5 | 10:30 | 121 | no | Validation error (`INVALID_DURATION`) |
| T6 | 07:00 | 30 | no | Validation error (`PAST_START`) |
| T7 | 10:00 | 60 | no | Available (`AVAILABLE`, adjacent to B1) |
| T8 | run T1–T7 | | | Bookings B1, B2 unchanged |

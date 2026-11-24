// Smart Campus Room Availability Checker — deterministic booking rules.
// Pure functions only: no DOM, no network, no storage. Shared contract: see CONTRACT.md.

export const MAX_DURATION = 120; // minutes (AC2)
export const DAY_END = 24 * 60; // bookings must end by 24:00

// Fictional data for the single campus room (no real people).
export const ROOM = { id: "R-101", name: "Room 101 (fictional)" };
export const BOOKINGS = Object.freeze([
  Object.freeze({ id: "B1", start: "09:00", end: "10:00" }),
  Object.freeze({ id: "B2", start: "13:00", end: "14:00" }),
]);

export const MESSAGES = {
  AVAILABLE: "Available: the room is free for this time.",
  INVALID_INPUT: "Please enter times as HH:MM and the duration as a whole number of minutes.",
  PAST_START: "Start time must be later than the current time.",
  INVALID_DURATION: "Duration must be between 1 and 120 minutes.",
  ENDS_AFTER_DAY: "The booking must end by 24:00.",
  ROOM_BLOCKED: "Unavailable: the room is blocked.",
  OVERLAP: "Unavailable: this time overlaps an existing booking.",
};

// ---------- Validation (AC1, AC2, AC6) ----------

export function parseTime(text) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(String(text).trim());
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

export function parseDuration(value) {
  const text = String(value).trim();
  if (!/^-?\d+$/.test(text)) return null;
  return Number(text);
}

// Returns { ok: true, value } or { ok: false, reasonCode }.
export function validate(input) {
  const now = parseTime(input.currentTime);
  const start = parseTime(input.startTime);
  const duration = parseDuration(input.duration);
  if (now === null || start === null || duration === null) {
    return { ok: false, reasonCode: "INVALID_INPUT" };
  }
  if (duration < 1 || duration > MAX_DURATION) {
    return { ok: false, reasonCode: "INVALID_DURATION" };
  }
  if (start <= now) {
    return { ok: false, reasonCode: "PAST_START" };
  }
  if (start + duration > DAY_END) {
    return { ok: false, reasonCode: "ENDS_AFTER_DAY" };
  }
  return { ok: true, value: { start, end: start + duration, blocked: Boolean(input.blocked) } };
}

// ---------- Availability calculation (AC3, AC4, AC5) ----------

export function overlaps(aStart, aEnd, bStart, bEnd) {
  // Touching endpoints are allowed: 09:00-10:00 and 10:00-11:00 do not overlap.
  return aStart < bEnd && bStart < aEnd;
}

// Output contract: { available, reasonCode, message, validationError }.
// Never changes `bookings` (AC5).
export function checkAvailability(input, bookings = BOOKINGS) {
  const checked = validate(input);
  if (!checked.ok) {
    return result(false, checked.reasonCode, true);
  }
  const { start, end, blocked } = checked.value;
  if (blocked) {
    return result(false, "ROOM_BLOCKED", false);
  }
  const clash = bookings.some((b) => overlaps(start, end, parseTime(b.start), parseTime(b.end)));
  if (clash) {
    return result(false, "OVERLAP", false);
  }
  return result(true, "AVAILABLE", false);
}

function result(available, reasonCode, validationError) {
  return { available, reasonCode, message: MESSAGES[reasonCode], validationError };
}

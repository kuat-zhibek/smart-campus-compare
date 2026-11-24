import { test } from "node:test";
import assert from "node:assert/strict";
import { BOOKINGS, checkAvailability, MESSAGES } from "./rules.js";
import { TEST_CASES } from "./test-cases.js";

for (const tc of TEST_CASES) {
  test(`${tc.id}: ${tc.title}`, () => {
    const out = checkAvailability(tc.input);
    assert.equal(out.available, tc.expected.available);
    assert.equal(out.reasonCode, tc.expected.reasonCode);
    assert.equal(out.message, MESSAGES[tc.expected.reasonCode]);
  });
}

test("T8: booking data unchanged after all checks", () => {
  const before = JSON.stringify(BOOKINGS);
  for (const tc of TEST_CASES) checkAvailability(tc.input);
  assert.equal(JSON.stringify(BOOKINGS), before);
  assert.ok(Object.isFrozen(BOOKINGS) && Object.isFrozen(BOOKINGS[0]));
});

// Extra edge cases (not part of the shared 8)
test("extra: malformed input gives INVALID_INPUT, not a crash", () => {
  for (const bad of [{ startTime: "25:00" }, { startTime: "<b>x</b>" }, { duration: "1.5" }, { duration: "" }]) {
    const out = checkAvailability({ currentTime: "08:00", startTime: "10:30", duration: "60", blocked: false, ...bad });
    assert.equal(out.reasonCode, "INVALID_INPUT");
    assert.equal(out.validationError, true);
  }
});

test("extra: boundaries 1 and 120 minutes are accepted", () => {
  assert.equal(checkAvailability({ currentTime: "08:00", startTime: "10:30", duration: "1", blocked: false }).available, true);
  assert.equal(checkAvailability({ currentTime: "08:00", startTime: "10:30", duration: "120", blocked: false }).available, true);
});

test("extra: start equal to current time is in the past", () => {
  assert.equal(checkAvailability({ currentTime: "10:30", startTime: "10:30", duration: "30", blocked: false }).reasonCode, "PAST_START");
});

test("extra: booking ending after 24:00 is rejected", () => {
  assert.equal(checkAvailability({ currentTime: "08:00", startTime: "23:30", duration: "60", blocked: false }).reasonCode, "ENDS_AFTER_DAY");
});

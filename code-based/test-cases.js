// Shared test inputs T1-T8 (same inputs are used for the low-code version).
// Current time is fixed at 08:00 so results are reproducible.
// Existing fictional bookings: B1 09:00-10:00, B2 13:00-14:00.

export const TEST_CASES = [
  { id: "T1", title: "Valid free interval", input: { currentTime: "08:00", startTime: "10:30", duration: "60", blocked: false }, expected: { available: true, reasonCode: "AVAILABLE" } },
  { id: "T2", title: "Overlap with existing booking", input: { currentTime: "08:00", startTime: "09:30", duration: "60", blocked: false }, expected: { available: false, reasonCode: "OVERLAP" } },
  { id: "T3", title: "Blocked room", input: { currentTime: "08:00", startTime: "10:30", duration: "60", blocked: true }, expected: { available: false, reasonCode: "ROOM_BLOCKED" } },
  { id: "T4", title: "Duration = 0", input: { currentTime: "08:00", startTime: "10:30", duration: "0", blocked: false }, expected: { available: false, reasonCode: "INVALID_DURATION" } },
  { id: "T5", title: "Duration = 121", input: { currentTime: "08:00", startTime: "10:30", duration: "121", blocked: false }, expected: { available: false, reasonCode: "INVALID_DURATION" } },
  { id: "T6", title: "Past start time", input: { currentTime: "08:00", startTime: "07:00", duration: "30", blocked: false }, expected: { available: false, reasonCode: "PAST_START" } },
  { id: "T7", title: "Adjacent non-overlapping interval", input: { currentTime: "08:00", startTime: "10:00", duration: "60", blocked: false }, expected: { available: true, reasonCode: "AVAILABLE" } },
];
// T8 (booking data unchanged after all checks) is checked separately: it runs T1-T7
// and compares the bookings before and after.

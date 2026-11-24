// UI layer only: reads the form, calls the rule engine, shows the result.
// All text is inserted with textContent (no innerHTML), so input is never run as HTML.
import { BOOKINGS, ROOM, checkAvailability } from "./rules.js";
import { TEST_CASES } from "./test-cases.js";

const $ = (id) => document.getElementById(id);

function cell(row, text, className) {
  const td = document.createElement("td");
  td.textContent = text;
  if (className) td.className = className;
  row.appendChild(td);
}

function showBookings() {
  const body = $("bookings");
  body.replaceChildren();
  for (const b of BOOKINGS) {
    const row = document.createElement("tr");
    cell(row, b.id); cell(row, b.start); cell(row, b.end);
    body.appendChild(row);
  }
}

function showResult(out) {
  const box = $("result");
  box.className = out.available ? "ok" : out.validationError ? "warn" : "bad";
  box.textContent = "";
  const msg = document.createElement("div");
  msg.textContent = out.message;
  const code = document.createElement("div");
  code.className = "code";
  code.textContent = `available=${out.available} · reasonCode=${out.reasonCode}`;
  box.append(msg, code);
}

$("form").addEventListener("submit", (event) => {
  event.preventDefault();
  showResult(checkAvailability({
    currentTime: $("currentTime").value,
    startTime: $("startTime").value,
    duration: $("duration").value,
    blocked: $("blocked").checked,
  }));
});

$("run-tests").addEventListener("click", () => {
  const body = $("tests");
  body.replaceChildren();
  const before = JSON.stringify(BOOKINGS);
  let passed = 0;
  for (const tc of TEST_CASES) {
    const out = checkAvailability(tc.input);
    const ok = out.available === tc.expected.available && out.reasonCode === tc.expected.reasonCode;
    if (ok) passed += 1;
    const row = document.createElement("tr");
    cell(row, tc.id);
    cell(row, `${tc.title} (start ${tc.input.startTime}, ${tc.input.duration} min${tc.input.blocked ? ", blocked" : ""})`);
    cell(row, tc.expected.reasonCode);
    cell(row, `${out.reasonCode} — ${out.message}`);
    cell(row, ok ? "PASS" : "FAIL", ok ? "pass" : "fail");
    body.appendChild(row);
  }
  const unchanged = JSON.stringify(BOOKINGS) === before;
  if (unchanged) passed += 1;
  const row = document.createElement("tr");
  cell(row, "T8"); cell(row, "Booking data unchanged after T1–T7"); cell(row, "unchanged");
  cell(row, unchanged ? "unchanged" : "CHANGED"); cell(row, unchanged ? "PASS" : "FAIL", unchanged ? "pass" : "fail");
  body.appendChild(row);
  $("summary").textContent = `${passed} / 8 passed · run at ${new Date().toLocaleTimeString()}`;
});

$("room-name").textContent = ROOM.name;
showBookings();

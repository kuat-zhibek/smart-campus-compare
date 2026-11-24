export default {
	// Fictional bookings for Room 101 (read-only).
	bookings: [
		{ id: "B1", start: "09:00", end: "10:00" },
		{ id: "B2", start: "13:00", end: "14:00" }
	],

	messages: {
		AVAILABLE: "Available: the room is free for this time.",
		INVALID_INPUT: "Please enter times as HH:MM and the duration as a whole number of minutes.",
		PAST_START: "Start time must be later than the current time.",
		INVALID_DURATION: "Duration must be between 1 and 120 minutes.",
		ENDS_AFTER_DAY: "The booking must end by 24:00.",
		ROOM_BLOCKED: "Unavailable: the room is blocked.",
		OVERLAP: "Unavailable: this time overlaps an existing booking."
	},

	toMinutes (text) {
		const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(String(text || "").trim());
		return m ? Number(m[1]) * 60 + Number(m[2]) : null;
	},

	evaluate (currentTime, startTime, durationText, blocked) {
		const now = this.toMinutes(currentTime);
		const start = this.toMinutes(startTime);
		const d = String(durationText || "").trim();
		const duration = /^-?\d+$/.test(d) ? Number(d) : null;
		let code;
		if (now === null || start === null || duration === null) code = "INVALID_INPUT";
		else if (duration < 1 || duration > 120) code = "INVALID_DURATION";
		else if (start <= now) code = "PAST_START";
		else if (start + duration > 24 * 60) code = "ENDS_AFTER_DAY";
		else if (blocked) code = "ROOM_BLOCKED";
		else if (this.bookings.some(b => start < this.toMinutes(b.end) && this.toMinutes(b.start) < start + duration)) code = "OVERLAP";
		else code = "AVAILABLE";
		return { available: code === "AVAILABLE", reasonCode: code, message: this.messages[code] };
	},

	check () {
		const out = this.evaluate(inpCurrent.text, inpStart.text, inpDuration.text, swBlocked.isSwitchedOn);
		storeValue("result", out);
		return out;
	}
}

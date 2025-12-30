import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export function checkNextCalendarDay(departingDate, arrivalDate) {
	// 1. Parse as UTC to keep "Wall Clock" time stable
	const dep = dayjs.utc(departingDate);
	const arr = dayjs.utc(arrivalDate);

	if (!dep.isValid() || !arr.isValid()) return false;

	// 2. Start of day comparison (ignores hours/minutes)
	// This checks if the first arrival is at least 1 calendar day after departure
	return arr.startOf("day").isAfter(dep.startOf("day"));
}

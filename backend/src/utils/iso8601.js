export default function stringToMins(total_duration) {
	// turn duration string "PT3H8M" to number in minutes

	let totalMins = 0;
	const hourRegex = /(\d+)H/;
	const minRegex = /(\d+)M/;
	const hourMatch = total_duration.match(hourRegex);
	const minMatch = total_duration.match(minRegex);

	if (hourMatch) totalMins += parseInt(hourMatch[1]) * 60;
	if (minMatch) totalMins += parseInt(minMatch[1]);

	return totalMins;
}

import pool from "../config/db.js";
export default class SearchHistoryModel {
	//Do you want to cache per user, or across all users? Answer: All users to focus on common routes and dates
	static async saveSearch(user, searchParams) {
		const {
			origin,
			destination,
			departureDate,
			tripType,
			returnDate,
			adults,
			children,
			infants,
		} = searchParams;
		const result = await pool.query(
			`INSERT INTO search_history(user_id, origin, destination, departure_date, return_date, trip_type, adults, children, infants )
			VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
			[
				user.id,
				origin,
				destination,
				departureDate,
				returnDate,
				tripType,
				adults,
				children,
				infants,
			]
		);

		console.log(`Your recent search was saved`);
	}

	// Query database to check if there has been more than 10 searches of these search params
	static async checkSearchFrequency(searchParams) {
		let {
			origin,
			destination,
			departureDate,
			tripType,
			returnDate,
			adults,
			children,
			infants,
		} = searchParams;

		//
		returnDate = tripType === "one_way" ? null : returnDate;

		//

		console.log(
			`Checking search frequency for: 
			${origin} to ${destination} on ${departureDate} 
			${tripType} ${returnDate} 
			for ${adults} adults, ${children} children, ${infants} infants`
		);

		// if search is frequent return true, else return false

		/* search was run in last 10 minutes */
		//1. Query database for count search in the last 10 minutes

		const tenMinutesAgo = await pool.query(
			`SELECT COUNT(*) FROM search_history
			WHERE search_history.origin = $1 AND
			search_history.destination = $2 AND
			search_history.departure_date = $3 AND
			(
				(search_history.trip_type = 'one_way' AND search_history.return_date IS NULL) OR
				(search_history.trip_type = 'round_trip' AND search_history.return_date = $4)
			) AND
			search_history.adults = $5 AND
			search_history.children = $6 AND
			search_history.infants = $7 AND
			search_history.created_at >= (NOW() - INTERVAL '10 minutes')`,
			[
				origin,
				destination,
				departureDate,
				returnDate,
				adults,
				children,
				infants,
			]
		);

		//2. If there are any same search within 10 mins return true
		const count = parseInt(tenMinutesAgo.rows[0].count, 10);
		if (count > 0) return true;

		/*search was run 5 times in the past 6 hours*/
		//1. Query database for count search in the last 6 hours
		const sixHoursAgo = await pool.query(
			`SELECT COUNT(*) FROM search_history
			WHERE search_history.origin = $1 AND
			search_history.destination = $2 AND
			search_history.departure_date = $3 AND
			(
				(search_history.trip_type = 'one_way' AND search_history.return_date IS NULL) OR
				(search_history.trip_type = 'round_trip' AND search_history.return_date = $4)
			) AND
			search_history.adults = $5 AND
			search_history.children = $6 AND
			search_history.infants = $7 AND
			search_history.created_at >= (NOW() - INTERVAL '6 hours')`,
			[
				origin,
				destination,
				departureDate,
				returnDate,
				adults,
				children,
				infants,
			]
		);

		//2. If there are at least 5 same search within 6 hours return true
		const sixHourCount = parseInt(sixHoursAgo.rows[0].count, 10);
		console.log(
			"this has been searched " + sixHourCount + " times in the last 6 hours"
		);
		if (sixHourCount >= 5) return true;

		return false;
	}
}

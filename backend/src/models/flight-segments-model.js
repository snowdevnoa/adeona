import pool from "../config/db.js";

export default class FlightSegmentModel {
	static async cacheSegment(segment, flightId) {
		/* incoming segment data
			{
             	"segmentNumber": "1",
                "origin": "SEA",
                "destination": "HNL",
                "departureDateTime": "2025-08-08T20:40:00",
                "arrivalDateTime": "2025-08-08T23:34:00",
                "durationMins": 670,
                "airlineIata": "HA"
						
            }
		*/

		const {
			segmentNumber,
			origin,
			departureDateTime,
			destination,
			arrivalDateTime,
			durationMins,
			airlineIATA,
		} = segment;

		const result = await pool.query(
			`
		INSERT INTO flight_segments(
		flight_id, 
		segment_number, 
		airline_id, 
		origin_id, 
		destination_id, 
		departure_datetime, 
		arrival_datetime, 
		duration_minutes)
		VALUES(
		$1,
		$2,
		(SELECT airlines.airline_id FROM airlines WHERE airlines.iata_code = $3),
		(SELECT locations.location_id FROM locations WHERE locations.iata_code = $4),
		(SELECT locations.location_id FROM locations WHERE locations.iata_code = $5),
		$6,
		$7,
		$8)
		`,
			[
				flightId,
				segmentNumber,
				airlineIATA,
				origin,
				destination,
				departureDateTime,
				arrivalDateTime,
				durationMins,
			]
		);

		console.log("segment has been saved");
	}

	static async getSegments(flightId) {
		const result = await pool.query(
			`
			SELECT 
			flight_segments.segment_number AS id,
			origin_loc.iata_code AS origin,
			destination_loc.iata_code AS destination,
			flight_segments.departure_datetime,
			flight_segments.arrival_datetime,
			airlines.iata_code as airline
			FROM flight_segments
			LEFT JOIN locations AS origin_loc ON flight_segments.origin_id = origin_loc.location_id
			LEFT JOIN locations AS destination_loc ON flight_segments.destination_id = destination_loc.location_id
			LEFT JOIN airlines ON flight_segments.airline_id = airlines.airline_id 
			WHERE flight_segments.flight_id = $1
			`,
			[flightId]
		);

		return result.rows;
	}
}

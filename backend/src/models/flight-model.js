import pool from "../config/db.js";
import stringToMins from "../utils/iso8601.js";

export default class FlightModel {
	// Check for most searched flights and not expired TTL = 2 minutes
	static async checkValidFlights(search) {
		console.log("Checking flight in database");

		const { origin, destination, departureDate } = search;

		const results = await pool.query(
			`
            SELECT flights.flight_id, flights.origin_id, flights.destination_id, flights.departure_datetime, flights.arrival_datetime, last_synced_at
            FROM flights
            LEFT JOIN locations AS origin_loc ON flights.origin_id = origin_loc.location_id
            LEFT JOIN locations AS destination_loc ON flights.destination_id = destination_loc.location_id
            WHERE origin_loc.iata_code = $1 
            AND destination_loc.iata_code = $2
            AND CAST(flights.departure_datetime AS DATE) = $3::DATE
            AND last_synced_at >= (NOW() - INTERVAL '2 minutes')
			LIMIT 1`,
			[origin, destination, departureDate]
		);
		// console.log(Date("2025-08-07 07:01:00+00"));
		return results.rows.length > 0;
	}

	// Cache flight
	static async cacheFlight(flight) {
		console.log("Now caching flight");
		const {
			main_airline,
			airline_name,
			origin,
			departure_datetime,
			destination,
			arrival_datetime,
			price,
			currency,
			flight_class,
			duration_minutes,
			segments,
		} = flight;
		/*
            airline_id UUID NOT NULL,
            flight_number VARCHAR(10),
            flight_class flight_class_enum NOT NULL,
            origin_id UUID NOT NULL,
            destination_id UUID NOT NULL,
            departure_datetime TIMESTAMPTZ NOT NULL,
            arrival_datetime TIMESTAMPTZ NOT NULL,
            duration_minutes SMALLINT NOT NULL,
            price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
            currency CHAR(3) DEFAULT 'USD' NOT NULL,
            num_segments SMALLINT NOT NULL CHECK (num_segments >= 1),
        */

		const result = await pool.query(
			`
			INSERT INTO flights(
			airline_id, 
			flight_class, 
			origin_id, 
			destination_id, 
			departure_datetime, 
			arrival_datetime, 
			duration_minutes, 
			price, 
			currency, 
			num_segments)
			VALUES(
			(SELECT airlines.airline_id FROM airlines WHERE airlines.iata_code = $1), 
			$2, 
			(SELECT locations.location_id FROM locations WHERE locations.iata_code = $3 ), 
			(SELECT locations.location_id FROM locations WHERE locations.iata_code = $4 ),
			$5, 
			$6, 
			$7, 
			$8, 
			$9, 
			$10
			)
            RETURNING flight_id
			`,
			[
				main_airline,
				flight_class,
				origin,
				destination,
				departure_datetime,
				arrival_datetime,
				duration_minutes,
				price,
				currency,
				segments.length,
			]
		);

		// Return flight id to use for segments
		const flightId = result.rows[0].flight_id;
		return flightId;
	}

	// Get flights
	static async getFlights(search) {
		console.log("grabbing flights in database");

		const { origin, destination, departureDate } = search;

		const results = await pool.query(
			`
            SELECT 
    		flights.flight_id,
			airlines.iata_code AS main_airline, 
    		airlines.airline_name,
    		origin_loc.iata_code AS origin, 
    		destination_loc.iata_code AS destination, 
   			flights.departure_datetime, 
    		flights.arrival_datetime, 
    		flights.duration_minutes,
    		flights.price,
    		flights.currency,
			flights.flight_class,
    		flights.num_segments,
    		flights.last_synced_at
			FROM flights
			LEFT JOIN locations AS origin_loc ON flights.origin_id = origin_loc.location_id
			LEFT JOIN locations AS destination_loc ON flights.destination_id = destination_loc.location_id
			LEFT JOIN airlines ON flights.airline_id = airlines.airline_id
			WHERE 
    		origin_loc.iata_code = $1 
    		AND destination_loc.iata_code = $2
    		AND CAST(flights.departure_datetime AS DATE) = $3::DATE
    		AND last_synced_at >= (NOW() - INTERVAL '2 minutes')`,
			[origin, destination, departureDate]
		);
		return results.rows;
	}
}

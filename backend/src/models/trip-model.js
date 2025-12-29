import pool from "../config/db.js";

/* Incoming trip data 

user: {
  id: '9a38302c-fd90-4fda-ac41-a99515bf4287',
  role: 'user'
}
tripData: {
  tripName: '<p>test</p>',
  searchData: {
    origin: 'DFW',
    destination: 'SEA',
    departureDate: '2025-12-29',
    returnDate: '2026-01-09',
    tripType: 'round_trip',
    flightClass: 'ECONOMY',
    currency: 'USD',
    adults: '1',
    children: '0',
    infants: '0'
  },
  flights: {
    dataType: 'amadeus',
    departingFlight: {...},
    returnFlight: {...}
  }
}
*/

export default class TripModel {
	static async saveTrip(user, tripData) {
		const { tripName, flights, totalPrice } = tripData;
		const {
			origin,
			destination,
			departureDate,
			returnDate,
			tripType,
			flightClass,
			adults,
			children,
			infants,
			currency,
		} = tripData.searchData;

		const result = await pool.query(
			`INSERT INTO trips(user_id, trip_name, origin_iata, destination_iata, departure_date, return_date, trip_type, flight_class, adults, children, infants, currency_code, total_price, flight_details_snapshot)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
			[
				user.id,
				tripName,
				origin,
				destination,
				departureDate,
				returnDate,
				tripType,
				flightClass,
				adults,
				children,
				infants,
				currency,
				totalPrice,
				flights,
			]
		);
		return result;
	}
}

import pool from "../config/db.js";

export default class AirlineModel {
	static async checkForAirline(iata) {
		// console.log(`checking ${iata} in airlines database`);
		const result = await pool.query(
			`
			SELECT airline_name, iata_code, logo_url, icon_url 
            FROM airlines 
            WHERE airlines.iata_code = $1
			`,
			[iata]
		);

		if (result.rows.length === 0) {
			console.log(`${iata} could not be found in airlines database`);
			return false;
		} else {
			// console.log(`${iata} found in database`);
			return true;
		}
	}

	static async insertNewAirline({ airlineName, iata }) {
		console.log(`Creating new airline for ${iata}: ${airlineName}`);
		const result = await pool.query(
			`INSERT INTO airlines(airline_name, iata_code) 
            VALUES($1, $2)
            `,
			[airlineName, iata]
		); /*
    CREATE TABLE airlines(
    airline_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    airline_name VARCHAR(100) UNIQUE NOT NULL,
    iata_code VARCHAR(3) UNIQUE NOT NULL,
    logo_url VARCHAR(2048) DEFAULT NULL,
    icon_url VARCHAR(2048) DEFAULT NULL
); */
		// console.log(`${airlineName} added to airlines database`);
	}

	static async getAirlineName(iataCode) {
		const airline = await pool.query(
			`
            SELECT airline_name
            FROM airlines
            WHERE iata_code = $1
            `,
			[iataCode]
		);

		// console.log(`Returning  ${airline.rows[0].airline_name} from database`);
		return airline.rows[0].airline_name;
	}
}

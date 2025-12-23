import pool from "../config/db.js";

export default class LocationModel {
	static async checkForLocation(iata) {
		// console.log(`checking ${iata} in database`);
		const result = await pool.query(
			`
			SELECT iata_code, airport_name, city, country_code, country 
			FROM locations
			WHERE locations.iata_code = $1
			`,
			[iata]
		);

		if (result.rows.length === 0) {
			console.log(`${iata} could not be found in locations database`);
			return false;
		} else {
			// console.log(`${iata} found in database`);
			return true;
		}
	}

	static async insertNewLocation({
		iata,
		airportName,
		city,
		countryCode,
		country,
	}) {
		console.log(`creating new location: ${iata} ${airportName}`);
		const result = await pool.query(
			`
			INSERT INTO locations(iata_code, airport_name, city, country_code, country)
			VALUES($1,$2,$3,$4,$5)
			`,
			[iata, airportName, city, countryCode, country]
		);

		/*
		 location_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    	iata_code CHAR(3) UNIQUE NOT NULL,
    	airport_name VARCHAR(100) UNIQUE NOT NULL,
    	city VARCHAR(100) NOT NULL,
    	country_code CHAR(2) NOT NULL,
    	country VARCHAR(100) NOT NULL,

		later adds
    	country_icon_url VARCHAR(2048),
		timezone VARCHAR(50)
		 */

		// console.log(`${airportName} added to database`);
	}

	static async getIATA(iataCode) {
		const iata = await pool.query(
			`
			SELECT iata_code FROM locations 
			WHERE locations.iata_code = $1`,
			[iataCode]
		);
		// console.log(`Returning ${iata.rows[0].iata_code} from database`);

		return iata.rows[0].iata_code;
	}

	static async getLocationDetails(iataCode) {
		const location = await pool.query(
			`
			SELECT airport_name, city
			FROM locations
			WHERE locations.iata_code = $1
			`,
			[iataCode]
		);

		return {
			airport: location.rows[0].airport_name,
			city: location.rows[0].city,
		};
	}
}

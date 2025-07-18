import type {
	FlightProvider,
	FlightSearchData,
} from "../interfaces/flight-provider.ts";

import LocationModel from "../models/location-model.js";

declare var process: {
	env: {
		AMADEUS_API_KEY: string;
		AMADEUS_API_SECRET: string;
	};
};

type AccessToken = {
	access_token: string;
	expiresAt: number;
};

export class AmadeusAdapter implements FlightProvider {
	token: AccessToken | null;

	// incoming adeona searchData
	constructor() {
		this.token = null;
	}

	async requestAccessToken() {
		// If access token does not exists or is expired get a new one
		if (!this.token || Date.now() >= this.token.expiresAt) {
			// set access token

			try {
				const res: any = await fetch(
					"https://test.api.amadeus.com/v1/security/oauth2/token",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
						body: new URLSearchParams({
							grant_type: "client_credentials",
							client_id: process.env.AMADEUS_API_KEY,
							client_secret: process.env.AMADEUS_API_SECRET,
						}),
					}
				);

				const data = await res.json();

				
				this.token = {
					access_token: data.access_token,
					expiresAt: Date.now() + data.expires_in * 1000,
				};
				console.log('Time now' + Date.now())
				console.log(data.expires_in)
				console.log(this.token.expiresAt)
			} catch (err) {
				throw new Error("Could not get access token from amadeus");
			}
		}
	}

	/*  
	My notes: https://www.notion.so/Amadeus-API-232b84a4ca8580a2a98eead0bc971e56
	Flight search: https://developers.amadeus.com/self-service/category/flights/api-doc/flight-offers-search/api-reference
	GET v2/shopping/flight-offers
    */

	async getFlights(searchData: FlightSearchData) {
		// check if origin exist in database, if not insert a new location
		if (!(await LocationModel.checkForLocation(searchData.origin))) {
			try {
				const loc = await this.fetchLocationDetails(searchData.origin);
				await LocationModel.insertNewLocation(loc);
			} catch (err) {
				throw Error("Cannot get details for new origin location");
			}
		}

		// check if destination exist in database, if not insert a new location
		if (!(await LocationModel.checkForLocation(searchData.destination))) {
			try {
				const loc = await this.fetchLocationDetails(searchData.destination);
				await LocationModel.insertNewLocation(loc);
			} catch (err) {
				throw Error("Cannot get details for new destination location");
			}
		}

		/*https://developers.amadeus.com/self-service/category/flights/api-doc/airport-and-city-search/api-reference*/

		// translate adeona form data to Amadeus query params

		const adeonaToAmadeus = {
			originLocationCode: await LocationModel.getIATA(searchData.origin),
			destinationLocationCode: await LocationModel.getIATA(
				searchData.destination
			),
			departureDate: searchData.departureDate,
			returnDate:
				searchData.tripType === "round_trip" ? searchData.returnDate : null,
			adults: searchData.adults,
			children: searchData.children,
			infants: searchData.infants,
			travelClass: searchData.flightClass,
			includeAirlineCodes: searchData.includeAirlines,
			excludeAirlineCodes: searchData.excludeAirlines,
			nonStop: searchData.nonStop,
			maxPrice: searchData.maxPrice,
		};

		// call Amadeus API get flights

		// Convert Amadeus result into Adeona format SAVE FOR LATER LOOK AT UI

		return adeonaToAmadeus;
	}

	// Helper function to get new location from Amadeus API

	async fetchLocationDetails(iataCode: string) {
		const res = await fetch(
			`https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT&keyword=${iataCode}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${this.token?.access_token}`,
				},
			}
		);
		const data = await res.json();
		console.log(data);
		const loc = data.data[0];
		return {
			iata: loc.iataCode,
			airportName: loc.name,
			city: loc.address.cityName,
			countryCode: loc.address.countryCode,
			country: loc.address.countryName,
		};
	}
}

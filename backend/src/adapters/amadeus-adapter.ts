import type {
	FlightProvider,
	FlightSearchData,
} from "../interfaces/flight-provider.ts";

import LocationModel from "../models/location-model.js";
import AirlineModel from "../models/airline-model.js";

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
	searchData: FlightSearchData;

	// incoming adeona searchData
	constructor(searchData: FlightSearchData) {
		this.token = null;
		this.searchData = searchData;
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

				console.log(`
					🔐 Amadeus Access Token Info:
					- Time Now:          ${new Date(Date.now()).toISOString()}
					- Expires In (ms):   ${data.expires_in * 1000}
					- Expires At:        ${new Date(this.token.expiresAt).toISOString()}`);
			} catch (err) {
				throw new Error("Could not get access token from amadeus");
			}
		}
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
		// console.log(data);
		const loc = data.data[0];
		// console.log(loc);
		return {
			iata: loc.iataCode,
			airportName: loc.name,
			city: loc.address.cityName,
			countryCode: loc.address.countryCode,
			country: loc.address.countryName,
		};
	}

	async cacheLocation(location: any) {
		try {
			const loc = await this.fetchLocationDetails(location);
			await LocationModel.insertNewLocation(loc);
		} catch (err) {
			throw Error("Cannot get details for new origin location");
		}
	}

	async fetchAirlineDetails(iataCode: string) {
		const res = await fetch(
			`https://test.api.amadeus.com/v1/reference-data/airlines?airlineCodes=${iataCode}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${this.token?.access_token}`,
				},
			}
		);
		const data = await res.json();
		// console.log(data);
		const airline = data.data[0];
		return {
			iata: airline.iataCode,
			airlineName: airline.businessName,
			icaoCode: airline.icaoCode,
		};
	}

	async cacheAirline(airline: any) {
		try {
			const air = await this.fetchAirlineDetails(airline);
			// console.log(air);
			await AirlineModel.insertNewAirline(air);
		} catch (err) {
			throw Error(`Cannot get details for ${airline}`);
		}
	}

	/*  
	My notes: https://www.notion.so/Amadeus-API-232b84a4ca8580a2a98eead0bc971e56
	Flight search: https://developers.amadeus.com/self-service/category/flights/api-doc/flight-offers-search/api-reference
	GET v2/shopping/flight-offers
    */

	async fetchFlights(search: any) {
		try {
			const response = await fetch(
				`https://test.api.amadeus.com/v2/shopping/flight-offers`,
				{
					method: "POST",
					headers: {
						"X-HTTP-Method-Override": "GET",
						Authorization: `Bearer ${this.token?.access_token}`,
						"Content-Type": "application/vnd.amadeus+json",
					},
					body: JSON.stringify(search),
				}
			);

			return response;
		} catch (err) {
			throw new Error("Adeona API error");
		}
	}

	async listFlights(flights: any) {
		const list = [];
		for (const flight of flights) {
			// check if airline exist in database, if not insert a new airline
			if (
				!(await AirlineModel.checkForAirline(
					flight.itineraries[0].segments[0].carrierCode
				))
			) {
				await this.cacheAirline(flight.itineraries[0].segments[0].carrierCode);
			}

			list.push({
				main_airline: flight.itineraries[0].segments[0].carrierCode,
				airline_name: await AirlineModel.getAirlineName(
					flight.itineraries[0].segments[0].carrierCode
				),
				origin: flight.itineraries[0].segments[0].departure.iataCode,
				origin_datetime: flight.itineraries[0].segments[0].departure.at,
				destination:
					flight.itineraries[0].segments[
						flight.itineraries[0].segments.length - 1
					].arrival.iataCode,
				destination_datetime:
					flight.itineraries[0].segments[
						flight.itineraries[0].segments.length - 1
					].arrival.at,
				price: {
					currency: flight.price.currency,
					total_price: flight.price.total,
				},
				trip_type: this.searchData.tripType,
				total_duration: flight.itineraries[0].duration,
				num_segments: flight.itineraries[0].segments.length,
				segments: flight.itineraries[0].segments,
			});
		}

		return list;
	}

	async translateAdeonaToAmadeus(originDestinations: any, passengers: any) {
		return {
			currencyCode: this.searchData.currency,
			originDestinations: originDestinations,
			travelers: passengers,
			sources: ["GDS"], //change GDS to NDC for current and most recent prices
			searchCriteria: {
				maxFlightOffers: 25,
				flightFilters: {
					cabinRestrictions: [
						{
							cabin: this.searchData.flightClass,
							coverage: "MOST_SEGMENTS",
							originDestinationIds: ["1"],
						},
					],
					connectionRestriction: {
						directFlight: this.searchData.nonStop,
					},
					carrierRestrictions: {
						excludedCarrierCodes: this.searchData.excludeAirlines,
						includedCarrierCodes: this.searchData.includeAirlines,
					},
				},
			},
		};
	}

	async getFlights() {
		/*https://developers.amadeus.com/self-service/category/flights/api-doc/airport-and-city-search/api-reference*/

		// translate adeona form data to Amadeus query params for POST method

		// Translate rounds trips to adeona's originDestinations array

		// Departure origin destination
		const originDestinations = [
			{
				id: "1",
				originLocationCode: await LocationModel.getIATA(this.searchData.origin),
				destinationLocationCode: await LocationModel.getIATA(
					this.searchData.destination
				),
				departureDateTimeRange: {
					date: this.searchData.departureDate,
					// time: "10:00:00",
				},
			},
		];

		// Round trip origin destination
		const rtOriginDestinations = [
			{
				id: "1",
				originLocationCode: await LocationModel.getIATA(
					this.searchData.destination
				),
				destinationLocationCode: await LocationModel.getIATA(
					this.searchData.origin
				),
				departureDateTimeRange: {
					date: this.searchData.returnDate,
					// time: "10:00:00",
				},
			},
		];

		// Translate all passengers to adeona's travelers array
		let count = 1;
		let passengers = new Array();

		for (let i = 0; i < this.searchData.adults; i++) {
			passengers.push({ id: count.toString(), travelerType: "ADULT" });
			count++;
		}

		for (let i = 0; i < this.searchData.children; i++) {
			passengers.push({ id: count.toString(), travelerType: "CHILD" });
			count++;
		}

		for (let i = 0; i < this.searchData.infants; i++) {
			passengers.push({
				id: count.toString(),
				travelerType: "SEATED_INFANT",
			});
			count++;
		}

		for (let i = 0; i < this.searchData.seniors; i++) {
			passengers.push({ id: count.toString(), travelerType: "SENIOR" });
			count++;
		}

		// Translate both included airlines and excluded airlines into an array

		// call Amadeus API get departure flights
		const adeonaToAmadeus = await this.translateAdeonaToAmadeus(
			originDestinations,
			passengers
		);

		const response = await this.fetchFlights(adeonaToAmadeus);

		// console.log("Response status for departing flights:", response.status);
		// console.log(response);
		// console.log(
		// 	"Amadeus Request Body:",
		// 	JSON.stringify(adeonaToAmadeus, null, 2)
		// );

		const departingFlights = await response.json();
		// console.error(
		// 	"Amadeus Response Body:",
		// 	JSON.stringify(departingFlights, null, 2)
		// );

		// Convert Amadeus result into Adeona format SAVE FOR LATER LOOK AT UI
		const df = await this.listFlights(departingFlights.data);

		// call Amaedus API to get return flights
		if (
			this.searchData.tripType === "round_trip" &&
			this.searchData.returnDate
		) {
			const rtAdeonatoAmadeus = await this.translateAdeonaToAmadeus(
				rtOriginDestinations,
				passengers
			);
			const response = await this.fetchFlights(rtAdeonatoAmadeus);
			// console.log("Response status for returning flights:", response.status);
			const returnFlights = await response.json();
			const rf = await this.listFlights(returnFlights.data);

			return { departingFlights: df, returnFlights: rf };
		}

		// return flights
		return { departingFlights: df };
	}
}

/*
		
		GET METHOD FORMAT
			const adeonaToAmadeus = {
			originLocationCode: await LocationModel.getIATA(this.searchData.origin),
			destinationLocationCode: await LocationModel.getIATA(
				this.searchData.destination
			),
			departureDate: this.searchData.departureDate,
			returnDate:
				this.searchData.tripType === "round_trip" ? this.searchData.returnDate : null,
			adults: this.searchData.adults,
			children: this.searchData.children,
			infants: this.searchData.infants,
			travelClass: this.searchData.flightClass,
			includeAirlineCodes: this.searchData.includeAirlines,
			excludeAirlineCodes: this.searchData.excludeAirlines,
			nonStop: this.searchData.nonStop,
			currencyCode: this.searchData.currency,
			maxPrice: this.searchData.maxPrice,
		};
		*/

// Class based adapter
import { AmadeusAdapter } from "../adapters/amadeus-adapter.ts";
import type { FlightSearchData } from "../interfaces/flight-provider.js";
import SearchHistoryModel from "../models/search-history-model.js";
import LocationModel from "../models/location-model.js";

export default class FlightService {
	/*
    incoming form data
    {
        origin:
        destination:
        departureDate:
        returnDate:
        adults:
        children?:
        infants?:
        tripType:
        flightClass:
        ------------------
    advanced filters
        includeAirlines:
	    excludeAirlines: 
	    nonStop:
	    maxPrice:
	    includeRedeye:
	    dateFlexDays:so
           
    }
     */

	async validateSearchData(searchData: FlightSearchData) {
		const validData = { ...searchData };
		/* Verify location and origin are strings and not some malicious code. Convert them to strings first before checking*/
		/* Ensure departure date is >= current date*/
		/* Ensure return date > departure date */
		/* Validate adults, children, infants are integer number */
		/* Validate trip Type enums. If trip is round_trip it must contain a return date and not null else if one way return date should be null*/
		/* Validate flight class enums */

		return validData;
	}

	async searchFlights(searchData: FlightSearchData, user: any) {
		// console.log(user);

		// Create a new api instance call
		const amadeus = new AmadeusAdapter(searchData);
		// Get access token from Amadeus
		try {
			await amadeus.requestAccessToken();
		} catch (err) {
			console.error("Error getting access token:", err);
			throw new Error("Failed to get access token");
		}

		// normalize locations with amadeus
		searchData.origin = searchData.origin.toUpperCase();
		searchData.destination = searchData.destination.toUpperCase();

		console.log(`${searchData.origin} ${searchData.destination}`);

		const { iata: originIATA } = await amadeus.fetchLocationDetails(
			searchData.origin
		);

		const { iata: destinationIATA } = await amadeus.fetchLocationDetails(
			searchData.destination
		);

		// Only now check in locations database and cache if missing
		if (!(await LocationModel.checkForLocation(originIATA))) {
			await amadeus.cacheLocation(originIATA); // pass IATA string or resolvedOrigin object depending on your cacheLocation implementation
		}

		if (!(await LocationModel.checkForLocation(destinationIATA))) {
			await amadeus.cacheLocation(destinationIATA);
		}

		// Update search data
		amadeus.searchData = {
			...searchData,
			origin: originIATA,
			destination: destinationIATA,
		};

		/*Check is search is frequent, true check the flight tables*/
		if (await SearchHistoryModel.checkSearchFrequency(amadeus.searchData)) {
			console.log(
				"This was searched recently, now checking if flight is already in database"
			);
			/* if it exist and flight TTL is valid get the flight with their flight segments,
				else if not exist or flight TTL is expired query the flight adapter and lastly save the flight with flight segments */
		}
		//else save search (logged in user only) and continue query
		try {
			if (user) {
				await SearchHistoryModel.saveSearch(user, amadeus.searchData);
			}
		} catch (err) {
			console.error("Error saving user search history:", err);
			throw new Error("User does not exist");
		}

		// Pass into the flight adapter to utilize the Amadeus api
		const res = await amadeus.getFlights();
		return res;
	}
}

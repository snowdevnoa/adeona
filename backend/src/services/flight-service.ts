// Class based adapter
import { AmadeusAdapter } from "../adapters/amadeus-adapter.ts";
import type { FlightSearchData } from "../interfaces/flight-provider.js";

export default class FlightService {
	/*
    incoming form data
    {
        origin:
        destination:
        departureDate:
        arrivalDate:
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
	    dateFlexDays:
           
    }
     */
	async searchFlights(searchData: FlightSearchData) {
		// Normalize search data
		const normalizeIATA = (code: string) => code.trim().toUpperCase();
		const normalizedSearchData = {
			...searchData,
			origin: normalizeIATA(searchData.origin),
			destination: normalizeIATA(searchData.destination),
		};

		// Resolve scenarios like CHI for chicago or NYC is LGA.
		// Create a new api instance call
		const amadeus = new AmadeusAdapter(normalizedSearchData);
		// Get access token from Amadeus
		try {
			await amadeus.requestAccessToken();
		} catch (err) {
			throw Error;
		}
		// Pass into the flight adapter to utilize the Amadeus api
		const res = await amadeus.getFlights();
		return res;
	}
}

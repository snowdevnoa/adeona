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
		// Validate form data from client

		const amadeus = new AmadeusAdapter();
		// Get access token from Amadeus
		try {
			await amadeus.requestAccessToken();
		} catch (err) {
			throw Error;
		}
		// Pass into the flight adapter to utilize the Amadeus api
		const res = await amadeus.getFlights(searchData);
		return res;
	}
}

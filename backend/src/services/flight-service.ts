// Class based adapter
import { FlightAdapter } from "../adapters/flight-adapter.ts";
import type { FlightSearchData } from "../interfaces/flight-provider.js";

export default class FlightService {
	/*
    incoming form data
    {
    Required
        origin:
        destination:
        departureDate:
        arrivalDate:
        passengerCount:
        tripType:
        flightClass:
        ------------------
    advanced filters
        airline:
        minPrice:
        maxPrice:
        includeRedeye:
        dateFlexDays:
           
    }
     */
	async searchFlights(searchData: FlightSearchData) {

        // Validate form data from client

        
		// Pass into the flight adapter to utilize the Amadeus api
		const amadeus = new FlightAdapter(searchData);
		const res = await amadeus.getFlights();
		return res;
	}
}

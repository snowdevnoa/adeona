import type {
	FlightProvider,
	FlightSearchData,
} from "../interfaces/flight-provider.js";

export class FlightAdapter implements FlightProvider {
	searchData: FlightSearchData;
	// incoming adeona searchData
	constructor(searchData: FlightSearchData) {
		this.searchData = searchData;
	}

	/*  
    // Translate between adeona and Amadeus API
    Amadeus format
    {
    
    }


	Flight search: https://developers.amadeus.com/self-service/category/flights/api-doc/flight-offers-search/api-reference
	GET v2/shopping/flight-offers
    */

	// Conver Adeona search data to Amadeus search data, return results in Adeona format
	async getFlights() {
		// call Amadeus API get flights
		return this.searchData;
	}
}





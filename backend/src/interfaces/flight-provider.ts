// Define interface based on application for the adapter
export interface FlightSearchData {
	origin: string;
	destination: string;
	departureDate: string;
	arrivalDate?: string;
	passengerCount: number;
	tripType: string;
	flightClass: string;
	// Optional advaned filtering
	airline?: string;
	minPrice?: number;
	maxPrice?: number;
	includeRedeye?: boolean;
	dateFlexDays?: number;
}
export interface FlightProvider {
	searchData: FlightSearchData;
	getFlights(): Promise<any>; // async function so return promise
}



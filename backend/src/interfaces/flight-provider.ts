// Define interface based on application for the adapter
export interface FlightSearchData {
	origin: string;
	destination: string;
	departureDate: string;
	returnDate?: string;
	adults: number;
	children: number;
	infants: number;
	seniors: number;
	tripType: "one_way" | "round_trip";
	flightClass: string;
	currency: string;
	// Optional advanced filtering
	includeAirlines?: string[];
	excludeAirlines?: string[];
	nonStop: boolean;
	maxPrice?: number;
	includeRedeye?: boolean;
	dateFlexDays?: number;
}
export interface FlightProvider {
	getFlights(searchData: FlightSearchData): Promise<any>; // async function so return promise
}

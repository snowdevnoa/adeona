import { jest, test, expect, describe } from "@jest/globals";
import FlightService from "../../src/services/flight-service.ts";
const flight = new FlightService();

describe("Test flight search", () => {
	//Test valid flight search data
	test("Should validate the search data", async () => {
		const searchData = {
			origin: "DFW",
			destination: "HNL",
			departureDate: "1-30-2026",
			returnDate: "2-30-2026",
			adults: 1,
			children: 0,
			infants: 0,
			tripType: "round_trip",
			flightClass: "ECONOMY",
		};

		await expect(flight.validateSearchData(searchData)).resolves;
	});


    // Negative test search data validation
	test("Should invalidate the search data - destination date is before current date ", async () => {
		const searchData = {
			origin: "DFW",
			destination: "HNL",
			departureDate: "1-1-2026",
			returnDate: "2-30-2026",
			adults: 1,
			children: 0,
			infants: 0,
			tripType: "round_trip",
			flightClass: "ECONOMY",
		};

		await expect(flight.validateSearchData(searchData)).rejects.toThrow(Error);
	});
});

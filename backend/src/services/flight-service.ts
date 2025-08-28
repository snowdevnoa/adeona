// Class based adapter
import { AmadeusAdapter } from "../adapters/amadeus-adapter.ts";
import type { FlightSearchData } from "../interfaces/flight-provider.js";
import SearchHistoryModel from "../models/search-history-model.js";
import LocationModel from "../models/location-model.js";
import FlightModel from "../models/flight-model.js";
import FlightSegmentModel from "../models/flight-segments-model.js";
import AirlineModel from "../models/airline-model.js";

/*

NOTE TO SELF, IF SEARCH ONE WAY SUCCESSFUL GOOD, 
BUT IF SEARCHING ROUND TRIP SAME CRITERIA (except for trip type) 
IT IS SUCCESSFUL BUT ONLY GETS DEPARTING FLIGHTS STILL MISSING RETURNING FLIGHTS

SOLUTION:
Update search history table and search history model to include passengers

Update flights table and flight model to include passengers

*/
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
		let currentDate = new Date();

		try {
			/* Verify location and origin are strings and not some malicious code. Convert them to strings first before checking*/
			if (!searchData.origin)
				throw new Error("Invalid origin");
			if (!searchData.destination)
				throw new Error("Invalid destination");
			/* Ensure departure date is >= current date*/
			if (new Date(searchData.departureDate) < currentDate)
				throw new Error("Departure date cannot be before current date");
			/* Validate trip Type enums. If trip is round_trip it must contain a return date and not null else if one way return date should be null*/
			if (searchData.tripType == "round_trip" && !searchData.returnDate)
				throw new Error("There must be a return date for round trips");
			if (searchData.tripType == "one_way" && searchData.returnDate)
				throw new Error("Return date should be blank");
			/* Validate flight class enums */
			/* Ensure return date > departure date */
			if (searchData.returnDate) {
				if (
					new Date(searchData.returnDate) < new Date(searchData.departureDate)
				)
					throw new Error("Return date cannot be before departure date");
			}
			/* Validate adults, children, infants are integer number */
			if (Number(searchData.adults) <= 0) {
				throw new Error("There must be at least one adult");
			}

			// if(!Number(searchData.adults) || !Number(searchData.children) || !Number(searchData.infants)){
			// 		throw new Error("Passenger must be a number");
			// }
		} catch (err) {
			if (err instanceof Error) throw Error(err.message);
		}
	}

	async searchFlights(searchData: FlightSearchData, user: any) {
		// console.log(user);

		await this.validateSearchData(searchData);

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

		console.log(`${searchData.origin} to ${searchData.destination}`);

		const originLoc = await amadeus.fetchLocationDetails(searchData.origin);
		if (!originLoc) throw new Error("Origin location not found");
		const { iata: originIATA } = originLoc;

		const destinationLoc = await amadeus.fetchLocationDetails(
			searchData.destination
		);
		if (!destinationLoc) throw new Error("Destination location not found");
		const { iata: destinationIATA } = destinationLoc;

		// Need to cache location before checking flight cache
		if (!(await LocationModel.checkForLocation(originIATA))) {
			await amadeus.cacheLocation(originIATA); // pass IATA string or resolvedOrigin object depending on your cacheLocation implementation
		}
		if (!(await LocationModel.checkForLocation(destinationIATA))) {
			await amadeus.cacheLocation(destinationIATA); // pass IATA string or resolvedOrigin object depending on your cacheLocation implementation
		}

		// Update search data
		amadeus.searchData = {
			...searchData,
			origin: originIATA,
			destination: destinationIATA,
		};

		/*Check is search is frequent, if true check the flight tables*/
		if (await SearchHistoryModel.checkSearchFrequency(amadeus.searchData)) {
			console.log(
				"This was searched recently, now checking if flight is already in database"
			);
			/* if flight exist and flight TTL is valid get the flight with their flight segments*/
			if (await FlightModel.checkValidFlights(amadeus.searchData)) {
				// get flights
				console.log("Found in cached data");

				let df = await FlightModel.getFlights(amadeus.searchData);

				// for each flight, get their flight segments and with new array called segments
				for (let flight of df) {
					// update the flight data in departing flights to add the segments
					flight.trip_type = amadeus.searchData.tripType;
					flight.segments = await FlightSegmentModel.getSegments(
						flight.flight_id
					);
				}

				// if flight is round trip get flights again but switch locations and set departure date to return date

				if (
					amadeus.searchData.tripType === "round_trip" &&
					amadeus.searchData.returnDate
				) {
					const returnSearchData = {
						...amadeus.searchData,
						origin: destinationIATA,
						destination: originIATA,
						departureDate: amadeus.searchData.returnDate,
					};

					let rf = await FlightModel.getFlights(returnSearchData);

					// Check to see if returning flights exists (Problem from one way trips successful, then round trips only get departing but missing return flight)
					if (rf.length === 0) {
						console.log(
							"Cache data for return flights don't exist, now grabbing from Amadeus to save"
						);
						const returnAmadeus = new AmadeusAdapter({
							...returnSearchData,
							tripType: "one_way",
						});
						await returnAmadeus.requestAccessToken();
						const returnResults = await returnAmadeus.getFlights();
						// Cache rturning flights
						await this.cacheFlights(
							returnResults.departingFlights,
							returnAmadeus
						);
						rf = await FlightModel.getFlights(returnSearchData);
					}

					for (let flight of rf) {
						// update the flight data in departing flights to add the segments
						flight.trip_type = amadeus.searchData.tripType;
						flight.segments = await FlightSegmentModel.getSegments(
							flight.flight_id
						);
					}

					return { type: "cached", departingFlights: df, returningFlights: rf };
				}

				// return cached flight data with segments
				return { type: "cached", departingFlights: df };
			}
			//else if flight not exist or flight TTL is expired query the flight adapter and lastly save the flight with flight segments
			else {
				// query the adapter
				const res = await amadeus.getFlights();

				// cache the flights with their segments
				await this.cacheFlights(res.departingFlights, amadeus);

				// if there is returning flights, cache them too
				if (res.returnFlights) {
					await this.cacheFlights(res.returnFlights, amadeus);
				}
				return res;
			}
		}
		//save search (logged in user only) and continue query
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

	async cacheFlights(flights: any, amadeus: any) {
		// cache each flight to database
		for (let flight of flights) {
			console.log("Checking origin location:", flight.origin);

			// Ensure origin exists
			if (!(await LocationModel.checkForLocation(flight.origin))) {
				await amadeus.cacheLocation(flight.origin);
			}

			console.log("Checking destination location:", flight.destination);

			if (!(await LocationModel.checkForLocation(flight.destination))) {
				await amadeus.cacheLocation(flight.destination);
			}
			// convert total duration string to minute integer
			const flightId = await FlightModel.cacheFlight(flight);
			console.log("Now saving segments for flight: " + flightId);

			// for each flight, cache their segment (must pass in the flight id)
			for (const segment of flight.segments) {
				// but first cache the location if it doesn't exist
				if (!(await LocationModel.checkForLocation(segment.origin))) {
					await amadeus.cacheLocation(segment.origin); // pass IATA string or resolvedOrigin object depending on your cacheLocation implementation
				}
				if (!(await LocationModel.checkForLocation(segment.destination))) {
					await amadeus.cacheLocation(segment.destination); // pass IATA string or resolvedOrigin object depending on your cacheLocation implementation
				}

				// console.log(segment);

				// also for airline if it doesn't exist
				if (!(await AirlineModel.checkForAirline(segment.airlineIATA))) {
					await amadeus.cacheAirline(segment.airlineIATA);
				}

				await FlightSegmentModel.cacheSegment(segment, flightId);
			}
		}
	}
}

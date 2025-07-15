import FlightService from "../services/flight-service.ts";

const flight = new FlightService();

export const searchFlight = async (req, res) => {
	try {
		// Receive incoming form data from client
		const flightSearchInfo = req.query;
		// console.log(flightSearchInfo);

		// Pass into flight service
		const flights = await flight.searchFlights(flightSearchInfo);

		// Return all matching flights
		res.status(200).json(flights);
	} catch (err) {
		res.status(400).json({ error: "could not call controller" });
	}
};

export const saveFlight = async (req, res) => {
	const flightInfo = req.body;

	// Return flight was successfully saved
};

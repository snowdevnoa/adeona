import FlightService from "../services/flight-service.js";

const flight = new FlightService();

export const searchFlight = async (req, res) => {
	try {
		// Receive incoming form data from client
		const flightSearchInfo = req.body;
		// Pass into flight service
		const flights = await flight.searchFlights(flightSearchInfo, req.user);

		// Return all matching flights
		res.status(200).json(flights);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

export const saveFlight = async (req, res) => {
	const flightInfo = req.body;
	// Return flight was successfully saved
};

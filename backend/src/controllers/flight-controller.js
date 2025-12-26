import FlightService from "../services/flight-service.ts";

const flight = new FlightService();

export const searchFlight = async (req, res) => {
	try {
		// Receive incoming form data from client
		const flightSearchData = req.body;
		// Pass into flight service
		const flights = await flight.searchFlights(flightSearchData, req.user);

		// Return all matching flights
		res.status(200).json(flights);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};  

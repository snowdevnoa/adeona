import TripService from "../services/trip-service.js";

const trip = new TripService();

export const saveTrip = async (req, res) => {
	try {
		//receive incoming form data from client
		const tripData = req.body;
		const user = req.user;
		const result = await trip.saveTrip(user, tripData);
		console.log(`${result} was saved!`);
		res.status(200).json({ success: `${result} was saved!` });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

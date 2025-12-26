import TripService from "../services/trip-service.js";

const trip = new TripService();

export const saveTrip = async (req, res) => {
	try {
		//receive incoming form data from client
		const tripData = req.body;
		const user = req.user;
		console.log(tripData);
		console.log(user);

		res.status(200);
	} catch (err) {
		console.log(err.message);
	}
};

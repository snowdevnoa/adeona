import z from "zod/v4";
import TripModel from "../models/trip-model.js";

export default class TripService {
	// Save trip in database
	async saveTrip(user, tripData) {
		// Validate trip data
		const Trip = z.object({
			tripName: z.string().regex(/^[a-zA-Z0-9_ ]+$/, "Trip Name is not valid"),
		});
		try {
			Trip.parse(tripData);
		} catch (err) {
			if (err instanceof z.ZodError) throw new Error(err.issues[0].message);
		}

		// Save trip to database
		try {
			const result = await TripModel.saveTrip(user, tripData);
			return tripData.tripName;
		} catch (err) {
			throw new Error(
				"There is already a trip with this name, please type another."
			);
		}
	}

	// Get user trips in database
	async getTrips(user) {
		try {
			const result = await TripModel.getTrips(user);
			return result;
		} catch (err) {
			console.log(`Could not get trips from database`);
		}
	}

	// Update user trip in database

	async updateTrip(user, trip) {
		try {
			const result = await TripModel.updateTrip(user, trip);
			return result;
		} catch (err) {
			throw new Error(
				"There is another trip with the same name, please enter a new name"
			);
		}
	}


	//Delete user trip in database
	async deleteTrip(user, trip){
		try {
			const result = await TripModel.deleteTrip(user, trip);
			return result;
		} catch (err) {
			throw new Error(
				"Could not delete trip in database"
			);
		}
	}
}

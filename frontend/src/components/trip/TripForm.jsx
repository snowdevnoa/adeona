import Input from "../global/Input";
import { use, useState } from "react";
import MainButton from "../global/MainButton";

export default function TripForm({ searchData, flights }) {
	const [tripName, setTripName] = useState(null);
	const [message, setMessage] = useState(null);

	const { departingFlight, returnFlight } = flights;

	function createTrip(e) {
		e.preventDefault();

		try {
			if (!tripName || tripName === '') {
				throw new Error("Trip name cannot be empty.");
			}

			const tripPayload = {
				tripName: tripName,
				searchData: {
					...searchData,
					origin: departingFlight.origin,
					destination: departingFlight.destination,
				},
				flights: { departingFlight, returnFlight },
			};

			console.log(tripPayload);
		} catch (err) {
			console.log(err.message);
			setMessage(err.message);
		}
	}

	return (
		<form onSubmit={createTrip}>
			<Input
				type="text"
				label="Trip Name"
				name="tripName"
				id="tripName"
				placeholder="My Trip"
				value={tripName}
				onChange={(e) => {
					setTripName(e.target.value);
				}}
				className="border-2"
			/>
			<p className="text-[var(--error-400)] mt-[1rem] md:text-xl">{message}</p>
			<MainButton
				type="submit"
				className="w-full mt-4"
			>
				Create Trip
			</MainButton>
		</form>
	);
}

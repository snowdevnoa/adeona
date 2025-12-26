import Input from "../global/Input";
import { use, useState } from "react";
import MainButton from "../global/MainButton";

export default function TripForm({ searchData, flights, dataType }) {
	const [tripName, setTripName] = useState(null);
	const [message, setMessage] = useState(null);

	const { departingFlight, returnFlight } = flights;

	async function createTrip(e) {
		e.preventDefault();

		try {
			if (!tripName || tripName.trim() === "") {
				throw new Error("Trip name cannot be empty.");
			}

			const tripPayload = {
				tripName: tripName.trim(),
				dataType: dataType,
				searchData: {
					...searchData,
					origin: departingFlight.origin,
					destination: departingFlight.destination,
				},
				flights: { departingFlight, returnFlight },
			};

			const res = await fetch(
				`${process.env.NEXT_PUBLIC_DEV_API_URL}/trips/save`,
				{
					method: "POST",
					credentials: "include",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(tripPayload),
				}
			);

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error);
			}
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

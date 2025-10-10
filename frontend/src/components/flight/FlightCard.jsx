import { airlines } from "@/lib/consts";
import { useState } from "react";
import Dropdown from "@/assets/global/Dropdown.svg";
import SecondaryButton from "../global/SecondaryButton";
import Placeholder from "@/assets/global/Placeholder.svg";

/* incoming flight info

Object
adults: "1"
airline_name: "ALASKA AIRLINES"
arrival_datetime: "2025-10-07T13:45:00"
children: "0"
currency: "USD"
departure_datetime: "2025-10-07T07:15:00"
destination: "HNL"
duration_minutes: 690
flight_class: "ECONOMY"
infants: "0"
main_airline: "AS"
num_segments: 2
origin: "DFW"
price: "229.40"
segments: (2) [{…}, {…}]
	example~
    airlineIATA: "HA"
	arrivalDateTime: "2025-10-09T16:44:00"
	departureDateTime: "2025-10-09T14:30:00"
	destination: "SEA"
	destinationCity:
	destinationAirport:
	durationMins: 254
	origin: "DFW"
	originCity:
	originAirport:
	segmentNumber: 1
trip_type: "round_trip"
*/
export default function FlightCard({ flight, selectFlight }) {
	const [toggle, setToggle] = useState(false);
	const AirlineLogo = airlines[flight.main_airline]?.logo || Placeholder; //self note: if airline logo doesn't exist, image placeholder
	const departureDateTime = new Date(flight.departure_datetime);
	const arrivalDateTime = new Date(flight.arrival_datetime);
	const { origin, destination, price } = flight;
	const tripType = flight.trip_type;
	const totalDuration = flight.duration_minutes;
	const flightClass = flight.flight_class;
	const stops = flight.segments.length - 1;
	// Check if date arrive is one day later than departing date
	function checkNextCalendarDay(departingDate, arrivalDate) {
		const dep = new Date(departingDate);
		const arr = new Date(arrivalDate);
		if (isNaN(dep) || isNaN(arr)) return false;

		// Compare calendar days (local)
		const depDate = new Date(dep.getFullYear(), dep.getMonth(), dep.getDate());
		const arrDate = new Date(arr.getFullYear(), arr.getMonth(), arr.getDate());

		const diffDays = (arrDate - depDate) / (1000 * 60 * 60 * 24);
		return diffDays >= 1;
	}

	// SEGMENT Component
	const segments = flight.segments.map((segment, index, segments) => {
		const SegmentAirline = airlines[segment.airlineIATA]?.logo || Placeholder;
		const segmentDepartureDateTime = new Date(segment.departureDateTime);
		const segmentArrivalDateTime = new Date(segment.arrivalDateTime);

		// layover inbetween segments - exclude last segment
		let layoverMins = null;
		if (index != segments.length - 1) {
			const nextSegmentDepartureTime = new Date(
				segments[index + 1].departureDateTime
			);
			// calculate next departure time and current arrival time difference
			const layoverDiff = nextSegmentDepartureTime - segmentArrivalDateTime;
			// Calculate total minutes from difference in miliseconds
			// console.log(Math.floor(layoverDiff / 1000 / 60));
			layoverMins = Math.floor(layoverDiff / 1000 / 60);
		}

		return (
			<article
				className="flex flex-col space-y-2"
				key={index}
			>
				<div className="flex justify-between">
					<h2>
						{segment.originCity.toLowerCase()} →{" "}
						{segment.destinationCity.toLowerCase()}
					</h2>
					<h2 className="text-[var(--adeona-blue-700)]">
						{Math.floor(segment.durationMins / 60)} hr{" "}
						{segment.durationMins % 60} m
					</h2>
				</div>

				<section className="flex">
					<SegmentAirline className="mr-4" />
					<div className="flex flex-col grow">
						<p className="font-bold">
							{segmentDepartureDateTime.toLocaleTimeString("en-US", {
								hour: "2-digit",
								minute: "2-digit",
							})}
							{/* exclude first segment, check if depature date is next calendar date from previous arrival date*/}
							{index != 0
								? checkNextCalendarDay(
										segments[index - 1].arrivalDateTime,
										segmentDepartureDateTime
								  )
									? "+1"
									: ""
								: ""}{" "}
						</p>
						<p>{segment.originAirport}</p>
					</div>
					<div className="flex flex-col grow">
						<p className="font-bold">
							{segmentArrivalDateTime.toLocaleTimeString("en-US", {
								hour: "2-digit",
								minute: "2-digit",
							})}
							{/* check arrival date is next calendar day from departure date*/}
							{checkNextCalendarDay(
								segmentDepartureDateTime,
								segmentArrivalDateTime
							)
								? "+1"
								: ""}
							<span className="font-normal text-xs text-[var(--error-800)] ml-4">
								{layoverMins &&
									`layover: ${
										Math.floor(layoverMins / 60) === 0
											? ""
											: Math.floor(layoverMins / 60) + " hr"
									}
										${layoverMins % 60 === 0 ? "" : (layoverMins % 60) + " mins"}`}
							</span>
						</p>
						<p>{segment.destinationAirport}</p>
					</div>
				</section>
			</article>
		);
	});

	return (
		<main
			className={
				(toggle
					? "bg-[var(--adeona-blue-100)]" + " text-black"
					: "bg-[var(--adeona-blue-700)]" + " text-white") +
				" mt-8 rounded-lg p-4 md:w-[704px]"
			}
		>
			<section className="flex">
				<AirlineLogo />
				<div className="flex flex-col grow ml-6">
					<div className="flex justify-between">
						{/* Departing date */}
						<div className="flex flex-col">
							<p className="font-bold">
								{departureDateTime.toLocaleTimeString("en-US", {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</p>
							<p>{origin}</p>
						</div>
						{/* Arrival date */}
						<div className="flex flex-col">
							<p className="font-bold">
								{arrivalDateTime.toLocaleTimeString("en-US", {
									hour: "2-digit",
									minute: "2-digit",
								})}
								{checkNextCalendarDay(departureDateTime, arrivalDateTime)
									? "+1"
									: ""}
							</p>
							<p>{destination}</p>
						</div>
						{/* Price & trip type */}
						<div className="flex flex-col">
							<p className="font-bold">${price}</p>
							<p>{tripType.replace("_", " ")}</p>
						</div>
					</div>
					{/* Flight duration */}
					<p
						className={
							(toggle
								? "text-[var(--adeona-blue-700)]"
								: "text-[var(--adeona-blue-900)]") + " font-medium"
						}
					>
						{Math.floor(totalDuration / 60)} hr {totalDuration % 60} m
					</p>
				</div>
			</section>
			<section className="flex justify-between">
				<p className={toggle ? "font-bold" : ""}>
					{stops == 0
						? "nonstop"
						: stops === 1
						? `${stops} stop in ${flight.segments[0].destinationCity.toLowerCase()}`
						: `${stops} stops`}
					{/*Self note to enter in country for 1 stop */}
				</p>
				<p>{flightClass.toLowerCase()}</p>
				<button
					className="flex items-center space-x-1 hover:cursor-pointer"
					onClick={() => {
						setToggle((prevState) => !prevState);
					}}
				>
					<p>see details</p>
					<Dropdown
						fill={toggle ? "" : "white"}
						className={toggle ? "rotate-180" : ""}
					/>
				</button>
			</section>

			{toggle && (
				<section className="flex flex-col py-4 space-y-8  border-t-2 border-white mt-2">
					{/* Flight segment */}
					{segments}
					<SecondaryButton
						onClick={() => {
							selectFlight((prevState) => flight);
							setToggle(false);
						}}
					>
						Save Flight
					</SecondaryButton>
				</section>
			)}
		</main>
	);
}

import { useState } from "react";
import Back from "@/assets/global/Back.svg";
import FlightCard from "./FlightCard";
import { motion, stagger } from "motion/react";
import TripForm from "../trip/TripForm";

/*
incoming prop results 
mutation.data = {
  type: "amadeus",
  departingFlights: [...],
  returningFlights: [...]
}
*/
export default function FlightList({ results, mutation, onComplete }) {
	const [departingFlights, setDepartingFlights] = useState(
		results.departingFlights
	);
	const [returningFlights, setreturningFlights] = useState(
		results.returningFlights ? results.returningFlights : null
	);
	const [selectedDepartingFlight, setSelectedDepartingFlight] = useState(null);
	const [selectedReturningFlight, setSelectedReturningFlight] = useState(null);

	/* Variant for flight card animation */
	const cardVariants = {
		// variant: animation
		hidden: { opacity: 0, y: -10 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				when: "beforeChildren",
				delayChildren: stagger(0.2),
				type: "spring",
				visualDuration: 0.4,
				bounce: 0.5,
			},
		},
	};

	// if departing flight has not been selected, return departing list
	if (!selectedDepartingFlight)
		return (
			<main className="px-4">
				<section className="flex mt-8">
					<button
						className="bg-[var(--adeona-blue-900)] py-[10px] px-[1rem] rounded-full flex justify-center items-center"
						onClick={() => {
							mutation.reset();
						}}
					>
						<Back
							width={14}
							height={14}
							stroke="var(--cosmic-latte-300)"
						/>
						<p className="text-[var(--cosmic-latte-300)]">Back</p>
					</button>
					<h1 className="text-3xl font-bold ml-[1rem] tracking-[0.5rem]">
						Departures
					</h1>
				</section>
				<p className="mt-2 text-md text-[var(--cosmic-latte-700)]">
					All flights are from official airlines. Prices include required taxes
					+ fees. Optional charges and bag fees may apply.
				</p>
				<motion.section
					className="flex flex-col items-center mt-8 space-y-8"
					variants={cardVariants}
					initial="hidden"
					animate="visible"
				>
					{/* Display individual flight card*/}
					{departingFlights.map((flight, index) => (
						<FlightCard
							key={index + 1}
							flight={flight}
							selectFlight={setSelectedDepartingFlight}
							dataType={results.type}
							// add variant
							variants={cardVariants}
						/>
					))}
				</motion.section>
			</main>
		);

	//if trip is round trip and return flight has not been selected, return return list
	if (returningFlights && !selectedReturningFlight)
		return (
			<main className="px-4">
				<section className="flex mt-8">
					<button
						className="bg-[var(--adeona-blue-900)] py-[10px] px-[1rem] rounded-full flex justify-center items-center"
						onClick={() => {
							setSelectedDepartingFlight(null);
						}}
					>
						<Back
							width={14}
							height={14}
							stroke="var(--cosmic-latte-300)"
						/>
						<p className="text-[var(--cosmic-latte-300)]">Back</p>
					</button>
					<h1 className="text-3xl font-bold ml-[1rem] tracking-[0.5rem]">
						Returns
					</h1>
				</section>
				<p className="mt-2 text-md text-[var(--cosmic-latte-700)]">
					All flights are from official airlines. Prices include required taxes
					+ fees. Optional charges and bag fees may apply.
				</p>
				<motion.section
					className="flex flex-col items-center mt-8 space-y-8"
					variants={cardVariants}
					initial="hidden"
					animate="visible"
				>
					{/* Display individual flight card*/}
					{returningFlights.map((flight, index) => (
						<FlightCard
							key={index + 1}
							flight={flight}
							selectFlight={setSelectedReturningFlight}
							dataType={results.type}
							// add variant
							variants={cardVariants}
						/>
					))}
				</motion.section>
			</main>
		);

	return (
		<main className="px-4">
			<section className="flex mt-8">
				<button
					className="bg-[var(--adeona-blue-900)] py-[10px] px-[1rem] rounded-full flex justify-center items-center"
					onClick={() => {
						selectedReturningFlight
							? setSelectedReturningFlight(null)
							: setSelectedDepartingFlight(null);
					}}
				>
					<Back
						width={14}
						height={14}
						stroke="var(--cosmic-latte-300)"
					/>
					<p className="text-[var(--cosmic-latte-300)]">Back</p>
				</button>
				<h1 className="text-3xl font-bold ml-[1rem] tracking-[0.5rem]">
					Overview
				</h1>
			</section>
			<p className="mt-2 text-md text-[var(--cosmic-latte-700)]">
				All flights are from official airlines. Prices include required taxes +
				fees. Optional charges and bag fees may apply.
			</p>
			<section className="flex flex-col mt-8 space-y-8">
				{selectedDepartingFlight && (
					<div>
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-xl md:text-2xl font-bold">
								Departing Flight
							</h2>
							<h2 className="text-xl md:text-2xl">
								{formatDate(mutation.variables.departureDate)}
							</h2>
						</div>

						<FlightCard
							flight={selectedDepartingFlight}
							dataType={results.type}
						/>
					</div>
				)}
				{selectedReturningFlight && (
					<div>
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-xl md:text-2xl font-bold ">
								Returning Flight
							</h2>
							<h2 className="text-xl md:text-2xl">
								{formatDate(mutation.variables.returnDate)}
							</h2>
						</div>

						<FlightCard
							flight={selectedReturningFlight}
							dataType={results.type}
						/>
					</div>
				)}
			</section>
			<section className="flex flex-col mt-8 space-y-4">
				<div className="flex font-bold justify-between text-lg">
					<p>
						{mutation.variables.origin} to {mutation.variables.destination}
					</p>
					<p>{mutation.variables.adults} adult</p>
					<p>{mutation.variables.flightClass.toLowerCase()}</p>
					<p>{mutation.variables.tripType.replace(/_/g, " ")}</p>
				</div>
				<div className="self-end flex flex-wrap space-x-4 text-2xl font-bold text-[var(--adeona-blue-700)]">
					<h1>Total:</h1>{" "}
					<h1>
						$
						{selectedReturningFlight
							? (
									new Number(selectedDepartingFlight.price) +
									new Number(selectedReturningFlight.price)
							  ).toFixed(2)
							: selectedDepartingFlight.price}
					</h1>
				</div>
			</section>

			<TripForm
				searchData={mutation.variables}
				flights={{
					departingFlight: selectedDepartingFlight,
					returnFlight: selectedReturningFlight,
				}}
				dataType={mutation.data.type}
				totalPrice={
					selectedReturningFlight
						? (
								new Number(selectedDepartingFlight.price) +
								new Number(selectedReturningFlight.price)
						  ).toFixed(2)
						: selectedDepartingFlight.price
				}
				onComplete={onComplete}
			/>
		</main>
	);
}
function formatDate(dateString) {
	const [y, m, d] = dateString.split("-");
	return new Date(y, m - 1, d).toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
	});
}

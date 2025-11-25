import { useState } from "react";
import Back from "@/assets/global/Back.svg";
import FlightCard from "./FlightCard";

/*
incoming prop results 
mutation.data = {
  type: "amadeus",
  departingFlights: [...],
  returningFlights: [...]
}
*/
export default function FlightList({ results, mutation }) {
	const [departingFlights, setDepartingFlights] = useState(
		results.departingFlights
	);
	const [returningFlights, setreturningFlights] = useState(
		results.returningFlights ? results.returningFlights : null
	);
	const [selectedDepartingFlight, setSelectedDepartingFlight] = useState(null);
	const [selectedReturningFlight, setSelectedReturningFlight] = useState(null);

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
						<Back stroke="var(--cosmic-latte-300)" />
						<p className="text-[var(--cosmic-latte-300)]">Back</p>
					</button>
					<h1 className="text-3xl font-bold mr-[1rem] tracking-[0.5rem]">
						Departures
					</h1>
				</section>
				<section className="flex flex-col">
					{/* Display individual flight card*/}
					{departingFlights.map((flight, index) => (
						<FlightCard
							key={index + 1}
							flight={flight}
							selectFlight={setSelectedDepartingFlight}
							dataType={results.type}
						/>
					))}
				</section>
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
						<Back stroke="var(--cosmic-latte-300)" />
						<p className="text-[var(--cosmic-latte-300)]">Back</p>
					</button>
					<h1 className="text-3xl font-bold mr-[1rem] tracking-[0.5rem]">
						Returns
					</h1>
				</section>
				<section className="flex flex-col">
					{/* Display individual flight card*/}
					{returningFlights.map((flight, index) => (
						<FlightCard
							key={index + 1}
							flight={flight}
							selectFlight={setSelectedReturningFlight}
							dataType={results.type}
						/>
					))}
				</section>
			</main>
		);

	return (
		<>
			<button
				className="bg-[var(--adeona-blue-900)] py-[10px] px-[1rem] rounded-full flex justify-center items-center"
				onClick={() => {
					selectedReturningFlight
						? setSelectedReturningFlight(null)
						: setSelectedDepartingFlight(null);
				}}
			>
				<Back stroke="var(--cosmic-latte-300)" />
				<p className="text-[var(--cosmic-latte-300)]">Back</p>
			</button>
			<button
				onClick={() => {
					console.log(departingFlights);
					console.log(returningFlights);
					console.log(results)
				}}
			>
				Check flights
			</button>
			<p>Overview</p>
			{selectedDepartingFlight && (
				<FlightCard
					flight={selectedDepartingFlight}
					dataType={results.type}
				/>
			)}
			{selectedReturningFlight && (
				<FlightCard
					flight={selectedReturningFlight}
					dataType={results.type}
				/>
			)}
		</>
	);
}

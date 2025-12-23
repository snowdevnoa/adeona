"use client";
import Form from "next/form";
import MainButton from "../global/MainButton";
import SecondaryButton from "../global/SecondaryButton";
import Input from "@/components/global/Input";
import SelectDropdown from "../global/SelectDropdown";
import { useState, useRef } from "react";
import Search from "@/assets/flight/Search.svg";
import Passengers from "@/assets/flight/Passenger.svg";
import Dropdown from "@/assets/global/Dropdown.svg";

export default function FlightForm({ onSubmit }) {
	// Get the value of all passenger types to update total passengers
	const [passengers, setPassengers] = useState(1);
	const [passengerGroup, setPassengerGroup] = useState(false);
	const adultsRef = useRef(null);
	const childrenRef = useRef(null);
	const infantsRef = useRef(null);

	// Grab the trip type value to disable return date input
	const tripTypeRef = useRef(null);
	const returnDateRef = useRef(null);

	function disableReturnDate() {
		console.log("trip type changed");
		const tripType = tripTypeRef.current.value;
		const returnDateElement = returnDateRef.current;
		if (tripType === "one_way") {
			returnDateElement.setAttribute("disabled", "");
		} else {
			returnDateElement.removeAttribute("disabled");
		}
	}

	function updatePassengers(e) {
		const adults = adultsRef.current.value;
		const children = childrenRef.current.value;
		const infants = infantsRef.current.value;

		let sum = parseInt(adults) + parseInt(children) + parseInt(infants);
		// console.log(sum);
		setPassengers(sum);
		setPassengerGroup(false);
	}

	return (
		<Form
			className="bg-white px-6 py-4 rounded-4xl flex flex-col space-y-2 items-center items-stretch w-[350px] md:w-[500px]"
			onSubmit={onSubmit}
		>
			<Input
				type="text"
				label="Origin"
				name="origin"
				id="origin"
				className=" border-2 border-solid border-[var(--adeona-blue-900)] rounded-2xl"
				placeholder="Enter city or airport IATA (e.g. Dallas, Cebu, DFW, LAX)"
			/>
			<Input
				type="text"
				label="Destination"
				name="destination"
				id="destination"
				className=" border-2 border-solid border-[var(--adeona-blue-900)] rounded-2xl"
				placeholder="Enter city or airport IATA (e.g. Dallas, Cebu, DFW, LAX)"
			/>

			<div className="flex justify-center items-center space-x-4">
				<Input
					type="date"
					label="Departure"
					name="departureDate"
					id="departureDate"
					className="border-2 border-solid border-[var(--adeona-blue-900)] rounded-2xl max-w-[150px] md:max-w-[250px]"
				/>
				<Input
					type="date"
					label="Return"
					name="returnDate"
					id="returnDate"
					className="border-2 border-solid border-[var(--adeona-blue-900)] rounded-2xl max-w-[150px] md:max-w-[250px] disabled:opacity-25"
					ref={returnDateRef}
				/>
			</div>

			<div className="flex flex-wrap justify-center space-x-4 md:space-x-10 space-y-4">
				<SelectDropdown
					label="Trip type"
					name="tripType"
					values={["round_trip", "one_way"]}
					ref={tripTypeRef}
					onChange={disableReturnDate}
				/>
				<SelectDropdown
					label="Flight Class"
					name="flightClass"
					values={["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"]}
				/>
				<SelectDropdown
					id="currency"
					name="currency"
					value="USD"
					label="Currency"
					className="max-w-[75px]"
					values={["USD", "CAD", "YEN"]}
				/>
				<div
					className="flex justify-center items-center space-x-2 hover:cursor-pointer"
					onClick={() => setPassengerGroup(!passengerGroup)}
				>
					<Passengers />
					<p>{passengers}</p>
					<Dropdown
						className={`${passengerGroup ? "transform-[scaleY(-1)]" : ""}`}
					/>
				</div>
				<div
					className={`flex flex-row ${
						passengerGroup ? "flex" : "hidden"
					} absolute z-2 passengers bg-black text-white py-2 px-8 space-x-2 items-center rounded-2xl translate-y-8`}
					onBlur={updatePassengers}
				>
					<Input
						type="number"
						id="adults"
						name="adults"
						min="1"
						max="10"
						value={1}
						label="Adults"
						ref={adultsRef}
						className="text-black"
					/>
					<Input
						type="number"
						id="children"
						name="children"
						min="0"
						max="10"
						value={0}
						label="Children"
						ref={childrenRef}
						className="text-black"
					/>
					<Input
						type="number"
						id="infants"
						name="infants"
						min="0"
						max="10"
						value={0}
						label="Infants"
						ref={infantsRef}
						className="text-black"
					/>
				</div>
			</div>

			{/* <p className="self-end">Advanced Filters</p> */}

			<MainButton
				type="submit"
				className="px-[1.5rem] rounded-4xl flex items-center self-center"
			>
				<Search
					height={20}
					width={20}
					className="stroke-current text-white mr-[0.5rem] stroke-[0.75]"
				/>
				Explore
			</MainButton>
		</Form>
	);
}

"use client";
import FlightForm from "./FlightForm";
import Header from "../global/Header";
import { useMutation } from "@tanstack/react-query"; // use mutation for user driven events
import FlightList from "./FlightList";
import NoFlights from "./NoFlights";
import LoadingFlights from "./LoadingFlights";
import PageWrapper from "../global/PageWrapper";

export default function FlightPage() {
	const mutation = useMutation({
		mutationFn: (searchData) => fetchFlights(searchData),
	});

	function searchFlights(e) {
		e.preventDefault();
		const formData = new FormData(e.target);

		let newSearch = {};

		for (const [key, value] of formData) {
			// console.log(key, value);
			newSearch[key] = value;
		}
		mutation.mutate(newSearch);
	}

	async function fetchFlights(searchData) {
		// console.log(searchData);
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_DEV_API_URL}/flights/search`,
			{
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(searchData),
			}
		);

		// Check for any errors from response, if true throw an error for React Query
		if (!response.ok) {
			const errorData = await response.json();
			// console.log(errorData);
			throw new Error(errorData.error || "Server error");
		}

		return await response.json();
	}

	//Reset all internal state and tanstack once trip has been selected
	function handleFullReset() {
		mutation.reset();
	}

	return (
		/*
  The flight search form section stays mounted even after a successful search.
  Instead of conditionally rendering the form section, we toggle the visibility through CSS.

  Reason:
  - The form is complex and contains internal refs, passenger selectors, etc.
  - Unmounting and remounting would reset all uncontrolled inputs and refs,
    making "going back" to edit a previous search cumbersome.
  - Keeping it mounted preserves all entered data and UI state without
    additional state management.

  When the user clicks "reset" (mutation.reset()),  simply un-hide the section
  and the user sees their original form state intact.
*/

		<>
			<section
				className={`bg-[url(/backgrounds/eibner-saliba-3T9dDY0WqDI-unsplash.jpg)] flex flex-col items-center bg-cover bg-center h-auto pb-4 ${
					mutation.isSuccess || mutation.isPending ? "hidden" : ""
				}`}
			>
				<Header title="Flights" />
				<FlightForm onSubmit={searchFlights} />
				{mutation.isError && (
					<p className="text-[var(--error-500)]">{mutation.error.message}</p>
				)}
			</section>

			{mutation.isPending && <LoadingFlights />}
			{mutation.isSuccess && (
				<PageWrapper className="justify-center items-center">
					<Header title="Flights" />
					{mutation.data.departingFlights.length === 0 ? (
						<NoFlights mutation={mutation} />
					) : (
						<FlightList
							results={mutation.data}
							mutation={mutation}
							onComplete={handleFullReset}
						/>
					)}
				</PageWrapper>
			)}
		</>
	);
}

"use client";
import FlightForm from "./FlightForm";
import Header from "./Header";
import { useMutation } from "@tanstack/react-query"; // use mutation for user driven events

export default function FlightPage() {
	const mutation = useMutation({
		mutationFn: (searchData) => getFlights(searchData),
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

	async function getFlights(searchData) {
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
			throw new Error(errorData.error || "Unknown error");
		}

		return await response.json();
	}

	return (
		<>
			<section className="bg-[url(/backgrounds/eibner-saliba-3T9dDY0WqDI-unsplash.jpg)] flex flex-col items-center bg-cover bg-center h-auto pb-4">
				<Header />
				<FlightForm onSubmit={searchFlights} />
				{mutation.isError && (
					<p className="text-[var(--error-500)]">{mutation.error.message}</p>
				)}
			</section>
			{mutation.isLoading && <p className="text-4xl">Searching. . .</p>}
			{mutation.isSuccess && <p>{JSON.stringify(mutation.data)}</p>}
		</>
	);
}

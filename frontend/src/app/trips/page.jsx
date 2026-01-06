"use client";
import Header from "@/components/global/Header";
import MainNav from "@/components/global/MainNav";
import SecondaryNav from "@/components/global/SecondaryNav";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function Trips() {
	const router = useRouter();
	const [trips, setTrips] = useState(null);
	const { status, data, error } = useQuery({
		queryKey: ["trips"],
		queryFn: fetchTrips,
	});

	async function fetchTrips() {
		console.log("Fetching user trips");
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_DEV_API_URL}/trips/my-trips`,
			{ credentials: "include" }
		);
		// Check for any errors from response, if true throw an error for React Query
		if (!response.ok) {
			const errorData = await response.json();
			console.log(errorData);
			throw new Error(errorData.error || "Server error");
		}

		console.log(error);
		const userTrips = await response.json();
		return userTrips;
	}

	if (status === "pending")
		return (
			<>
				<p>loading</p>
			</>
		);

	return error ? (
		<>
			<MainNav />
			<h1>Please log in</h1>
			<button
				type="button"
				onClick={() => {
					router.push("/login");
				}}
			>
				Log in
			</button>
			<SecondaryNav />
		</>
	) : (
		<>
			<Header title="Trips" />
			<p>test</p>
			<SecondaryNav />
		</>
	);
}

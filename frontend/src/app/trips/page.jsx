"use client";
import Header from "@/components/global/Header";
import MainNav from "@/components/global/MainNav";
import SecondaryNav from "@/components/global/SecondaryNav";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import TripCard from "@/components/trip/TripCard";
import PageWrapper from "@/components/global/PageWrapper";


export default function Trips() {
	const router = useRouter();
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

		const userTrips = await response.json();
		return userTrips;
	}

	let myTrips = null;
	if (data) {
		myTrips = data.trips.map((trip) => {
			return (
				<TripCard
					trip={trip}
					key={trip.trip_id}
				/>
			);
		});
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
		<PageWrapper className="space-y-[2rem]">
			<Header title="Trips" />
			<h1 className="text-4xl p-4 font-bold">{myTrips.length} trips</h1>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8 self-center">
				{myTrips}
			</div>

			<SecondaryNav />
		</PageWrapper>
	);
}

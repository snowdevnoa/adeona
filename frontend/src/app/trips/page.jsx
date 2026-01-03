"use client";
import Header from "@/components/global/Header";
import MainNav from "@/components/global/MainNav";
import SecondaryNav from "@/components/global/SecondaryNav";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function Trips() {
	const [trips, setTrips] = useState(null);
	const result = useQuery({ queryKey: ["trips"], queryFn: fetchTrips });

	function fetchTrips() {
		console.log("Fetching user trips");
	}

	return trips ? (
		<>
			<Header title="Trips" />
			<p>test</p>
			<SecondaryNav />
		</>
	) : (
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
	);
}

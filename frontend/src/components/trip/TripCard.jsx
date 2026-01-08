import { useState } from "react";
import Edit from "@/assets/trip/Edit.svg";
import TripModal from "./TripModal";

export default function TripCard({ trip }) {
	const [status, setStatus] = useState("default" || "hover");
	const [modal, setModal] = useState("close" || "open");

	/* 
	{
  "trip_id": "...",
  "user_id": "...",
  "trip_name": "More expensive trip",
  "trip_type": "round_trip",
  "origin_iata": "DFW",
  "destination_iata": "SEA",
  "departure_date": "2026-01-01T00:00:00.000Z",
  "return_date": "2026-01-07T00:00:00.000Z",
  "flight_class": "ECONOMY",
  "total_price": 506.59,
  "currency_code": "USD",
  "passengers": {
    "adults": 1,
    "children": 0,
    "infants": 0
  },
  "flight_details_snapshot": {
    "dataType": "cached",
    "departingFlight": {},
    "returnFlight": {}
  },
  "saved_at": "2025-12-30T22:06:38.993Z"
}
	*/

	return (
		<article className="w-[275px] space-y-[1rem]">
			<div
				className={`rounded-4xl w-[275px] h-[200px] bg-cover bg-center bg-[url(/backgrounds/eibner-saliba-3T9dDY0WqDI-unsplash.jpg)] relative ${
					status === "hover" ? "bg-blend-darken bg-black/40" : "bg-transparent"
				}`}
				onMouseEnter={(e) => {
					setStatus("hover");
				}}
				onMouseLeave={(e) => {
					setStatus("default");
				}}
			>
				{status === "hover" ? (
					<Edit
						className="z-2 absolute right-[16px] bottom-[16px] hover:cursor-pointer"
						fill="var(--cosmic-latte-300)"
						onClick={() => {
							setModal("open");
						}}
					/>
				) : (
					""
				)}
			</div>
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">{trip.trip_name}</h2>
				<p className="text-[var(--adeona-blue-700)] italic font-medium">
					${trip.total_price}
				</p>
			</div>
			<div className="flex font-light justify-between text-sm">
				<p>
					{trip.origin_iata} to {trip.destination_iata}
				</p>
				<p>{trip.adults} adult</p>
				<p>{trip.flight_class.toLowerCase()}</p>
				<p>{trip.trip_type.replace(/_/g, " ")}</p>
			</div>
			{modal === "open" ? <TripModal setModal={setModal} trip={trip}/> : ""}
		</article>
	);
}

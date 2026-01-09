import { useState } from "react";
import Input from "../global/Input";
import AddImage from "@/assets/trip/AddImage.svg";
import X from "@/assets/global/X.svg";
import Trash from "@/assets/trip/Trash.svg";
import Update from "@/assets/trip/Update.svg";

export default function TripModal({ setModal, trip }) {
	const [cover, setCover] = useState("default" || "hover");

	// use state and handleChange for controlled form
	const [tripData, setTripData] = useState(trip);
	const [count, setCount] = useState(
		trip.description ? trip.description.length : 0
	);

	function handleChange(e) {
		e.preventDefault();
		const { name, value } = e.target;
		// console.log(name + " " + value);
		// check if description, if character count exceeds 250 throw error
		if (name === "description") {
			setCount(value.length);
		}
		setTripData((prev) => {
			return { ...prev, [name]: value };
		});
	}

	return (
		<main className="fixed w-screen h-screen bg-[rgb(0,0,0,0.5)] z-2 top-0 right-0">
			<div className="w-full h-full flex flex-col justify-center items-center">
				<form
					className="w-[80%] lg:w-[475px] text-[var(--adeona-blue-900)] bg-[var(--adeona-blue-300)] p-4 rounded-lg flex flex-col space-y-2 relative"
					onSubmit={(e) => {
						e.preventDefault();
					}}
				>
					<X
						className="absolute right-5 stroke-black hover:cursor-pointer hover:stroke-[var(--error-400)]"
						onClick={() => {
							setModal("close");
						}}
					/>

					<h1 className="font-bold text-[2.25rem]">Edit Your Trip</h1>

					<h2>Trip Cover</h2>
					<div
						className={`rounded-4xl w-full min-h-[170px] bg-cover bg-center bg-[url(/backgrounds/eibner-saliba-3T9dDY0WqDI-unsplash.jpg)] flex justify-center items-center ${
							cover === "hover"
								? "bg-blend-darken bg-black/40"
								: "bg-transparent"
						}`}
						onMouseEnter={(e) => {
							setCover("hover");
						}}
						onMouseLeave={(e) => {
							setCover("default");
						}}
					>
						{cover === "hover" ? (
							<button className="bg-[var(--cosmic-latte-300)] px-2.5 py-2 rounded-2xl font-bold flex items-center space-x-2 hover:cursor-pointer hover:bg-[var(--cosmic-latte-600)] hover:text-white hover:fill-white">
								upload
								<AddImage fill="inherit" />
							</button>
						) : (
							""
						)}
					</div>
					<h2>Trip Name</h2>
					<Input
						name="tripName"
						value={tripData.trip_name}
						onChange={handleChange}
					/>
					<h2>Description</h2>
					<textarea
						name="description"
						defaultValue={tripData.description || ""}
						placeholder="What is this trip about?"
						className="h-[130px] bg-white rounded-2xl p-4"
						maxLength={250}
						onChange={handleChange}
					></textarea>
					<p className="self-end">max: {count}/250</p>
					<div className="flex justify-center space-x-4">
						<button className="py-3 px-6 bg-[var(--error-300)] font-bold text-white rounded-2xl flex">
							<Trash className="mr-1" /> Delete
						</button>
						<button
							className="py-3 px-6 bg-white font-bold text-[var(--adeona-blue-900)] rounded-2xl flex"
							type="submit"
						>
							<Update className="mr-1" /> Update
						</button>
					</div>
				</form>
			</div>
		</main>
	);
}

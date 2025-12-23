import Back from "@/assets/global/Back.svg";
export default function NoFlights({ mutation }) {
	return (
		<main>
			<button
				className="bg-[var(--adeona-blue-900)] py-[10px] px-[1rem] rounded-full flex justify-center items-center"
				onClick={() => {
					mutation.reset();
				}}
			>
				<Back stroke="var(--cosmic-latte-300)" />
				<p className="text-[var(--cosmic-latte-300)]">Back</p>
			</button>
			<p>
				Sorry there are no flights for this trip yet. Select another date or try
				again later
			</p>
		</main>
	);
}

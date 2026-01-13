import Input from "../global/Input";
import Search from "@/assets/trip/Search.svg";

export default function TripSearch({ onChange }) {
	return (
		<form className="flex justify-center items-center space-x-2">
			<Input
				placeholder="Search trip..."
				className="border-2 border-[var(--adeona-blue-300)] w-full md:w-[500px] h-[40px] md:text-lg"
				onChange={onChange}
			/>
			<button type="button">
				<Search
					width={40}
					height={40}
				/>
			</button>
		</form>
	);
}

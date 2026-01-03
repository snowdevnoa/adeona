import Sunrise from "../flight/Sunrise";

export default function Header({ title }) {
	return (
		<header className="flex justify-center items-center w-full h-[121px] md:h-[121px]">
			<Sunrise className="absolute top-0" />
			<h1 className="text-4xl font-bold z-1 mt-8">{title}</h1>
		</header>
	);
}

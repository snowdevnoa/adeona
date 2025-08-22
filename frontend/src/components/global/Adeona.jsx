import Logo from "./Logo";
export default function Adeona() {
	return (
		<header className="flex flex-col justify-center items-center">
			<Logo size={75}/>
			<h1 className="text-6xl font-bold my-[0.5rem]">
				<span className="text-[var(--adeona-blue-900)]">ade</span>
				<span className="lg:text-[var(--cosmic-latte-200)]">ona</span>
			</h1>
			<h2 className="text-xl font-medium">your travel companion</h2>
		</header>
	);
}

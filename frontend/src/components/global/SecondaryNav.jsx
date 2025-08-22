"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Airplane from "@/assets/Airplane.svg";
import Bookmark from "@/assets/Bookmark.svg";
import Profile from "@/assets/Profile.svg";

export default function SecondaryNav() {
	const pathname = usePathname();
	return (
		<nav className="absolute bottom-0 w-full bg-[var(--cosmic-latte-200)] min-h-[5rem] flex justify-center items-center">
			<Link
				href="/profile"
				className={`link ${
					pathname === "/profile" ? "border-b-[3px]" : ""
				} font-bold mx-[2rem] md:mx-[4rem] py-[0.5rem] flex flex-col items-center hover:border-b-[3px]`}
			>
				<p>Profile</p>
				<Profile />
			</Link>
			<Link
				href="/"
				className={`link ${
					pathname === "/" ? "border-b-[3px]" : ""
				} font-bold mx-[2rem] md:mx-[4rem] py-[0.5rem] flex flex-col items-center hover:border-b-[3px]`}
			>
				<p>Flights</p>
				<Airplane />
			</Link>
			<Link
				href="/"
				className={`link ${
					pathname === "/saved" ? "border-b-[3px]" : ""
				} font-bold mx-[2rem] md:mx-[4rem] py-[0.5rem] flex flex-col items-center hover:border-b-[3px]`}
			>
				<p>Saved</p>
				<Bookmark />
			</Link>
		</nav>
	);
}

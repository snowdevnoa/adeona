"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Airplane from "@/assets/flight/Airplane.svg";
import Bookmark from "@/assets/global/Bookmark.svg";
import Profile from "@/assets/global/Profile.svg";

export default function SecondaryNav() {
	const pathname = usePathname();
	return (
		<nav className="sticky bottom-0 w-full bg-[var(--cosmic-latte-200)] min-h-[5rem] flex justify-center items-center">
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
				href="/trips"
				className={`link ${
					pathname === "/trips" ? "border-b-[3px]" : ""
				} font-bold mx-[2rem] md:mx-[4rem] py-[0.5rem] flex flex-col items-center hover:border-b-[3px]`}
			>
				<p>Trips</p>
				<Bookmark />
			</Link>
		</nav>
	);
}

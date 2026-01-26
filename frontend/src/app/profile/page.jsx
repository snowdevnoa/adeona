"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainNav from "@/components/global/MainNav";
import SecondaryNav from "@/components/global/SecondaryNav";

export default function Profile() {
	const [userProfile, setUserProfile] = useState(null);
	const router = useRouter();

	async function getProfile() {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
			{
				method: "GET",
				credentials: "include", // allow client request to include cookies
			}
		);

		if (!res.ok) {
			const message = await res.json();
			console.log(message.error);
		} else {
			const profile = await res.json();
			return profile;
		}
	}

	async function logout() {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/users/logout`,
			{
				method: "POST",
				credentials: "include", // allow client request to include cookies
			}
		);

		if (!res.ok) {
			const message = await res.json();
			console.log(message.error);
		} else {
			const user = await res.json();
			console.log(user.success);
			setUserProfile(null);
		}
	}

	useEffect(() => {
		(async () => {
			const profile = await getProfile();
			setUserProfile(profile);
		})();
	}, []);

	return userProfile ? (
		<>
			<MainNav />

			<h1>Profile Page</h1>
			<h2>Hello there! {userProfile.username}</h2>
			<button
				type="button"
				onClick={logout}
			>
				Log out
			</button>
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

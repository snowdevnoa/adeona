"use client";
import { useEffect, useState } from "react";
import SplashScreen from "@/components/SplashScreen";

export default function Register() {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(()=>{
	    setTimeout(()=>{
	        setIsLoading(false)
	    }, 4000)

	},[])

	return isLoading ? (
		<SplashScreen />
	) : (
		<main>
			<h2 className="text-xl font-medium mt-[1rem]">your travel companion</h2>
			<p>Register page</p>
		</main>
	);
}

"use client";
import { useEffect, useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import PageWrapper from "@/components/PageWrapper";
import RegisterForm from "@/components/user/RegisterForm";
import Header from "@/components/Header";
import { motion } from "motion/react";

// Appear animation
const fadeAppear = {
	opacity: [0, 100],
	scale: [0.5, 1],
	transition: { duration: 1.25, type: "tween", ease: "circInOut" },
};

export default function Register() {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, 4000);
	}, []);

	return isLoading ? (
		<SplashScreen />
	) : (
		<PageWrapper className="bg-[var(--cosmic-latte-200)] items-center justify-center min-h-screen  lg:flex-row">
			<motion.div
				className="lg:bg-[url(/backgrounds/james-donaldson-toPRrcyAIUY-unsplash.jpg)] lg:min-h-screen lg:flex-1 bg-cover bg-center lg:flex lg:justify-center lg:items-center"
			>
				<Header />
			</motion.div>

			<motion.div
				className="lg:flex-1 flex justify-center items-center px-[1rem] lg:px-[5rem]"
				animate={fadeAppear}
			>
				<RegisterForm />
			</motion.div>
		</PageWrapper>
	);
}

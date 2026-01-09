"use client";
import { useState } from "react";
import Form from "next/form";
import { useRouter } from "next/navigation";
import Input from "@/components/global/Input";
import MainButton from "../global/MainButton";
import SecondaryButton from "@/components/global/SecondaryButton";
import { motion } from "motion/react";

// Dot shuttle animation
const dotShuttle = {
	rotate: 360,
	x: [-100, 100, -100],
	background: [
		"var(--adeona-blue-900)",
		"var(--cosmic-latte-400)",
		"var(--adeona-blue-900)",
	],
	transition: {
		duration: 2,
		repeat: Infinity,
		repeatDelay: 0.2,
		ease: "easeInOut",
	},
};

export default function LoginForm() {
	const [formComplete, setFormComplete] = useState(false);
	const [message, setMessage] = useState(null);
	const router = useRouter();

	async function login(e) {
		e.preventDefault();

		const formData = new FormData(e.target);

		const rawFormData = {
			username: formData.get("username"),
			password: formData.get("password"),
		};

		// Verify login information to database
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_DEV_API_URL}/users/login`,
			{
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(rawFormData),
			}
		);

		const user = await res.json();
		console.log(user);

		// If bad response, display error
		if (!res.ok) {
			console.log(res.error);
			setMessage(user.error);
		} else {
			// Store JWT token in http
			setMessage(user.message);
			setFormComplete(true);
			setTimeout(() => {
				router.push("/");
			}, 3000);
		}
	}

	return formComplete ? (
		<div className="flex flex-col justify-center items-center">
			<h1 className="font-bold text-2xl mt-[1rem]">{message}</h1>
			<h2>Taking you to the home page...</h2>

			<div className="flex mt-[2rem]">
				<motion.div
					className="w-[50px] h-[50px] rounded-2xl "
					animate={dotShuttle}
				/>
				<motion.div
					className="w-[50px] h-[50px] rounded-2xl  mx-[1rem]"
					animate={dotShuttle}
				/>
				<motion.div
					className="w-[50px] h-[50px] rounded-2xl "
					animate={dotShuttle}
				/>
			</div>
		</div>
	) : (
		<Form
			onSubmit={login}
			className="flex flex-col w-[311px] mt-[1.5rem] md:w-[624px] lg:w-[630px] lg:mt-[0] space-y-4"
		>
			<Input
				label="Username"
				name="username"
				type="text"
				id="username"
				required
			/>
			<Input
				label="Password"
				name="password"
				type="password"
				id="password"
				required
			/>
			<MainButton
				type="submit"
				className="mt-[0.5rem] md:mt-[1.5rem]"
			>
				log in
			</MainButton>
			{message && (
				<p className="text-[var(--error-400)] mt-[1rem] md:text-xl">
					{message}
				</p>
			)}
			<div className="flex items-center justify-between mt-[2rem] md:justify-evenly">
				<SecondaryButton
					type="button"
					onClick={() => {
						router.push("/register");
					}}
				>
					sign up
				</SecondaryButton>
				<p>or</p>
				<p
					className="underline font-bold hover:cursor-pointer hover:text-[var(--adeona-blue-500)]"
					onClick={() => {
						router.push("/");
					}}
				>
					continue as Guest
				</p>
			</div>
		</Form>
	);
}

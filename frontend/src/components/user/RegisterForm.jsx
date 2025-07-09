"use client";
import Form from "next/form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../global/Input";
import MainButton from "../global/MainButton";
import SecondaryButton from "../global/SecondaryButton";
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

export default function RegisterForm() {
	const [formComplete, setFormComplete] = useState(false);
	const [message, setMessage] = useState(null);
	const router = useRouter();

	async function register(e) {
		e.preventDefault();
		const formData = new FormData(e.target);
		// Verify both password inputs match
		try {
			if (formData.get("password") !== formData.get("confirmpass"))
				throw new Error("Passwords do not match. Please re-enter password.");

			// continue registration

			const rawFormData = {
				username: formData.get("username"),
				email: formData.get("email"),
				password: formData.get("password"),
			};

			const res = await fetch(
				`${process.env.NEXT_PUBLIC_DEV_API_URL}/users/register`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(rawFormData),
				}
			);

			const user = await res.json();
			// Check if response was good or not

			if (!res.ok) {
				// Display error on page
				console.log(user.error);
				setMessage(user.error);
			} else {
				// Change state to successful UI to please log in
				setTimeout(() => {
					router.push("/login");
				}, 3000);
				console.log(user.success);
				setFormComplete(true);
				setMessage(user.success);
			}
		} catch (err) {
			console.log(err);
			setMessage(err.message);
		}
	}

	return formComplete ? (
		<div className="flex flex-col justify-center items-center">
			<h1 className="font-bold text-2xl mt-[1rem]">{message}</h1>
			<h2>Taking you to the login page...</h2>

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
			onSubmit={register}
			className="flex flex-col w-[311px] mt-[1.5rem] md:w-[624px] lg:w-[630px] lg:mt-[0]"
		>
			<Input
				label="Username"
				name="username"
				type="text"
				id="username"
				required
			/>

			<Input
				label="Email"
				name="email"
				type="email"
				id="email"
				required
			/>
			<Input
				label="Password"
				name="password"
				type="password"
				id="password"
				required
			/>

			<Input
				label="Confirm Password"
				name="confirmpass"
				type="password"
				id="confirmpass"
				required
			/>
			<MainButton
				type="submit"
				className="mt-[0.5rem] md:mt-[1.5rem]"
			>
				let's get started!
			</MainButton>
			<p className="text-[var(--error-400)] mt-[1rem] md:text-xl">{message}</p>
			<div className="flex items-center justify-between mt-[2rem] md:justify-evenly">
				<SecondaryButton
					type="button"
					onClick={() => {
						router.push("/login");
					}}
				>
					log in
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

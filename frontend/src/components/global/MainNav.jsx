"use client";
import { useState, useEffect } from "react";
import Logo from "./Logo";
import Link from "next/link";
import ArrowReturn from "@/assets/ArrowReturn.svg";
import { motion, AnimatePresence } from "motion/react";

const MotionArrow = motion.create(ArrowReturn);

// Shaking animation
const shake = {
	rotate: [-10, 10, -10, 10, 0],
	fill: "black",
	transition: { duration: 0.4, ease: "easeInOut" },
};

export default function MainNav() {
	const [visible, setVisible] = useState(false);

	function toggleNav() {
		setVisible((prev) => !prev);
	}

	return (
		<AnimatePresence>
			{visible ? (
				<motion.nav
					className="absolute top-0 right-0 flex flex-col items-center h-full bg-[var(--adeona-blue-900)] w-[124px] text-[var(--cosmic-latte-400)] z-1"
					key="main-nav"
					initial={{ x: -100, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					exit={{ x: -100, opacity: 0 }}
					transition={{ ease: "easeInOut", duration: 0.3 }}
				>
					<div className="w-full h-[125px] bg-[var(--cosmic-latte-200)] flex flex-col justify-center items-center">
						<Logo onClick={toggleNav} size={60}/>
						<h1 className="text-[var(--adeona-blue-900)] text-2xl font-bold mt-[0.5rem]">
							adeona
						</h1>
					</div>
					<div className="h-full flex flex-col items-center justify-evenly">
						<Link
							href="/"
							className="py-[0.5rem] px-[1rem] font-bold rounded-4xl hover:text-[var(--adeona-blue-900)] hover:bg-[var(--cosmic-latte-300)] overflow-hidden"
						>
							Home
						</Link>
						<Link
							href="/"
							className="py-[0.5rem] px-[1rem] font-bold rounded-4xl hover:text-[var(--adeona-blue-900)] hover:bg-[var(--cosmic-latte-300)]"
						>
							About
						</Link>
						<a
							href="https://snowdevnoa.github.io/Portfolio/"
							target="_blank"
							rel="noopener noreferrer"
							className="py-[0.5rem] px-[1rem] font-bold rounded-4xl hover:text-[var(--adeona-blue-900)] hover:bg-[var(--cosmic-latte-300)]"
						>
							Contact
						</a>
						<MotionArrow
							width={31}
							height={31}
							className="stroke-current text-white hover:cursor-pointer"
							onClick={toggleNav}
							whileHover={shake}
						/>
					</div>
				</motion.nav>
			) : (
				<Logo
					onClick={toggleNav}
					size={60}
					className="absolute top-0 right-[10px] mr-[1rem] mt-[1rem] z-5 hover:cursor-pointer"
					animate={{ opacity: [0, 1] }}
					whileHover={{
						rotate: [0, 360],
						transition: { duration: 0.8, ease: "circOut", repeat: 0 },
					}}
				/>
			)}
		</AnimatePresence>
	);
}

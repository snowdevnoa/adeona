import Logo from "./Logo";
import { motion } from "motion/react";

// Wave animation
const text = {
	visible: {
		transition: {
			staggerChildren: 0.3,
		},
	},
};

const letter = {
	visible: {
		y: [0, -20, 0],
		color: [
			"var(--adeona-blue-900)",
			"var(--cosmic-latte-400)",
			"var(--adeona-blue-900)",
		],
		transition: {
			duration: 2,
			repeat: Infinity,
			ease: "easeInOut",
		},
	},
};

const adeona = ["a", "d", "e", "o", "n", "a"];

export default function SplashScreen() {
	return (
		<main
			className="bg-[url(/backgrounds/james-donaldson-toPRrcyAIUY-unsplash.jpg)] bg-cover bg-center
		h-dvh flex flex-col justify-center items-center"
		>
			<Logo />

			<motion.h1
				className="text-6xl font-bold mt-[1rem] flex row"
				variants={text} // this has `staggerChildren`
				initial="hidden"
				animate="visible"
			>
				{adeona.map((char, index) => (
					<motion.span
						key={index}
						className="text-(--adeona-blue-900)"
						variants={letter}
					>
						{char}
					</motion.span>
				))}
			</motion.h1>
		</main>
	);
}

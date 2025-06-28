import { motion } from "motion/react";
// Scale and color animation
const hoverPulse = {
	scale: 1.1,
	backgroundColor: "black",
	color:'white'
};

export default function Secondary({ type, onClick, className, children }) {
	return (
		<motion.button
			type={type}
			onClick={onClick}
			className={
				`${className} bg-white py-[0.5rem] px-[1.5rem] font-bold text-lg rounded-2xl hover:cursor-pointer`
			}
			whileHover={hoverPulse}
		>
			{children}
		</motion.button>
	);
}

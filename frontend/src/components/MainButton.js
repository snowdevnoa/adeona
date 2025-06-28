import { motion } from "motion/react";
// Scale and color animation
const hoverPulse = {
	scale: 1.1,
	backgroundColor: 'var(--adeona-blue-600)',
};

export default function MainButton({ type, onClick, className, children }) {
	return (
		<motion.button
			type={type}
			onClick={onClick}
			className={`${className} bg-[var(--adeona-blue-900)] py-[0.5rem] text-white font-bold text-lg rounded-2xl md:text-xl md:rounded-3xl md:py-[1rem] hover:cursor-pointer`}
			whileHover={hoverPulse}
		>
			{children}
		</motion.button>
	);
}

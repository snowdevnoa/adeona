import Image from "next/image";
import { motion } from "motion/react";

const MotionImage = motion.create(Image);

export default function Logo({
	onClick,
	className = "",
	animate,
	whileHover,
	size,
}) {
	return (
		<MotionImage
			src="/ross-parmly-rf6ywHVkrlY-unsplash.jpg"
			alt="plane in the sky"
			width={size}
			height={size}
			className={`rounded-full object-cover ${className}`}
			priority
			onClick={onClick}
			animate={animate}
			whileHover={whileHover}
			// Inline better for size rather than tailwindcss
			style={{
				width: `${size}px`,
				height: `${size}px`,
			}}
		/>
	);
}

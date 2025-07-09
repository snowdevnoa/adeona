import Image from "next/image";
import { motion } from "motion/react";

const MotionImage = motion.create(Image);

export default function Logo({ onClick, className, animate, whileHover }) {
	return (
		<MotionImage
			src="/ross-parmly-rf6ywHVkrlY-unsplash.jpg"
			alt="plane in the sky"
			width={75}
			height={75}
			className={`rounded-full object-cover h-[75px] ${className}`}
			priority
			onClick={onClick}
			animate={animate}
			whileHover={whileHover}
		/>
	);
}

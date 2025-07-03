import Image from "next/image";

export default function Logo() {
	return (
		<Image
			src="/ross-parmly-rf6ywHVkrlY-unsplash.jpg"
			alt="plane in the sky"
			width={75}
			height={75}
			className="rounded-full object-cover h-[75px]"
			priority
		/>
	);
}

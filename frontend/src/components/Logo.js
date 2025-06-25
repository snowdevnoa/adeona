import Image from "next/image";

export default function Logo() {
	return (
		<Image
			src="/ross-parmly-rf6ywHVkrlY-unsplash.jpg"
			alt="plane in the sky"
			width={100}
			height={100}
			className="rounded-full object-cover h-[100px]"
		/>
	);
}

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TripSuccess({ message, onComplete }) {
	const router = useRouter();

	useEffect(() => {
		setTimeout(() => {
			console.log("This should appear after 5 seconds");
			console.log(onComplete);
			onComplete();
		}, 5000);
	}, []);

	return (
		<>
			<p>{message}</p>
		</>
	);
}

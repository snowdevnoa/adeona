import Link from "next/link";
import MainNav from "@/components/global/MainNav";
import SecondaryNav from "@/components/global/SecondaryNav";
import Header from "@/components/flight/Header";
import { QueryClient } from "@tanstack/react-query";
export default async function Page() {

	const queryClient = new QueryClient();

	return (
		<main>
			<MainNav />
			<Header />
			<SecondaryNav />
		</main>
	);
}

// /* Test CORS setup from client component */
// "use client";
// import { useEffect } from "react";

// export default function Page() {
//   useEffect(() => {
//     fetch(`${process.env.NEXT_PUBLIC_DEV_API_URL}/tests`)
//       .then(res => res.json())
//       .then(data => console.log(data))
//       .catch(err => console.error("CORS error:", err));
//   }, []);

//   return <div>Check console for response</div>;
// }

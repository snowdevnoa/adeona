import Link from "next/link";

export default async function Page() {
	const message = await fetch(`${process.env.DEV_SERVER_URL}/tests`);
	const message_text = await message.json();

	return (
		<main>
			<h1 className="text-3xl font-bold">Hello world! no</h1>
			<a className="underline decoration-indigo-500">{message_text.message}</a>
			<Link href="/register">Register</Link>
			<Link href="/login">Login</Link>
		</main>
	);
}

// /* Test CORS setup from client component */
// "use client";
// import { useEffect } from "react";

// export default function Page() {
//   useEffect(() => {
//     fetch(`${process.env.NEXT_PUBLIC_DEV_CLIENT_URL}/tests`)
//       .then(res => res.json())
//       .then(data => console.log(data))
//       .catch(err => console.error("CORS error:", err));
//   }, []);

//   return <div>Check console for response</div>;
// }

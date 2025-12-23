import "../styles/globals.css";
import { Urbanist } from "next/font/google";

const urbanist = Urbanist({ subsets: ["latin"] });

export default function RootLayout({ children }) {
	return (
		<html
			lang="en"
			className={`${urbanist.className}`}
		>
			<body className="min-h-screen flex flex-col">{children}</body>
		</html>
	);
}

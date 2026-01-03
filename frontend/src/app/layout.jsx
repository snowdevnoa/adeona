import "../styles/globals.css";
import { Urbanist } from "next/font/google";
import Provider from "./provider";

const urbanist = Urbanist({ subsets: ["latin"] });

export default function RootLayout({ children }) {
	return (
		<html
			lang="en"
			className={`${urbanist.className}`}
		>
			<body className="min-h-screen flex flex-col">
				<Provider>{children}</Provider>
			</body>
		</html>
	);
}

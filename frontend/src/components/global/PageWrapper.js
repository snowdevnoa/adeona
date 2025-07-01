export default function PageWrapper({ children, className = "" }) {
	return (
		<main className={`flex flex-col w-full  ${className}`}>
			{children}
		</main>
	);
}

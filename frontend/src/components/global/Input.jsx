export default function Input({ label, name, type, id, required = false }) {
	return (
		<div className="flex flex-col mb-[1.5rem]">
			<label
				htmlFor={id}
				className="text-lg mb-[0.5rem] font-bold"
			>
				{label}
			</label>
			<input
				type={type}
				name={name}
				id={id}
				required={required}
				className="bg-white rounded-2xl p-[0.5rem] text-base md:rounded-4xl md:p-[1rem]"
			/>
		</div>
	);
}

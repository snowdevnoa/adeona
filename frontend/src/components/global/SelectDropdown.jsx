export default function SelectDropdown({ label, name, values, onChange, ref }) {
	function normalizeDisplay(word) {
		const newStr = word.replace(/_/g, " ");
		return newStr.toLowerCase();
	}

	return (
		<>
			<label
				htmlFor={label}
				className="hidden"
			>
				{label}
			</label>
			<select
				id={name}
				name={name}
				onChange={onChange}
				ref={ref}
			>
				{values.map((option) => (
					<option
						key={option}
						value={option}
					>
						{typeof option === "string" ? normalizeDisplay(option) : option}
					</option>
				))}
			</select>
		</>
	);
}

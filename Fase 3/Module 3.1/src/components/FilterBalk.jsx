const FILTERS = [
	{ waarde: "all", label: "All" },
	{ waarde: "HTML", label: "HTML" },
	{ waarde: "CSS", label: "CSS" },
	{ waarde: "JavaScript", label: "JavaScript" },
	{ waarde: "React", label: "React" },
];

function FilterBalk({ actief, onFilterWijziging }) {
	return (
		<div className="filter-bar" role="group" aria-label="Filter projecten">
			{FILTERS.map((filter) => (
				<button
					key={filter.waarde}
					className={`filter-btn${actief === filter.waarde ? " filter-btn--active" : ""}`}
					onClick={() => onFilterWijziging(filter.waarde)}
					aria-pressed={actief === filter.waarde}
				>
					{filter.label}
				</button>
			))}
		</div>
	);
}

export default FilterBalk;

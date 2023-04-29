function OccasionSelect({ occasions, selectedOccasion, setSelectedOccasion }) {
	return (
		<div className="is-flex is-justify-content-flex-end mb-4">
			<p>Filter by Occasion</p>
			<div className="select ml-2">
				<select
					value={selectedOccasion}
					onChange={(e) => setSelectedOccasion(e.target.value)}
				>
					{occasions.map((occasion) => (
						<option key={occasion} value={occasion}>
							{occasion}
						</option>
					))}
				</select>
			</div>
		</div>
	);
}

export default OccasionSelect;

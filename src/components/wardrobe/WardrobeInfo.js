import { useEffect, useState } from "react";
import WardrobeUsedIn from "./WardrobeUsedIn";

function WardrobeInfo({ item }) {
	const [date, setDate] = useState("");

	useEffect(() => {
		const date = new Date(item.dateAdded);
		const formattedDate = date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
		setDate(formattedDate);
	}, [item]);

	return (
		<div>
			<h2 className="title is-2 is-underlined">Info</h2>
			<p className="is-size-4-mobile is-size-3">
				<span className="is-italic">Clothing Type:</span> {item.type}
			</p>
			<p className="is-size-4-mobile is-size-3">
				<span className="is-italic">Occasion:</span> {item.occasion}
			</p>
			<p className="is-size-4-mobile is-size-3">
				<span className="is-italic">Added On:</span> {date}
			</p>
			<h2 className="title is-3 mt-2">Used In:</h2>
			<WardrobeUsedIn id={item._id} />
		</div>
	);
}

export default WardrobeInfo;

import WardrobeUsedIn from "./WardrobeUsedIn";

function WardrobeInfo({ item }) {
	return (
		<div>
			<h2 className="title is-2">Info:</h2>
			<p className="is-size-4-mobile is-size-3">
				<span className="is-italic">Clothing Type:</span> {item.type}
			</p>
			<p className="is-size-4-mobile is-size-3">
				<span className="is-italic">Occasion:</span> {item.occasion}
			</p>
			<p className="is-size-4-mobile is-size-3">
				<span className="is-italic">Added On:</span> {item.dateAdded}
			</p>
			<h2 className="title is-3 mt-2">Used In:</h2>
			<WardrobeUsedIn id={item._id} />
		</div>
	);
}

export default WardrobeInfo;

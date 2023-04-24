import useSWR from "swr";
import OutfitCard from "./OutfitCard";

/*
 * A component that will return a grid of cards that show the
 * outfits that use this wardrobe item.
 */
function WardrobeUsedIn({ id }) {
	const { data, error } = useSWR(
		`${process.env.NEXT_PUBLIC_API_URL}/outfits?contains=${id}`
	);

	if (!data) return <div>Loading...</div>;

	return (
		<section>
			<div className="columns is-multiline">
				{data.map((outfit) => (
					<div className="column is-one-quarter">
						<OutfitCard outfit={outfit} />
					</div>
				))}
				{data.length > 0 ? null : (
					<div className="column is-full">
						No outfits use this item.
					</div>
				)}
			</div>
		</section>
	);
}

export default WardrobeUsedIn;

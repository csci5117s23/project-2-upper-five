import useSWR from "swr";
import OutfitCard from "./OutfitCard";
import Loading from "../Loading";

/*
 * A component that will return a grid of cards that show the
 * outfits that use this wardrobe item.
 */
function WardrobeUsedIn({ id }) {
	const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/outfits?contains=${id}`);

	if (!data) return <Loading />;

	return (
		<section>
			<div className="columns is-mobile is-multiline">
				{data.map((outfit) => (
					<div key={outfit._id} className="column is-half-mobile is-one-third-tablet">
						<OutfitCard outfit={outfit} />
					</div>
				))}
				{data.length > 0 ? null : (
					<div className="column is-full">No outfits use this item.</div>
				)}
			</div>
		</section>
	);
}

export default WardrobeUsedIn;

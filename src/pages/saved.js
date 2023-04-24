import PageDetails from "@/components/PageDetails";
import withAuth from "@/components/hoc/withAuth";
import { useEffect, useState } from "react";
import SavedItem from "@/components/SavedItem";
import { fetcher, tokenFetcher, imageFetcher } from "@/modules/fetcher";

function SavedPage() {
	const [outfit, setOutfit] = useState([]);

	async function getOutfit() {
		const outfiturl = process.env.NEXT_PUBLIC_API_URL + "/outfit";
		const token = await getToken({ template: 'codehooks' });
		const res = await tokenFetcher(outfiturl, token); 
		return res; 
	}

	useEffect(() => {
		// get all the outfits from the database for that user
		const all_outfit = getOutfit();
		setOutfit(all_outfit);
	}, [outfit]); 

	return (
		<>
			<PageDetails
				title="Clothing Tracker Saved Outfits"
				description="This is the homepage for our clothing tracker app."
			/>
			<div className="section pt-4">
				<h1 className="title is-1">Saved Page</h1>
			</div>
			<div>
				{outfit.map((item) => {
					<SavedItem item={item}/>
				})}
			</div>
		</>
	);
}

export default withAuth(SavedPage);

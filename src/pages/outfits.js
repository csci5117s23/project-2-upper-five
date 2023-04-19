import PageDetails from "@/components/PageDetails";
import ListCarousel from "@/components/carousel/ListCarousel";
import withAuth from "@/components/hoc/withAuth";
import { useState } from "react";

function OutfitsPage() {
	const [displayOutfit, setDisplayOutfit] = useState(true);
	const [typeList,setTypeList ]= useState(["top", "bottom","shoes"]);
	return (
		<>
			<PageDetails
				title="Clothing Tracker Create Outfit"
				description="This is the homepage for our clothing tracker app."
			/>
			<div className="section pt-4">
				<h1 className="title is-1">Outfits Page</h1>
				<div className="field">
					<p className="control">
						<button className="button is-success" onClick={()=> setDisplayOutfit(!displayOutfit)}>
							Customize Outfit
						</button>
					</p>
				</div>
				{ displayOutfit && <ListCarousel typeList={typeList}></ListCarousel>}
				{/* { !displayOutfit && <Customize typeList={typeList}></Customize>} */}
			</div>
		</>
	);
}

export default withAuth(OutfitsPage);

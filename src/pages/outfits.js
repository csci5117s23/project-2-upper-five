import PageDetails from "@/components/PageDetails";
import ListCarousel from "@/components/carousel/ListCarousel";
import withAuth from "@/components/hoc/withAuth";
import { useState } from "react";
import Customize from "@/components/customize/Customize";

function OutfitsPage() {
	const [displayOutfit, setDisplayOutfit] = useState(true);
	const [typeList, setTypeList] = useState(["Tops", "Bottoms", "Shoes"]);
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
						{/* <button className="button is-success" onClick={ 
							function() {
								setDisplayOutfit(!displayOutfit)
								displayOutfit && setTypeList([]) //clear type list when clicking the button before rendering carousels
							}
						}>
							Customize Outfit
						</button> */}
					</p>
				</div>
				{displayOutfit && (
					<>
						<button
							className="button is-success"
							onClick={function () {
								setDisplayOutfit(!displayOutfit);
								displayOutfit && setTypeList([]); //clear type list when clicking the button before rendering carousels
							}}
						>
							Customize Outfit
						</button>
						<ListCarousel typeList={typeList}></ListCarousel>
					</>
				)}
				{!displayOutfit && (
					<>
						<Customize typeList={typeList} setTypeList={setTypeList} />
						<button
							className="button is-success is-light"
							onClick={function () {
								setDisplayOutfit(!displayOutfit);
								displayOutfit && setTypeList([]); //clear type list when clicking the button before rendering carousels
							}}
						>
							Show Outfit
						</button>
					</>
				)}
			</div>
		</>
	);
}

export default withAuth(OutfitsPage);

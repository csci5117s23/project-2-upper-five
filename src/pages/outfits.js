import PageDetails from "@/components/PageDetails";
import ListCarousel from "@/components/carousel/ListCarousel";
import withAuth from "@/components/hoc/withAuth";
import { useState } from "react";
import Customize from "@/components/customize/Customize";
import * as styles from "./outfits.module.scss";

function OutfitsPage({ token }) {
	const [displayOutfit, setDisplayOutfit] = useState(true);
	const [typeList, setTypeList] = useState(["Tops", "Bottoms", "Shoes"]);
	return (
		<>
			<PageDetails
				title="Clothing Tracker Create Outfit"
				description="This is the homepage for our clothing tracker app."
			/>
			<div className={`section pt-4`}>
				<div className={`${styles.container}`}>
					<h1 className={`title is-1 ${styles.containerItem}`}>Outfits Page</h1>
					<div className={`field ${styles.containerItem}`}>
						<p className="control">
							<button
								className={`button is-primary is-responsive"`}
								onClick={function () {
									setDisplayOutfit(!displayOutfit);
									displayOutfit && setTypeList([]); //clear type list when clicking the button before rendering carousels
								}}
							>
								Customize Outfit
							</button>
						</p>
					</div>
				</div>

				{displayOutfit && <ListCarousel token={token} typeList={typeList}></ListCarousel>}
				{!displayOutfit && (
					<Customize typeList={typeList} setTypeList={setTypeList}></Customize>
				)}
			</div>
		</>
	);
}

export default withAuth(OutfitsPage);

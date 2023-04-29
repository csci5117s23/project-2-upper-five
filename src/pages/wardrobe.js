import OccasionSelect from "@/components/OccasionSelect";
import Loading from "@/components/Loading";
import Notification from "@/components/Notification";
import PageDetails from "@/components/PageDetails";
import withAuth from "@/components/hoc/withAuth";
import WardrobeCard from "@/components/wardrobe/WardrobeCard";
import clothingCategoryData from "@/data/clothingCategories";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

function WardrobePage() {
	const router = useRouter();
	const [clothingCategories, setClothingCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("All");

	const [occasions, setOccasions] = useState([]);
	const [selectedOccasion, setSelectedOccasion] = useState("All");

	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [showDeletedMessage, setShowDeletedMessage] = useState(false);
	const [deletedItem, setDeletedItem] = useState("");

	let dataUrl = `${process.env.NEXT_PUBLIC_API_URL}/items`;
	if (selectedCategory !== "All") {
		dataUrl = `${dataUrl}?type=${selectedCategory}`;

		if (selectedOccasion !== "All") {
			dataUrl = `${dataUrl}&occasion=${selectedOccasion}`;
		}
	} else if (selectedOccasion !== "All") {
		dataUrl = `${dataUrl}?occasion=${selectedOccasion}`;
	}

	const { data, error } = useSWR(dataUrl);

	useEffect(() => {
		async function process() {
			if (router.query.success) {
				setShowSuccessMessage(true);
				await new Promise((resolve) => setTimeout(resolve, 9000));
				setShowSuccessMessage(false);
				// router.push("/wardrobe");
			} else if (router.query.deleted) {
				setShowDeletedMessage(true);
				setDeletedItem(router.query.name);
				await new Promise((resolve) => setTimeout(resolve, 9000));
				setShowDeletedMessage(false);
				setDeletedItem("");
				// router.push("/wardrobe");
			}
		}

		process();
	}, [router]);

	useEffect(() => {
		let tempCategories = ["All"];
		tempCategories = tempCategories.concat(clothingCategoryData.categories);
		setClothingCategories(tempCategories);

		let tempOccasions = ["All"];
		tempOccasions = tempOccasions.concat(clothingCategoryData.occasions);
		setOccasions(tempOccasions);
	}, []);

	if (!data) return <Loading isPage={true} hasError={error} />;

	return (
		<>
			<PageDetails
				title="Clothing Tracker Wardrobe"
				description="This is the homepage for our clothing tracker app."
			/>
			<div className="tabs">
				<ul>
					{clothingCategories.map((tab) => (
						<li key={tab} className={tab === selectedCategory ? "is-active" : ""}>
							<a onClick={() => setSelectedCategory(tab)}>{tab}</a>
						</li>
					))}
				</ul>
			</div>
			<section className="section pt-0">
				<Notification
					message="Item added successfully!"
					type="is-success"
					show={showSuccessMessage}
					setShow={setShowSuccessMessage}
				/>
				<Notification
					message={`You have just deleted ${deletedItem}, this action can not be undone.`}
					type="is-warning"
					show={showDeletedMessage}
					setShow={setShowDeletedMessage}
				/>
				<OccasionSelect
					occasions={occasions}
					selectedOccasion={selectedOccasion}
					setSelectedOccasion={setSelectedOccasion}
				/>
				<div className="columns is-multiline is-mobile">
					{data && data.map((item) => <WardrobeCard key={item._id} item={item} />)}
					{data && data.length === 0 && (
						<div>
							<p>
								Sorry you don't have any {selectedOccasion} {selectedCategory} in
								your wardrobe.
							</p>
							<p className="mt-4">You can add some here!</p>
							<Link href="/add" className="button is-primary mt-2">
								Add Item
							</Link>
						</div>
					)}
				</div>
			</section>
		</>
	);
}

export default withAuth(WardrobePage);

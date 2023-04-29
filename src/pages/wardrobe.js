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
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [showDeletedMessage, setShowDeletedMessage] = useState(false);
	const [deletedItem, setDeletedItem] = useState("");
	const [clothingCategories, setClothingCategories] = useState([]);

	let dataUrl = `${process.env.NEXT_PUBLIC_API_URL}/items`;
	if (selectedCategory !== "All") {
		dataUrl = `${dataUrl}?type=${selectedCategory}`;
	}
	const { data, error } = useSWR(dataUrl);

	useEffect(() => {
		async function process() {
			if (router.query.success) {
				setShowSuccessMessage(true);
				await new Promise((resolve) => setTimeout(resolve, 9000));
				setShowSuccessMessage(false);
				router.push("/wardrobe");
			} else if (router.query.deleted) {
				setShowDeletedMessage(true);
				setDeletedItem(router.query.name);
				await new Promise((resolve) => setTimeout(resolve, 9000));
				setShowDeletedMessage(false);
				setDeletedItem("");
				router.push("/wardrobe");
			}
		}

		process();
	}, [router]);

	useEffect(() => {
		function process() {
			let temp = ["All"];
			temp = temp.concat(clothingCategoryData.categories);
			setClothingCategories(temp);
		}

		process();
	}, []);

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
			<section className="section">
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
				<div className="columns is-multiline is-mobile">
					{data && data.map((item) => <WardrobeCard key={item._id} item={item} />)}
					{data && data.length === 0 && (
						<div>
							<p>Sorry you don't have any {selectedCategory} in your wardrobe.</p>
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

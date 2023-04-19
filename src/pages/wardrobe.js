import PageDetails from "@/components/PageDetails";
import withAuth from "@/components/hoc/withAuth";
import WardrobeItem from "@/components/wardrobe/WardrobeItem";
import { useState } from "react";
import useSWR from "swr";

function WardrobePage() {
	const tabs = [
		"All",
		"Shirts",
		"Pants",
		"Shoes",
		"Accessories",
		"Glasses",
		"Hats",
	];
	const [selectedCategory, setSelectedCategory] = useState("All");
	/*
	const { data, error } = useSWR(
		`${process.env.NEXT_PUBLIC_API_URL}/wardrobe?category=${selectedCategory}`
	);
	*/

	const testItems = [
		{
			_id: "12345-67890",
			name: "My Red Shirt",
			type: "shirt",
			occasion: "casual",
			own: true,
			downloadUrl:
				"https://f005.backblazeb2.com/file/clothing-tracker/500.png",
		},
		{
			_id: "23456-78901",
			name: "My Red Pants",
			type: "pants",
			occasion: "casual",
			own: true,
			downloadUrl:
				"https://f005.backblazeb2.com/file/clothing-tracker/500.png",
		},
		{
			_id: "34567-89012",
			name: "My Red Shoes",
			type: "shoes",
			occasion: "casual",
			own: true,
			downloadUrl:
				"https://f005.backblazeb2.com/file/clothing-tracker/500.png",
		},
		{
			_id: "45678-90123",
			name: "My Red Hat",
			type: "hat",
			occasion: "casual",
			own: true,
			downloadUrl:
				"https://f005.backblazeb2.com/file/clothing-tracker/500.png",
		},
	];

	return (
		<>
			<PageDetails
				title="Clothing Tracker Wardrobe"
				description="This is the homepage for our clothing tracker app."
			/>
			<div className="tabs">
				<ul>
					{tabs.map((tab) => (
						<li
							key={tab}
							className={
								tab === selectedCategory ? "is-active" : ""
							}
						>
							<a onClick={() => setSelectedCategory(tab)}>
								{tab}
							</a>
						</li>
					))}
				</ul>
			</div>
			<section className="section">
				<div className="columns is-multiline is-mobile">
					{testItems.map((item) => (
						<WardrobeItem key={item._id} item={item} />
					))}
				</div>
			</section>
		</>
	);
}

export default withAuth(WardrobePage);

import { useState, useEffect } from "react";
import ImageCarousel from "./ImageCarousel";
import { postFetcher } from "@/modules/fetcher";
import { useRouter } from "next/router";

import * as styles from "./ListCarousel.module.scss";

export default function ListCarousel({ typeList, token }) {
	const router = useRouter();
	var initStates = {};
	typeList.forEach((type) => {
		initStates[type] = undefined;
	});
	const [indices, setIndices] = useState(initStates);
	const [loading, setLoading] = useState(false);

	function updateItem(key, id) {
		let indicesCopy = { ...indices };
		indicesCopy[key] = id;
		setIndices(() => indicesCopy);
	}

	async function saveOutfit(e) {
		e.preventDefault();
		setLoading(true);
		// first remove outfits from type list that don't have data
		const newTypeList = typeList.filter((type) => {
			if (indices[type] == undefined) {
				const checkNoData = document.getElementById(`noData-${type}`); // if we are displaying "No images in this category"
				if (checkNoData) {
					return false;
				} else {
					return true;
				}
			} else {
				return true;
			}
		});
		// Lets build a POST request
		let items = [];
		let typeOrder = [];
		let outfitName = document.getElementById("outfitName").value;
		newTypeList.forEach((type) => {
			if (indices[type] === undefined) {
				const element_id = document.getElementById(`init-${type}`).innerHTML;
				const img_id = element_id.split("init-")[1];
				items.push(img_id);
				typeOrder.push(type);
			} else {
				items.push(indices[type]);
				typeOrder.push(type);
			}
		});
		const requestBody = {
			userId: "tempVal", // will be updated correctly by middleware
			items: items,
			typeOrder: typeOrder,
			name: outfitName,
		};

		if (typeOrder.length === 0 || items.length === 0) {
			alert("You cannot save outfits until you add wardrobe items");
		} else {
			let response = await postFetcher([
				`${process.env.NEXT_PUBLIC_API_URL}/outfits`,
				token,
				requestBody,
			]);
			router.push("/saved"); // redirect to saved outfit tab
		}
	}

	return (
		<>
			<form onSubmit={saveOutfit}>
				<div className="field">
					<label className="label required">Outfit Name</label>
					<div className="control">
						<input
							className="input"
							type="text"
							id="outfitName"
							maxLength={100}
							required
						></input>
					</div>
				</div>
				{typeList.map((type) => {
					return (
						<ImageCarousel
							key={`imageCarousel-${type}`}
							type={type}
							updateItem={updateItem}
						></ImageCarousel>
					);
				})}
				<div className={`field`}>
					<p className={`control ${styles.containerButton} ${styles.space}`}>
						<button
							type="submit"
							className={`button is-success ${loading ? "is-loading" : ""}`}
						>
							Finish
						</button>
					</p>
				</div>
			</form>
		</>
	);
}

import TestComponent from "@/components/TestComponent";
import withAuth from "@/components/hoc/withAuth";
import { deleteFetcher, fetcher, postFetcher, putFetcher } from "@/modules/fetcher";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import outfits from "./outfits";

function TestPage() {
	const config = useSWRConfig();
	const { isLoaded, userId, sessionId, getToken } = useAuth();
	const [token, setToken] = useState(null);

	// const { data:items, mutate, error } = useSWR(
	// 	`${process.env.NEXT_PUBLIC_API_URL}/items`
	// );

	const { data: outfit, mutate } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/outfits`);

	useEffect(() => {
		async function process() {
			const myToken = await getToken({ template: "codehooks" });
			setToken(myToken);
		}
		process();
	}, [getToken]);
	console.log("Token: " + token);

	const tempItemPost = {
		name: "Test Item",
		imageId:
			"4_z56366cf4b4f64d7483790b1f_f100f8f14ee54279d_d20230419_m002127_c005_v0501005_t0048_u01681863687826",
		type: "Test Shirt",
		occasion: "Test Casual",
		own: true,
		_id: "THIS IS INCORRECT",
		userId: "THIS IS INCORRECT",
	};

	const tempOutfitPost = {
		name: "Test Outfit",
		items: ["Outfit1", "Outfit2"],
		typeOrder: ["Tops", "Bottoms"],
	};

	async function newItemPost() {
		let response = await postFetcher([
			`${process.env.NEXT_PUBLIC_API_URL}/items`,
			token,
			tempItemPost,
		]);
		console.log("Response: " + JSON.stringify(response));

		mutate((prevData) => {
			console.log("Prev Data: " + JSON.stringify(prevData));
			return [...prevData, response];
		});
	}

	async function newOutfitPost() {
		let response = await postFetcher([
			`${process.env.NEXT_PUBLIC_API_URL}/outfits`,
			token,
			tempOutfitPost,
		]);
		console.log("Response: " + JSON.stringify(response));

		mutate((prevData) => {
			console.log("Prev Data: " + JSON.stringify(prevData));
			return [...prevData, response];
		});
	}

	async function updateItem(item) {
		console.log("Updating: " + JSON.stringify(item));

		let response = await putFetcher([
			`${process.env.NEXT_PUBLIC_API_URL}/items/${item._id}`,
			token,
			item,
		]);

		console.log("Update Response: " + JSON.stringify(response));

		mutate((prevData) =>
			prevData.map((prevItem) => {
				if (prevItem._id === item._id) {
					return item;
				}
				return prevItem;
			})
		);
	}

	async function deleteItem(item) {
		console.log("Deleting: " + JSON.stringify(item));
		const response = await deleteFetcher([
			`${process.env.NEXT_PUBLIC_API_URL}/items/${item._id}`,
			token,
		]);
		console.log("Delete Response: " + JSON.stringify(response));

		mutate((prevData) => prevData.filter((prevItem) => prevItem._id !== item._id));
	}

	// useEffect(() => {
	// 	console.log("Got data: " + JSON.stringify(data));
	// }, [data]);

	useEffect(() => {
		console.log("Got data: " + JSON.stringify(outfit));
	}, [outfit]);

	return (
		<div className="section">
			<div className="container">
				<h1 className="title is-2">This Our Test Page</h1>
				<button onClick={newOutfitPost} className="button">
					New Item
				</button>
				{/* {data ? (
					<div>Data found: {data.length}!</div>
				) : (
					<div>No Data</div>
				)} */}
				{/* <div>
					{data ? (
						data.map((item) => (
							<TestComponent
								key={item._id}
								item={item}
								onEdit={updateItem}
								onDelete={deleteItem}
							/>
						))
					) : (
						<div>No Data to Show</div>
					)}
				</div> */}
				<div>
					{outfit ? outfit.map((item) => console.log(item)) : <div>No Data to Show</div>}
				</div>
			</div>
		</div>
	);
}

export default withAuth(TestPage);

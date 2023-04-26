import PageDetails from "@/components/PageDetails";
import withAuth from "@/components/hoc/withAuth";
import { useEffect, useState } from "react";
import SavedItem from "@/components/SavedItem";
import Filter from "@/components/Filter";
import { useAuth } from "@clerk/nextjs";
import useSWR, { useSWRConfig } from "swr";
import Link from "next/link";

function SavedPage() {
	const config = useSWRConfig();
	const { isLoaded, userId, getToken } = useAuth();
	const [token, setToken] = useState(null);
	// state that check if the clothes should be filtered
	const [filter, setFilter] = useState(false);

	useEffect(() => {
		async function process() {
			const myToken = await getToken({ template: "codehooks" });
			setToken(myToken);
		}
		process();
	}, [getToken]);
	console.log("Token: " + token)

	const { data: outfit } = useSWR(
		`${process.env.NEXT_PUBLIC_API_URL}/outfits`
	);
	
	useEffect(() => {
		console.log("Got data: " + JSON.stringify(outfit));
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
			<div>
				<Filter />
			</div>
				<div>
					{outfit ? (
						outfit.map((item) => (
							<SavedItem item={item} />
						))
					) : (
						<div>No Data to Show</div>
					)}
				</div>
			</div>
			
		</>
	);
}

export default withAuth(SavedPage);

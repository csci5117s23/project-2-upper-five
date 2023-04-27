import withAuth from "@/components/hoc/withAuth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";
import { deleteFetcher, imageFetcher, putFetcher, tokenFetcher } from "@/modules/fetcher";
import Image from "next/image";
import PageDetails from "@/components/PageDetails";
import OutfitCard from "@/components/wardrobe/OutfitCard";

function OutfitItemPage({ token }) {
	const router = useRouter();
	const { id } = router.query;
	const [loading] = useState(false);
	const [itemSchema, setItemSchema] = useState(null);

	const { data, mutate, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/outfits/${id}`);

	async function getItemSchema(id) {
		const url = `${process.env.NEXT_PUBLIC_API_URL}/itmes/${id}`;
		const res = await tokenFetcher([url, token]);
		console.log(res);
		return res;
	}

	if (error) return <div>Failed to load</div>;
	if (!data) return <div>Loading...</div>;
	if (loading) return <div>Loading...</div>;

	return (
		<>
			<PageDetails
				title="Clothing Tracker Wardrobe"
				description="This is the homepage for our clothing tracker app."
			/>
			<div className="section">
				<div className="container">
					<h1 className="title is-1">Outfit</h1>
					<div className="outfit-content">
						{data ? (
							<div className="outfit-info">
								<h2 className="title is-2">{data.name}</h2>
								{data.typeOrder.map((type, index) => {
									console.log("Type is " + type);
									return (
										<div key={index}>
											<h1>{type}</h1>
										</div>
									);
								})}
							</div>
						) : (
							console.log("no data")
						)}
						{/* // <div className="box" style={{ width: 500 }}>
                        //     <figure className="image is-1by1">
                        //         {image ? (
                        //             <Image
                        //                 src={image}
                        //                 alt={data.name}
                        //                 width={500}
                        //                 height={500}
                        //             />
                        //         ) : null}
                        //     </figure>
                        // </div> */}
					</div>
				</div>
			</div>
		</>
	);
}

export default withAuth(OutfitItemPage);

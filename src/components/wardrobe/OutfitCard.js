import { createPreviewThumbnail } from "@/modules/imageManip";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import Loading from "../Loading";

function OutfitCard({ outfit }) {
	const [image, setImage] = useState(null);
	const { data: items, error } = useSWR(
		`${process.env.NEXT_PUBLIC_API_URL}/get_items_from_outfit/${outfit._id}`
	);

	useEffect(() => {
		console.log("Items: " + JSON.stringify(items));
		const process = async () => {
			if (items) {
				const itemUrls = items.map((item) => item.downloadUrl);
				const thumbnail = await createPreviewThumbnail(itemUrls.splice(0, 2));
				console.log("Got a thumbnail");
				setImage(thumbnail);
			}
		};
		process();
	}, [items]);

	if (error) return <div>Failed to load</div>;

	if (!items && !image) return <Loading />;

	return (
		<div className="box">
			<Link href={`/outfits/${outfit._id}`}>
				<figure className="image is-1by1">
					{image && <Image src={image} alt={outfit.name} width={100} height={100} />}
				</figure>
				<p>{outfit.name}</p>
			</Link>
		</div>
		// <div className="box">
		// 	<Link href={`/itmes/${outfit._id}`}>
		// 		<figure className="image is-1by1">
		// 			{image && (
		// 				<Image
		// 					src={image}
		// 					alt={outfit.name}
		// 					width={100}
		// 					height={100}
		// 				/>
		// 			)}
		// 		</figure>
		// 		<p>{outfit.name}</p>
		// 	</Link>
		// </div>
	);
}

export default OutfitCard;

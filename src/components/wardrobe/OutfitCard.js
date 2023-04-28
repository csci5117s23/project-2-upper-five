import { createPreviewThumbnail } from "@/modules/imageManip";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";

function OutfitCard({ outfit }) {
	const [image, setImage] = useState(null);
	const { data: items, error } = useSWR(
		`${process.env.NEXT_PUBLIC_API_URL}/get_items_from_outfit/${outfit._id}`
	);

	useEffect(() => {
		async function process() {
			if (items) {
				const itemUrls = items.map((item) => item.downloadUrl);
				const thumbnail = await createPreviewThumbnail(
					itemUrls.splice(0, 2)
				);
				setImage(thumbnail);
			}
		}
		process();
	}, [items]);

	if (error) return <div>failed to load</div>;

	if (!items && !image) return <div>loading...</div>;

	return (
		<div className="box">
			<Link href={`/outfits/${outfit._id}`}>
				<figure className="image is-1by1">
					{image && (
						<Image
							src={image}
							alt={outfit.name}
							width={100}
							height={100}
						/>
					)}
				</figure>
				<p>{outfit.name}</p>
			</Link>
		</div>
	);
}

export default OutfitCard;

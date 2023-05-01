import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faClothesHanger,
	faPencil,
	faEnvelope,
	faShirt,
	faIceSkate,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import useSWR from "swr";
import { createPreviewThumbnail } from "@/modules/imageManip";

function SavedItem({ item }) {
	const [image, setImage] = useState(null);
	const { data: items, error } = useSWR(
		`${process.env.NEXT_PUBLIC_API_URL}/get_items_from_outfit/${item._id}`
	);

	useEffect(() => {
		const process = async () => {
			if (items && items.length > 0) {
				const sortedItems = items.sort((a, b) => {
					const indexA = item.items.indexOf(a._id);
					const indexB = item.items.indexOf(b._id);
					return indexA - indexB;
				});

				const itemUrls = sortedItems.map((item) => item.downloadUrl);
				const thumbnail = await createPreviewThumbnail(itemUrls.splice(0, 2));
				setImage(thumbnail);
			}
		};
		process();
	}, [items]);

	return (
		<Link href={`../outfits/${item._id}`} className="card columns is-mobile">
			<div className="column">
				{image ? <img src={image} width={200} height={200} /> : <Loading />}
			</div>
			<div className="column">
				<div className="content">
					<p className="subtitle is-3">{item.name}</p>
				</div>
			</div>
			<div className="column">
				<div className="button">Go to Outfits</div>
			</div>
		</Link>
	);
}

export default SavedItem;

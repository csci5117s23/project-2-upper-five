import Loading from "@/components/Loading";
import withAuth from "@/components/hoc/withAuth";
import { createSingleOutfitImage } from "@/modules/imageManip";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

function OutfitItemPage({ token }) {
	const router = useRouter();
	const { id } = router.query;
	const [finalImage, setFinalImage] = useState(null);

	const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/outfits/${id}`);
	const { data: items, error: itemsError } = useSWR(
		`${process.env.NEXT_PUBLIC_API_URL}/get_items_from_outfit/${id}`
	);

	useEffect(() => {
		const process = async () => {
			if (items) {
				let urls = items.map((item) => item.downloadUrl);
				let xPositions = items.map((item) => (item.leftPos ? item.leftPos : 0));
				const image = await createSingleOutfitImage(urls, xPositions);
				setFinalImage(image);
			}
		};
		process();
	}, [items]);

	if (!data) return <Loading isPage={true} />;

	return (
		<>
			<div>{data.name}</div>
			{finalImage && <img src={finalImage} />}
		</>
	);
}

export default withAuth(OutfitItemPage);

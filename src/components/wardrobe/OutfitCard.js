import { imageFetcher } from "@/modules/fetcher";
import Image from "next/image";
import Link from "next/link";
import useSWRImmutable from "swr/immutable";

function OutfitCard({ outfit }) {
	const { data: image, error } = useSWRImmutable(
		outfit ? outfit.downloadUrl : null,
		imageFetcher
	);

	return (
		<div className="box">
			<Link href={`/outfits/${outfit.id}`}>
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

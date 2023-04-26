import useSWRImmutable from "swr/immutable";
import { imageFetcher } from "../../modules/fetcher";
import Image from "next/image";
import Link from "next/link";

function WardrobeCard({ item }) {
	const { data, error } = useSWRImmutable(item.downloadUrl, imageFetcher);

	return (
		<div className="column is-full-mobile is-half-tablet is-half-desktop is-one-third-widescreen">
			<div className="card">
				<div className="card-image">
					<figure>
						{data ? (
							<Link href={`/wardrobe/${item._id}`}>
								<Image
									src={data}
									alt={item.name}
									width={500}
									height={500}
								/>
							</Link>
						) : null}
					</figure>
				</div>
				<div className="card-content">
					<div className="content">
						<Link
							href={`/wardrobe/${item._id}`}
							className="title is-3 text-primary"
						>
							{item.name}
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default WardrobeCard;

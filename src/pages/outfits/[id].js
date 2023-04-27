import Loading from "@/components/Loading";
import PageDetails from "@/components/PageDetails";
import withAuth from "@/components/hoc/withAuth";
import { createSingleOutfitImage } from "@/modules/imageManip";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

import * as styles from "./OutfitPage.module.scss";
import WardrobeCard from "@/components/wardrobe/WardrobeCard";
import { deleteFetcher } from "@/modules/fetcher";
import ConfirmModal from "@/components/ConfirmModal";
import IconButton from "@/components/IconButton";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function OutfitItemPage({ token }) {
	const router = useRouter();
	const { id } = router.query;
	const [finalImage, setFinalImage] = useState(null);
	const [deleteModal, setDeleteModal] = useState(false);
	const [loading, setLoading] = useState(false);

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

	async function onModalConfirm() {
		setLoading(true);
		const url = `${process.env.NEXT_PUBLIC_API_URL}/outfits/${id}`;
		const response = await deleteFetcher([url, token]);
		router.push("/saved?deleted=true&name=" + data.name);
	}

	if (!data || loading) return <Loading isPage={true} />;

	return (
		<>
			<PageDetails title={data.name} description="View your outfit" />
			<ConfirmModal
				onConfirm={onModalConfirm}
				onCancel={() => setDeleteModal(false)}
				show={deleteModal}
			>
				<p>Are you sure you want to delete this item?</p>
				<p>
					<span className="has-text-weight-bold">Warning:</span> This action cannot be
					undone.
				</p>
			</ConfirmModal>
			<div className="section pt-0">
				<div className="container">
					<h1 className="title is-1">{data.name}</h1>
					<p className="subtitle is-3">Outfit View:</p>
					{finalImage ? (
						<div className={styles.imageContainer}>
							<img src={finalImage} />
						</div>
					) : (
						<Loading />
					)}
				</div>
			</div>
			<div className="section">
				<div className="container">
					<p className="title is-3">Items In Outfit</p>
					<div className="columns is-mobile is-multiline">
						{items ? items.map((item) => <WardrobeCard item={item} />) : <Loading />}
					</div>
				</div>
			</div>
			<div className="section">
				<div className="container">
					<p className="title is-3">Actions</p>
					<div className="buttons">
						<IconButton
							type="is-danger"
							icon={faTrash}
							onClick={() => setDeleteModal(true)}
						>
							Delete
						</IconButton>
					</div>
				</div>
			</div>
		</>
	);
}

export default withAuth(OutfitItemPage);

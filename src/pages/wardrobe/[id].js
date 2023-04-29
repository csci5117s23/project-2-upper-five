import withAuth from "@/components/hoc/withAuth";
import WardrobeInfo from "@/components/wardrobe/WardrobeInfo";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";
import { deleteFetcher, imageFetcher, putFetcher } from "@/modules/fetcher";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import EditForm from "@/components/EditForm";
import ConfirmModal from "@/components/ConfirmModal";
import Notification from "@/components/Notification";
import PageDetails from "@/components/PageDetails";
import IconButton from "@/components/IconButton";
import Loading from "@/components/Loading";

function WardrobeItemPage({ token }) {
	const router = useRouter();
	const { id } = router.query;
	const [editMode, setEditMode] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState(false);

	const { data, mutate, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/items/${id}`);

	const { data: image, error: imageError } = useSWRImmutable(
		data ? data.downloadUrl : null,
		imageFetcher
	);

	useEffect(() => {
		async function process() {
			if (successMessage) {
				window.scrollTo(0, 0);
				await new Promise((resolve) => setTimeout(resolve, 9000));
				setSuccessMessage(false);
			}
		}

		process();
	}, [successMessage]);

	const handleFormSubmit = async (event) => {
		event.preventDefault();

		const newFormData = new FormData(event.target);
		const newData = {};
		for (let [key, value] of newFormData.entries()) {
			newData[key] = value;
		}
		newData.imageId = data.imageId;
		newData.dateAdded = data.dateAdded;

		try {
			console.log("data: ", newData);
			//fetcher post
			let response = await putFetcher([
				`${process.env.NEXT_PUBLIC_API_URL}/items/${data._id}`,
				token,
				newData,
			]);

			console.log("Edit Response: " + JSON.stringify(response));

			mutate(response);
		} catch (error) {
			console.log("Error editing item data", error);
		}

		setSuccessMessage(true);
		setEditMode(false);
	};

	function onModalConfirm() {
		setLoading(true);
		const url = `${process.env.NEXT_PUBLIC_API_URL}/items/${id}`;
		const response = deleteFetcher([url, token]);
		console.log(response);
		router.push("/wardrobe?deleted=true&name=" + data.name);
	}

	if (error) return <div>Failed to load</div>;

	if (loading || !data) return <Loading isPage={true} />;

	return (
		<>
			<PageDetails
				title={`${data.name} | Wardrobe`}
				description="This is an individual item in your wardrobe."
			/>
			<ConfirmModal
				onConfirm={onModalConfirm}
				onCancel={() => setDeleteModal(false)}
				show={deleteModal}
			>
				<p>Are you sure you want to delete this item?</p>
				<p>
					<span className="has-text-weight-bold">Warning:</span> This action cannot be
					undone, and all outfits that use this item will be affected.
				</p>
			</ConfirmModal>
			<div className="section pt-0">
				<Notification
					message="Item successfully updated!"
					type="is-success"
					show={successMessage}
					setShow={setSuccessMessage}
				/>
				<div className="container">
					<h1 className="title is-1">{data.name}</h1>
					<div className="box" style={{ maxWidth: "500px" }}>
						<div>
							{image ? (
								<Image src={image} alt={data.name} width={500} height={500} />
							) : null}
						</div>
					</div>
					<div className="is-flex is-flex-direction-row-reverse">
						<div className="buttons">
							{!editMode && (
								<IconButton
									type="is-primary"
									icon={faPencil}
									onClick={() => setEditMode(true)}
								>
									Edit
								</IconButton>
							)}
						</div>
					</div>
					{!editMode ? (
						<WardrobeInfo item={data} />
					) : (
						<>
							<EditForm initialValues={data} handleFormSubmit={handleFormSubmit} />
							<div className="is-flex buttons mt-4">
								<IconButton
									type="is-danger"
									icon={faTrash}
									onClick={() => setDeleteModal(true)}
								>
									Delete
								</IconButton>
								<button className="button" onClick={() => setEditMode(false)}>
									Cancel
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</>
	);
}

export default withAuth(WardrobeItemPage);

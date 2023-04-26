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

function WardrobeItemPage({ token }) {
	const router = useRouter();
	const { id } = router.query;
	const [editMode, setEditMode] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [loading, setLoading] = useState(false);

	const { data, mutate, error } = useSWR(
		`${process.env.NEXT_PUBLIC_API_URL}/items/${id}`
	);

	const { data: image, error: imageError } = useSWRImmutable(
		data ? data.downloadUrl : null,
		imageFetcher
	);

	if (error) return <div>Failed to load</div>;

	if (!data) return <div>Loading...</div>;

	const handleFormSubmit = async (event) => {
		event.preventDefault();

		const newformData = new FormData(event.target);
		const newdata = {};
		for (let [key, value] of newformData.entries()) {
			newdata[key] = value;
		}
		newdata.imageId = data.imageId;
        newdata.dateAdded = data.dateAdded;

		try {
			console.log("data!: ", newdata);
			//fetcher post
			let response = await putFetcher([
				`${process.env.NEXT_PUBLIC_API_URL}/items/${data._id}`,
				token,
				newdata,
			]);

			console.log("Edit Response: " + JSON.stringify(response));
			
            mutate(response);

		} catch (error) {
			console.log("Error editing item data", error);
		}

		setEditMode(false);
	};	

	function handleEditButton() {
		setEditMode(true);
	}

	function handleSaveButton() {}

	function handleCancelButton() {
		setEditMode(false);
	}

	function handleDeleteButton() {
		setDeleteModal(true);
	}

	function onModalConfirm() {
		setLoading(true);
		const url = `${process.env.NEXT_PUBLIC_API_URL}/items/${id}`;
		const response = deleteFetcher([url, token]);
		console.log(response);
		router.push("/wardrobe");
	}

	function onModalCancel() {
		setDeleteModal(false);
	}

	const editButton = (
		<button className="button is-primary" onClick={handleEditButton}>
			<span>Edit</span>
			<span className="icon">
				<FontAwesomeIcon icon={faPencil} />
			</span>
		</button>
	);

	const deleteButton = (
		<button className="button is-danger" onClick={handleDeleteButton}>
			<span>Delete</span>
			<span className="icon">
				<FontAwesomeIcon icon={faTrash} />
			</span>
		</button>
	);

	if (loading) return <div>Loading...</div>;

	return (
		<>
			<ConfirmModal
				onConfirm={onModalConfirm}
				onCancel={onModalCancel}
				show={deleteModal}
			>
				<p>Are you sure you want to delete this item?</p>
				<p>
					<span className="has-text-weight-bold">Warning:</span> This
					action cannot be undone, and all outfits that use this item
					will be affected.
				</p>
			</ConfirmModal>
			<div className="section">
				<div className="container">
					<h1 className="title is-1">{data.name}</h1>
					<div className="box" style={{ width: 500 }}>
						<figure className="image is-1by1">
							{image ? (
								<Image
									src={image}
									alt={data.name}
									width={500}
									height={500}
								/>
							) : null}
						</figure>
					</div>
					<div className="is-flex is-flex-direction-row-reverse">
						<div className="buttons">{!editMode && editButton}</div>
					</div>
					{!editMode ? (
						<WardrobeInfo item={data} />
					) : (
						<>
							<EditForm initialValues={data} handleFormSubmit={handleFormSubmit}/>
							<div className="is-flex buttons mt-4">
								{deleteButton}
								<button
									className="button"
									onClick={handleCancelButton}
								>
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

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
import AddForm from "@/components/AddForm";
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

	function handleFormSubmit(e) {
		e.preventDefault();
		const formData = new FormData(e.target);
		const data = Object.fromEntries(formData);
		const url = `${process.env.NEXT_PUBLIC_API_URL}/items/${id}`;
		const response = putFetcher([url, token, data]);
		console.log(response);
		mutate(response);
		setEditMode(false);
	}

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
			<div className="section pt-0">
				<div className="container">
					<h1 className="title is-1">{data.name}</h1>
					<div className="box" style={{ maxWidth: "500px" }}>
						<div>
							{image ? (
								<Image
									src={image}
									alt={data.name}
									width={500}
									height={500}
								/>
							) : null}
						</div>
					</div>
					<div className="is-flex is-flex-direction-row-reverse">
						<div className="buttons">{!editMode && editButton}</div>
					</div>
					{!editMode ? (
						<WardrobeInfo item={data} />
					) : (
						<>
							<AddForm />
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

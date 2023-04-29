import { React, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { cloudUpload } from "@/modules/cloudStorage";
import { postFetcher } from "@/modules/fetcher";
import { cropPhoto } from "@/modules/imageManip";

import Camera from "./Camera";
import PhotoCrop from "./PhotoCrop";
import PhotoFields from "./PhotoFields";

import * as styles from "./AddForm.module.scss";
import Loading from "./Loading";

function AddForm({ token }) {
	const router = useRouter();
	const [stage, setStage] = useState(1);
	const [cameraOpen, setCameraOpen] = useState(false);
	const [photo, setPhoto] = useState(null);
	const [croppedPhoto, setCroppedPhoto] = useState(null);
	const [previewImage, setPreviewImage] = useState(null);
	const [isUploading, setIsUploading] = useState(false);

	// Sets the preview image
	useEffect(() => {
		if (croppedPhoto) {
			let reader = new FileReader();
			reader.onloadend = () => {
				setPreviewImage(reader.result);
			};
			reader.readAsDataURL(croppedPhoto);
		}
	}, [croppedPhoto]);

	const handleFormSubmit = async (event) => {
		event.preventDefault();

		setIsUploading(true);
		const formData = new FormData(event.target);
		const data = {};
		for (let [key, value] of formData.entries()) {
			data[key] = value;
		}
		console.log("formdata: ", JSON.stringify(data));

		try {
			const cloud_response = await cloudUpload(croppedPhoto);

			data.imageId = cloud_response.fileId;
			console.log("data: ", data);
			//fetcher post
			let response = await postFetcher([
				`${process.env.NEXT_PUBLIC_API_URL}/items`,
				token,
				data,
			]);

			console.log("Response: " + JSON.stringify(response));
			router.push("/wardrobe?success=true");
		} catch (error) {
			console.log("Error uploading image:", error);
		}
	};

	const handleTakePhoto = async (photo) => {
		const myPhoto = await cropPhoto(photo);
		setPhoto(myPhoto);
		setCameraOpen(false);
	};

	const handleClearPhoto = () => {
		setPhoto(null);
		setCameraOpen(false);
	};

	const handleUploadPhoto = async (event) => {
		const photo = event.target.files[0];
		const myPhoto = await cropPhoto(photo);
		setPhoto(myPhoto);
	};

	if (stage === 2 && !croppedPhoto) {
		return <Loading />;
	}

	return (
		<div className="container is-widescreen">
			<form id="add-form" onSubmit={handleFormSubmit}>
				{stage === 1 && (
					<div>
						<div className="field">
							<label className="label is-size-4">Step 1: Add a Photo</label>
							{photo ? (
								<PhotoCrop
									photo={photo}
									handleClearPhoto={handleClearPhoto}
									setStage={setStage}
									canvasSize={500}
									setCroppedPhoto={setCroppedPhoto}
								/>
							) : (
								<div>
									{cameraOpen ? (
										<Camera onCapture={handleTakePhoto} />
									) : (
										<PhotoFields
											handleUploadPhoto={handleUploadPhoto}
											photo={photo}
											setCameraOpen={setCameraOpen}
										/>
									)}
								</div>
							)}
						</div>
					</div>
				)}
				{stage === 2 && (
					<div>
						<label className="label is-size-4">Step 2: Add Information</label>
						<div className="field">
							<label className="label required">Item Name</label>
							<div className="control">
								<input
									className="input"
									name="name"
									type="text"
									placeholder=""
									maxLength={100}
									required
								></input>
							</div>
						</div>
						<div className="field">
							<label className="label required">Type</label>
							<div className="control">
								<div className="select">
									<select name="type" required>
										<option>Hats</option>
										<option>Accessories</option>
										<option>Tops</option>
										<option>Bottoms</option>
										<option>Dresses</option>
										<option>Shoes</option>
									</select>
								</div>
							</div>
						</div>
						<div className="field">
							<label className="label required">Occasion</label>
							<div className="control">
								<div className="select">
									<select name="occasion" required>
										<option>Formal</option>
										<option>Casual</option>
										<option>Business Casual</option>
										<option>Athletic</option>
									</select>
								</div>
							</div>
						</div>
						<div className="field">
							<label className="label required">Do You Own This?</label>
							<div className="control">
								<label className="radio mr-4">
									<input
										type="radio"
										name="own"
										value="true"
										className="mr-1"
										required
									></input>
									Yes
								</label>
								<label>
									<input
										type="radio"
										name="own"
										value="false"
										className="mr-1"
										required
									></input>
									No
								</label>
							</div>
						</div>
						<div className="field">
							<div className="control">
								<button
									className="button mr-4"
									type="button"
									onClick={() => setStage(1)}
								>
									Back
								</button>
								<button
									className={`button is-primary ${
										isUploading ? "is-loading" : ""
									}`}
									type="submit"
								>
									Submit
								</button>
							</div>
						</div>
						{previewImage && (
							<div>
								<p className="has-text-weight-bold">Image Preview:</p>
								<img
									src={previewImage}
									width={500}
									height={500}
									className={styles.outline}
								/>
							</div>
						)}
					</div>
				)}
			</form>
		</div>
	);
}

export default AddForm;

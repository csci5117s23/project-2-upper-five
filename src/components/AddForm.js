import { React, useEffect, useState } from "react";
import Camera from "./Camera";
import Resizer from "react-image-file-resizer";
import { cloudUpload } from "@/modules/cloudStorage";
import { postFetcher } from "@/modules/fetcher";
import { useAuth } from "@clerk/nextjs";
import PhotoCrop from "./PhotoCrop";
import { useRouter } from "next/router";

function AddForm() {
	const router = useRouter();
	const [stage, setStage] = useState(1);
	const [cameraOpen, setcameraOpen] = useState(false);
	const [photo, setPhoto] = useState(null);
	const [croppedPhoto, setCroppedPhoto] = useState(null);
	const { isLoaded, userId, sessionId, getToken } = useAuth();
	const [token, setToken] = useState(null);
	const [temp, setTemp] = useState(null);

	useEffect(() => {
		async function process() {
			const myToken = await getToken({ template: "codehooks" });
			setToken(myToken);
		}
		process();
	}, [getToken]);

	const handleFormSubmit = async (event) => {
		event.preventDefault();

		const formData = new FormData(event.target);
		const data = {};
		for (let [key, value] of formData.entries()) {
			data[key] = value;
		}
		console.log("formdata: ", JSON.stringify(data));

		//add resize function
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
			router.push("/items");
		} catch (error) {
			console.log("Error uploading image:", error);
		}
	};

	const handleTakePhoto = async (photo) => {
		const myPhoto = await setPhotoSize(photo);
		setPhoto(myPhoto);
		setcameraOpen(false);
	};

	const handleClearPhoto = () => {
		setPhoto(null);
		setcameraOpen(false);
	};

	const handleUploadPhoto = async (event) => {
		const photo = event.target.files[0];
		const myPhoto = await setPhotoSize(photo);
		setPhoto(myPhoto);
	};

	async function setPhotoSize(photo) {
		console.log("Set photo size");
		try {
			// Crop photo to be a square
			// source used: https://www.geeksforgeeks.org/how-to-crop-an-image-using-canvas/
			const croppedPhoto = await new Promise((resolve) => {
				const reader = new FileReader();
				reader.onload = () => {
					const image = new Image();
					image.onload = () => {
						const canvas = document.createElement("canvas");
						const ctx = canvas.getContext("2d");
						const size = Math.min(image.width, image.height);
						canvas.width = size;
						canvas.height = size;
						ctx.drawImage(
							image,
							(image.width - size) / 2,
							(image.height - size) / 2,
							size,
							size,
							0,
							0,
							size,
							size
						);

						canvas.toBlob((blob) => {
							const file = new File([blob], photo.name, {
								type: "image/jpeg",
							});
							resolve(file);
						});
					};
					image.src = reader.result;
				};
				reader.readAsDataURL(photo);
			});

			// Resize photo to be 500x500
			const resized = await new Promise((resolve) => {
				Resizer.imageFileResizer(
					croppedPhoto,
					500,
					500,
					"JPEG",
					100,
					0,
					(uri) => {
						resolve(uri);
					},
					"file",
					200,
					200
				);
			});
			return resized;
		} catch (error) {
			console.log("Error resizing image:", error);
			return null;
		}
	}

	useEffect(() => {
		if (croppedPhoto) {
			let reader = new FileReader();
			reader.onloadend = () => {
				setTemp(reader.result);
			};
			reader.readAsDataURL(croppedPhoto);
		}
	}, [croppedPhoto]);

	if (stage === 2 && !croppedPhoto) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container is-widescreen">
			<form id="add-form" onSubmit={handleFormSubmit}>
				{stage === 1 && (
					<div>
						<div className="field">
							<label className="label">Photo:</label>
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
										<div className="field">
											<div className="file is-info has-name">
												<label className="file-label">
													<input
														className="file-input"
														type="file"
														name="photo"
														onChange={
															handleUploadPhoto
														}
														required
													/>
													<span className="file-cta">
														<span className="file-icon">
															<i className="fas fa-upload"></i>
														</span>
														<span className="file-label">
															Upload Photo
														</span>
													</span>
													<span className="file-name">
														{photo
															? photo.name
															: "No file selected"}
													</span>
												</label>
											</div>
											<button
												className="button is-primary"
												type="button"
												onClick={() =>
													setcameraOpen(true)
												}
											>
												Open Camera
											</button>
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				)}
				{stage === 2 && (
					<div>
						<div className="field">
							<label className="label">Item Name</label>
							<div className="control">
								<input
									className="input"
									name="name"
									type="text"
									placeholder=""
									required
								></input>
							</div>
						</div>
						<div className="field">
							<label className="label">Type</label>
							<div className="control">
								<div className="select">
									<select name="type" required>
										<option>Top</option>
										<option>Bottom</option>
										<option>Headwear</option>
										<option>Footwear</option>
										<option>Accessory</option>
									</select>
								</div>
							</div>
						</div>
						<div className="field">
							<label className="label">Occasion</label>
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
							<label className="label">Own</label>
							<div className="control">
								<label className="radio">
									<input
										type="radio"
										name="own"
										value="true"
										required
									></input>
									Yes
								</label>
								<label>
									<input
										type="radio"
										name="own"
										value="false"
										required
									></input>
									No
								</label>
							</div>
						</div>
						<div className="field">
							<div className="control">
								<button
									className="button"
									type="button"
									onClick={() => setStage(1)}
								>
									Back
								</button>
								<button
									className="button is-primary"
									type="submit"
								>
									Submit
								</button>
							</div>
						</div>
						{temp && (
							<div>
								<p className="has-text-weight-bold">
									Image Preview:
								</p>
								<img src={temp} width={500} height={500} />
							</div>
						)}
					</div>
				)}
			</form>
		</div>
	);
}

export default AddForm;

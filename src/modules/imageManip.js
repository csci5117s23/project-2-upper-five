import Resizer from "react-image-file-resizer";

function blobToImageData(blob) {
	return new Promise(function (resolve, reject) {
		var img = new Image();
		img.onload = function () {
			var canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);
			resolve(ctx.getImageData(0, 0, img.width, img.height));
		};
		img.onerror = reject;
		img.src = URL.createObjectURL(blob);
	});
}

async function cropPhoto(photo) {
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
				750,
				750,
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

async function createPreviewThumbnail(photos) {
	let numImages = 1;
	if (photos.length > 1) {
		numImages = 2;
	}

	const files = await new Promise(async (resolve) => {
		const files = [];
		for (let i = 0; i < numImages; i++) {
			const response = await fetch(photos[i]);
			const blob = await response.blob();
			const file = new File([blob], `photo${i}.jpg`, {
				type: "image/jpeg",
			});
			files.push(file);
		}
		resolve(files);
	});

	return new Promise(async (resolve) => {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		canvas.width = 750;
		canvas.height = 750;
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, 750, 750);

		for (let i = 0; i < numImages; i++) {
			await new Promise((resolve) => {
				Resizer.imageFileResizer(
					files[i],
					375,
					375,
					"JPEG",
					100,
					0,
					(uri) => {
						const image = new Image();
						image.onload = () => {
							let x = 0;
							let y = 0;
							if (i === 1) {
								x = 375;
								y = 375;
							}
							ctx.fillStyle = "white";
							ctx.drawImage(image, x, y);
							resolve();
						};
						image.src = uri;
					},
					"base64"
				);
			});
		}

		resolve(canvas.toDataURL("image/png"));
	});
}

function createSingleOutfitImage(photoUrls, xPositions) {
	return new Promise(async (resolve) => {
		// Step 1, create images
		const images = [];
		let maxWidth = 0;
		let totalHeight = 0;

		for (let i = 0; i < photoUrls.length; i++) {
			const image = new Image();
			image.crossOrigin = "anonymous";
			image.src = photoUrls[i];
			await new Promise((resolve) => {
				image.onload = () => {
					if (image.width > maxWidth) {
						maxWidth = image.width + xPositions[i];
					}
					totalHeight += image.height + 5;
					images.push(image);
					resolve();
				};
			});
		}

		// Step 2, create canvas
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		canvas.width = maxWidth;
		canvas.height = totalHeight;

		// Step 3, draw images
		let y = 0;
		for (let i = 0; i < images.length; i++) {
			ctx.drawImage(images[i], xPositions[i], y);
			y += images[i].height + 5;
		}

		// Step 4, return image
		resolve(canvas.toDataURL("image/png"));
	});
}

export { blobToImageData, cropPhoto, createPreviewThumbnail, createSingleOutfitImage };

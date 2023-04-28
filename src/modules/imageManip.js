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

async function createPreviewThumbnail(photos) {
	const files = await new Promise(async (resolve) => {
		const files = [];
		for (let i = 0; i < 2; i++) {
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

		for (let i = 0; i < 2; i++) {
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

		resolve(canvas.toDataURL("image/jpeg"));
	});
}

export { blobToImageData, createPreviewThumbnail };

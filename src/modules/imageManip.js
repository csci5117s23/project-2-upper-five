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

export { blobToImageData };

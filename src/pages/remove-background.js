import { useEffect, useRef, useState } from "react";
import { blobToImageData } from "@/modules/imageManip";
import { fabric } from "fabric";
import { actionHandler, anchorWrapper, polygonPositionHandler } from "@/modules/polygonEditor";
import masks from "../data/crop-masks";

function RemoveBackgroundPage() {
	const canvasRef = useRef(null);
	const [fabricCanvas, setFabricCanvas] = useState(null);
	const [polygon, setPolygon] = useState(null);
	const [imageUrl, setImageUrl] = useState(null);
	const [croppedImage, setCroppedImage] = useState(null);

	useEffect(() => {
		const canvas = new fabric.Canvas("canvas");
		canvas.setDimensions({ width: 640, height: 640 });
		canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
		setFabricCanvas(canvas);

		return () => {
			canvas.dispose();
		};
	}, []);

	function removeBackground(e) {
		e.preventDefault();

		const image = e.target.image.files[0];
		setImageUrl(URL.createObjectURL(image));

		const canvas = new fabric.Canvas(canvasRef.current);
		canvas.setDimensions({ width: 500, height: 500 });
		canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
		setFabricCanvas(canvas);

		var reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = (e) => {
			let url = e.target.result;
			fabric.Image.fromURL(url, (img) => {
				canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
					scaleX: canvas.width / img.width,
					scaleY: canvas.height / img.height,
				});
			});
		};

		var poly = new fabric.Polygon(masks.shirt1, {
			left: 0,
			top: 0,
			fill: "rgba(0, 0, 0, 0.25)",
			strokeWidth: 4,
			stroke: "green",
			scaleX: 1,
			scaleY: 1,
			objectCaching: false,
			transparentCorners: false,
			cornerColor: "blue",
		});

		setPolygon(poly);
		canvas.add(poly);
		canvas.setActiveObject(poly);

		poly.edit = !poly.edit;
		if (poly.edit) {
			var lastControl = poly.points.length - 1;
			poly.cornerStyle = "circle";
			poly.cornerColor = "rgba(0,0,255,0.5)";
			poly.cornerSize = 20;
			poly.controls = poly.points.reduce(function (acc, point, index) {
				acc["p" + index] = new fabric.Control({
					positionHandler: polygonPositionHandler,
					actionHandler: anchorWrapper(
						index > 0 ? index - 1 : lastControl,
						actionHandler
					),
					actionName: "modifyPolygon",
					pointIndex: index,
				});
				return acc;
			}, {});
		}

		poly.hasBorders = !poly.edit;
		canvas.requestRenderAll();
	}

	function Crop(e) {
		e.preventDefault();

		const image = new Image();
		image.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = polygon.width;
			canvas.height = polygon.height;

			const tempCanvas = new fabric.Canvas(canvas, {
				width: polygon.width,
				height: polygon.height,
				backgroundColor: "transparent",
			});

			const fabricImage = new fabric.Image(image, {
				left: -polygon.left,
				top: -polygon.top,
				selectable: false,
			});

			tempCanvas.add(fabricImage).renderAll();

			const fabricPolygon = new fabric.Polygon(polygon.points, {
				left: 0,
				top: 0,
				fill: "white",
				selectable: false,
			});

			tempCanvas.clipPath = fabricPolygon;

			const dataURL = tempCanvas.toDataURL({
				format: "png",
				multiplier: 1,
			});

			setCroppedImage(dataURL);
		};

		image.src = imageUrl;
	}

	return (
		<div className="section">
			<div className="container">
				<h1 className="title">Remove Background</h1>
				<canvas ref={canvasRef} width="500" height="500"></canvas>
				<form onSubmit={removeBackground}>
					<label htmlFor="image">Image</label>
					<input type="file" id="image" name="image" accept="image/*" />

					<input type="submit" className="button" />
				</form>
				<button className="button" onClick={Crop}>
					Crop
				</button>
				{croppedImage && <img src={croppedImage} width={500} height={500} />}
			</div>
		</div>
	);
}

export default RemoveBackgroundPage;

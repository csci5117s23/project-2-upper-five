import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

import * as styles from "./PhotoCrop.module.scss";
import {
	actionHandler,
	anchorWrapper,
	getCroppedPhoto,
	newPolygon,
	polygonPositionHandler,
} from "@/modules/polygonEditor";
import masks from "../data/crop-masks";

function PhotoCrop({
	photo,
	handleClearPhoto,
	setStage,
	canvasSize,
	setCroppedPhoto,
	setPosition,
}) {
	const canvasRef = useRef(null);
	const [canvas, setCanvas] = useState(null);
	const [selectedPoints, setSelectedPoints] = useState(Object.keys(masks)[0]);
	const [polygon, setPolygon] = useState(null);
	const [photoUrl, setPhotoUrl] = useState(null);
	const [imageScale, setImageScale] = useState({});

	useEffect(() => {
		const container = document.querySelector(`.${styles.canvasContainer}`);
		const containerWidth = container.clientWidth;

		const canvas = new fabric.Canvas(canvasRef.current, {
			width: containerWidth,
			height: containerWidth,
		});
		setCanvas(canvas);

		return () => {
			setCanvas(null);
			canvas.dispose();
		};
	}, []);

	useEffect(() => {
		if (photo) {
			var reader = new FileReader();
			reader.readAsDataURL(photo);
			reader.onload = (e) => {
				let url = e.target.result;
				setPhotoUrl(url);
			};
		}
	}, [photo]);

	useEffect(() => {
		if (selectedPoints.length > 0 && photoUrl && canvas) {
			const container = document.querySelector(`.${styles.canvasContainer}`);

			const containerWidth = container.clientWidth;
			const scale = containerWidth / canvasSize;

			canvas.viewportTransform = [1, 0, 0, 1, 0, 0];

			fabric.Image.fromURL(photoUrl, (img) => {
				setImageScale({
					x: canvas.width / img.width,
					y: canvas.height / img.height,
				});
				canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
					scaleX: canvas.width / img.width,
					scaleY: canvas.height / img.height,
				});
			});

			if (polygon) {
				canvas.remove(polygon);
			}

			let myPoly = newPolygon(masks[selectedPoints], scale);
			canvas.add(myPoly);
			canvas.setActiveObject(myPoly);

			myPoly.edit = true;
			var lastControl = myPoly.points.length - 1;
			myPoly.cornerStyle = "circle";
			myPoly.cornerColor = "rgba(0,0,255,0.5)";
			myPoly.cornerSize = 20;
			myPoly.controls = myPoly.points.reduce((acc, point, index) => {
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

			myPoly.hasBorders = false;
			canvas.requestRenderAll();

			setPolygon(myPoly);
		}
	}, [selectedPoints, photoUrl, canvas]);

	async function handleNextButton() {
		console.log("Going to the next stage");
		setStage(2);
		const croppedPhoto = await getCroppedPhoto(photoUrl, polygon, imageScale);
		setCroppedPhoto(croppedPhoto);
		setPosition({ x: polygon.left, y: polygon.top });
		console.log("Set cropped photo");
	}

	return (
		<div className={styles.container}>
			<div className="is-flex">
				<p className="has-text-weight-bold mr-2">Select Outline</p>
				<div className="select mb-4">
					<select
						value={selectedPoints}
						onChange={(e) => setSelectedPoints(e.target.value)}
					>
						{Object.keys(masks).map((mask) => (
							<option key={mask} value={mask}>
								{mask}
							</option>
						))}
					</select>
				</div>
			</div>
			<div className={styles.canvasContainer}>
				<canvas ref={canvasRef} width={canvasSize} height={canvasSize}></canvas>
			</div>
			<div className="field mt-4">
				<div className="control">
					<button className="button is-danger" type="button" onClick={handleClearPhoto}>
						Clear Photo
					</button>
					<button
						className="button is-primary ml-4"
						type="button"
						onClick={handleNextButton}
					>
						Next Step
					</button>
				</div>
			</div>
		</div>
	);
}

export default PhotoCrop;

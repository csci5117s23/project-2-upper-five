import { fabric } from "fabric";
import { resolve } from "styled-jsx/css";

/*
 * A series of functions to handle polygon editing in fabric.js,
 * these were found on the fabric.js demos page and can be found here:
 * http://fabricjs.com/custom-controls-polygon
 */

function polygonPositionHandler(dim, finalMatrix, fabricObject) {
	var x = fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x;
	var y = fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y;
	return fabric.util.transformPoint(
		new fabric.Point(x, y),
		fabric.util.multiplyTransformMatrices(
			fabricObject.canvas.viewportTransform,
			fabricObject.calcTransformMatrix()
		)
	);
}

function actionHandler(eventData, transform, x, y) {
	var polygon = transform.target;
	var currentControl = polygon.controls[polygon.__corner];
	var mouseLocalPosition = polygon.toLocalPoint(new fabric.Point(x, y), "center", "center");
	var polygonBaseSize = polygon._getNonTransformedDimensions();
	var size = polygon._getTransformedDimensions(0, 0);
	var finalPointPosition = {
		x: (mouseLocalPosition.x * polygonBaseSize.x) / size.x + polygon.pathOffset.x,
		y: (mouseLocalPosition.y * polygonBaseSize.y) / size.y + polygon.pathOffset.y,
	};
	polygon.points[currentControl.pointIndex] = finalPointPosition;
	return true;
}

function anchorWrapper(anchorIndex, fn) {
	return function (eventData, transform, x, y) {
		var fabricObject = transform.target;
		var absolutePoint = fabric.util.transformPoint(
			new fabric.Point(
				fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x,
				fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y
			),
			fabricObject.calcTransformMatrix()
		);
		var actionPerformed = fn(eventData, transform, x, y);
		var newDim = fabricObject._setPositionDimensions({});
		var polygonBaseSize = fabricObject._getNonTransformedDimensions();
		var newX =
			(fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) / polygonBaseSize.x;
		var newY =
			(fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) / polygonBaseSize.y;
		fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
		return actionPerformed;
	};
}

function newPolygon(points, scale) {
	return new fabric.Polygon(points, {
		left: 0,
		top: 0,
		fill: "rgba(0,0,0,0.5)",
		stroke: "green",
		strokeWidth: 4,
		scaleX: scale,
		scaleY: scale,
		objectCaching: false,
		transparentCorners: false,
		cornerColor: "blue",
	});
}

async function getCroppedPhoto(photoUrl, polygon, imageScale) {
	const canvas = document.createElement("canvas");
	canvas.width = polygon.width;
	canvas.height = polygon.height;

	const tempCanvas = new fabric.Canvas(canvas, {
		width: polygon.width * polygon.scaleX,
		height: polygon.height * polygon.scaleY,
		backgroundColor: "blue",
	});

	const tempPhoto = await new Promise((resolve) => {
		fabric.Image.fromURL(photoUrl, (img) => resolve(img));
	});

	tempPhoto.set({ scaleX: imageScale.x, scaleY: imageScale.y });
	tempPhoto.set({ left: -polygon.left, top: -polygon.top });
	tempCanvas.add(tempPhoto).renderAll();

	const tempPolygon = new fabric.Polygon(polygon.points, {
		left: 0,
		top: 0,
		scaleX: polygon.scaleX,
		scaleY: polygon.scaleY,
		fill: "white",
		selectable: false,
	});
	tempCanvas.clipPath = tempPolygon;

	const croppedPhotoUrl = tempCanvas.toDataURL({
		format: "jpg",
		quality: 1,
	});

	const res = await fetch(croppedPhotoUrl);
	const blob = await res.blob();
	return new File([blob], "croppedPhoto.jpg", {
		type: "image/jpeg",
	});
}

export { polygonPositionHandler, actionHandler, anchorWrapper, newPolygon, getCroppedPhoto };

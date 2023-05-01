import Webcam from "react-webcam";
import { React, useRef, useState } from "react";
import Loading from "./Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCameraRotate } from "@fortawesome/free-solid-svg-icons";

import * as styles from "./Camera.module.scss";

export default function Camera({ onCapture }) {
	const webcamRef = useRef(null);
	const [webcamLoaded, setWebcamLoaded] = useState(false);
	const [useEnvironmentCamera, setUseEnvironmentCamera] = useState(true);

	const handleTakePhoto = () => {
		//convert the base64 image to a blob: https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
		const photo = webcamRef.current.getScreenshot();
		//Explore alternatives
		const byteCharacters = atob(photo.split(",")[1]);
		const byteNumbers = new Array(byteCharacters.length);
		for (let i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i);
		}
		const imageData = new Uint8Array(byteNumbers);
		const blob = new Blob([imageData], { type: "image/jpeg" });
		const file = new File([blob], "captured-image.jpg", {
			type: "image/jpeg",
		});
		onCapture(file);
	};

	const videoConstraints = useEnvironmentCamera
		? {
				facingMode: "environment",
                aspectRatio: 1
		  }
		: {
				facingMode: "user",
                aspectRatio: 1
		  };

	return (
		<div className={styles.camera}>
            {!webcamLoaded && <Loading />}
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                onUserMedia={() => setWebcamLoaded(true)}
            />
			<div className={`${styles.buttonGroup} field is-grouped`}>
				<div className="control">
					<button className={`${styles.flip} button is-primary is-large`} type="button" onClick={handleTakePhoto}>
                        <FontAwesomeIcon icon={faCamera} />
					</button>
				</div>
				<div className="control">
					<button
						className={`${styles.flip} button is-link`}
						type="button"
						onClick={() => setUseEnvironmentCamera(!useEnvironmentCamera)}>
						<FontAwesomeIcon icon={faCameraRotate} />
					</button>
				</div>
			</div>
		</div>
	);
}

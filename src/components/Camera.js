import Webcam from 'react-webcam';
import { React, useRef, useState } from 'react';

export default function Camera(props){
    const webcamRef = useRef(null);

    const handleTakePhoto = () => {
        const photo = webcamRef.current.getScreenshot();
        props.onCapture(photo);
    };

    return(
        <div>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
            />
            <div className="field">
                <div className="control">
                    <button className="button is-info" type="button" onClick={handleTakePhoto}>Take Photo</button>
                </div>
            </div>
        </div>
    )
}
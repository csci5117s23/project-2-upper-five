import Webcam from 'react-webcam';
import { React, useRef, useState } from 'react';


export default function Camera(props){
    const webcamRef = useRef(null);

    const handleTakePhoto = () => {
        const photo = webcamRef.current.getScreenshot();
        //convert the base64 image to a blob: https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
        const byteCharacters = atob(photo.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const imageData = new Uint8Array(byteNumbers);
        const blob = new Blob([imageData], { type: 'image/jpeg' });
        props.onCapture(blob);
    };

    return(
        <div>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat='image/jpeg'
            />
            <div className="field">
                <div className="control">
                    <button className="button is-info" type="button" onClick={handleTakePhoto}>Take Photo</button>
                </div>
            </div>
        </div>
    )
}
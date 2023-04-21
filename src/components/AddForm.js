import { React, useEffect, useState } from 'react';
import Camera from './Camera'
import Resizer from "react-image-file-resizer";
import { cloudUpload } from '@/modules/cloudStorage';
import { postFetcher } from "@/modules/fetcher";
import { useAuth } from "@clerk/nextjs";

export default function AddForm(){
    const [stage, setStage] = useState(1);
    const [cameraOpen, setcameraOpen] = useState(false);
    const [photo, setPhoto] = useState(null);
    const { isLoaded, userId, sessionId, getToken } = useAuth();
	const [token, setToken] = useState(null);

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
        console.log("formdata: ",JSON.stringify(data));

        //add resize function
        try {
            const resized = await new Promise((resolve) => {
                Resizer.imageFileResizer(
                    photo,
                    600,
                    600,
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
            
            const cloud_response = await cloudUpload(resized);

            data.imageId = cloud_response.fileId;
            //console.log("data: ",data);
            //fetcher post
            let response = await postFetcher([
                `${process.env.NEXT_PUBLIC_API_URL}/items`,
                token,
                data
            ]);

            //console.log("Response: " + JSON.stringify(response));
            
        } catch (error) {
            //console.log("Error uploading image:", error);
        }
    };
    
    const handleTakePhoto = (photo) => {
        setPhoto(photo);
        setcameraOpen(false);
      };
    
    const handleClearPhoto = () => {
        setPhoto(null);
        setcameraOpen(false);
    };
    
    const handleUploadPhoto = (event) => {
        const photo = event.target.files[0];
        setPhoto(photo);
    };

    return(
        <div className="container is-widescreen">
            <form id="add-form" onSubmit={handleFormSubmit}>
                {stage === 1 && (
                    <div>
                        <div className="field">
                            <label className="label">Photo:</label>
                            {photo ? (
                                <div>
                                    <img src={URL.createObjectURL(photo)} alt="User" />
                                    <br />
                                    <button className="button is-danger" type="button" onClick={handleClearPhoto}>Clear Photo</button>
                                    <div className="field">
                                        <div className="control">
                                        <button className="button is-primary" type="button" onClick={() => setStage(2)}>Next</button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    {cameraOpen ? (
                                        <Camera onCapture={handleTakePhoto}/>
                                    ):(
                                        <div className="field">
                                            <div className="file is-info has-name">
                                                <label className="file-label">
                                                    <input className="file-input" type="file" name="photo" onChange={handleUploadPhoto} required />
                                                    <span className="file-cta">
                                                        <span className="file-icon">
                                                            <i className="fas fa-upload"></i>
                                                        </span>
                                                        <span className="file-label">
                                                            Upload Photo
                                                        </span>
                                                    </span>
                                                    <span className="file-name">
                                                        {photo ? photo.name : 'No file selected'}
                                                    </span>
                                                </label>
                                            </div>
                                            <button className="button is-primary" type="button" onClick={() => setcameraOpen(true)}>Open Camera</button>
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
                                <input className="input" name="name" type="text" placeholder="" required></input>
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
                                    <input type="radio" name="own" value="true" required></input>
                                    Yes
                                </label>
                                <label>
                                    <input type="radio" name="own" value="false" required></input>
                                    No
                                </label>
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <button className="button" type="button" onClick={() => setStage(1)}>Back</button>
                                <button className="button is-primary" type="submit">Submit</button>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}

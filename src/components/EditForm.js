import { React, useEffect, useState } from "react";
import { putFetcher } from "@/modules/fetcher";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";

function EditForm({ initialValues, mutateFunction }) {
	const router = useRouter();
	const { isLoaded, userId, sessionId, getToken } = useAuth();
	const [token, setToken] = useState(null);
    const imageId = initialValues.imageId;

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
		data.imageId = imageId;

		try {
			console.log("data: ", data);
			//fetcher post
			let response = await putFetcher([
				`${process.env.NEXT_PUBLIC_API_URL}/items/${initialValues._id}`,
				token,
				data,
			]);

			console.log("Edit Response: " + JSON.stringify(response));
			
            mutateFunction(response);

		} catch (error) {
			console.log("Error editing item data", error);
		}
	};

	return (
		<div className="container is-widescreen">
			<form id="add-form" onSubmit={handleFormSubmit}>
                <div className="field">
                    <label className="label">Item Name</label>
                    <div className="control">
                        <input
                            className="input"
                            name="name"
                            type="text"
                            placeholder=""
                            defaultValue={initialValues ? initialValues.name : ''}
                            required
                        ></input>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Type</label>
                    <div className="control">
                        <div className="select">
                            <select name="type" required defaultValue={initialValues ? initialValues.type : ''}>
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
                            <select name="occasion" required defaultValue={initialValues ? initialValues.occasion : ''}>
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
                            <input
                                type="radio"
                                name="own"
                                value="true"
                                required
                                defaultChecked = {initialValues.own === true}
                            ></input>
                            Yes
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="own"
                                value="false"
                                required
                                defaultChecked = {initialValues.own === false}
                            ></input>
                            No
                        </label>
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <button
                            className="button is-primary"
                            type="submit"
                        >
                            Submit
                        </button>
                    </div>
                </div>
			</form>
		</div>
	);
}

export default EditForm;

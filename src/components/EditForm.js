import { React, useEffect, useState } from "react";
import { putFetcher } from "@/modules/fetcher";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";

function EditForm({ initialValues, handleFormSubmit }) {
	const router = useRouter();
	const { isLoaded, userId, sessionId, getToken } = useAuth();

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
                                <option>Hats</option>
                                <option>Accessories</option>
                                <option>Tops</option>
                                <option>Bottoms</option>
                                <option>Dresses</option>
                                <option>Shoes</option>
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
                                defaultChecked = {initialValues?.own === true || false}
                            ></input>
                            Yes
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="own"
                                value="false"
                                required
                                defaultChecked = {initialValues?.own === false || true}
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

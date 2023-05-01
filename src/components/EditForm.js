import { useState } from "react";
import clothingCategories from "@/data/clothingCategories";

function EditForm({ initialValues, handleFormSubmit }) {
	const [loading, setLoading] = useState(false);

	function onSubmit(e) {
		e.preventDefault();
		setLoading(true);
		handleFormSubmit(e);
	}

	return (
		<div className="container is-widescreen">
			<form id="add-form" onSubmit={onSubmit}>
				<div className="field">
					<label className="label">Item Name</label>
					<div className="control">
						<input
							className="input"
							name="name"
							type="text"
							placeholder=""
							defaultValue={initialValues ? initialValues.name : ""}
							required
						></input>
					</div>
				</div>
				<div className="field">
					<label className="label">Type</label>
					<div className="control">
						<div className="select is-fullwidth">
							<select
								name="type"
								required
								defaultValue={initialValues ? initialValues.type : ""}
							>
								{clothingCategories.categories.map((category) => (
									<option key={category}>{category}</option>
								))}
							</select>
						</div>
					</div>
				</div>
				<div className="field">
					<label className="label">Occasion</label>
					<div className="control">
						<div className="select is-fullwidth">
							<select
								name="occasion"
								required
								defaultValue={initialValues ? initialValues.occasion : ""}
							>
								{clothingCategories.occasions.map((occasion) => (
									<option key={occasion}>{occasion}</option>
								))}
							</select>
						</div>
					</div>
				</div>
				<div className="field">
					<label className="label">Own</label>
					<div className="control">
						<label className="radio mr-4">
							<input
								type="radio"
								name="own"
								value="true"
								className="mr-1"
								required
								defaultChecked={initialValues?.own === true || false}
							></input>
							Yes
						</label>
						<label>
							<input
								type="radio"
								name="own"
								value="false"
								className="mr-1"
								required
								defaultChecked={initialValues?.own === false || true}
							></input>
							No
						</label>
					</div>
				</div>
				<div className="field">
					<div className="control">
						<button
							className={`button is-primary ${loading ? "is-loading" : ""}`}
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

import { useState } from "react";

function FilterModal({ show, onConfirm, onCancel, children }) {
	const [type, setType] = useState("");

	function onChecked() {
		let type = document.getElementById("Type").value;
	}
	return (
		<div className={`modal ${show ? "is-active" : ""}`}>
			<div className="modal-background"></div>
			<div className="modal-card">
				<header className="modal-card-head">
					<p className="modal-card-title">Filter</p>
					<button className="delete" aria-label="close" onClick={onCancel}></button>
				</header>
				<div className="modal-card-body">
					<Form />
				</div>
				<footer className="modal-card-foot">
					<button className="button is-success" onClick={onChecked}>
						Confirm
					</button>
					<button className="button" onClick={onCancel}>
						Cancel
					</button>
				</footer>
			</div>
		</div>
	);
}

function Form(props) {
	return (
		<div>
			<form>
				<label for="Occasion">Occasion </label>
				<select name="Occasion" id="Occasion">
					<option value="Formal">Formal</option>
					<option value="Casual">Casual</option>
					<option value="Business Casual">Business Casual</option>
				</select>
				<br />
				<br />
				<label for="Type">Type </label>
				<select name="Type" id="Type">
					<option value="Top">Top</option>
					<option value="Bottom">Bottom</option>
					<option value="Shoes">Shoes</option>
				</select>
				<br />
				<br />
				<label for="name">Seach by name:</label>
				<br />
				<input type="text" id="outfit-name" name="outfit-name" />
			</form>
		</div>
	);
}
export default FilterModal;

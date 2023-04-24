const { useState } = require("react");

function Notification({ message, type }) {
	const [show, setShow] = useState(false);

	return (
		<div
			className={`notification ${type} ${
				show ? "is-block" : "is-hidden"
			}`}
		>
			<button className="delete" onClick={() => setShow(false)}></button>
			{message}
		</div>
	);
}

export default Notification;

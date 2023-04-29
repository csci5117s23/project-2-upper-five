function Notification({ message, type, show, setShow }) {
	return (
		<div className={`notification ${type} ${show ? "is-block" : "is-hidden"}`}>
			<button className="delete" onClick={() => setShow(false)}></button>
			{message}
		</div>
	);
}

export default Notification;

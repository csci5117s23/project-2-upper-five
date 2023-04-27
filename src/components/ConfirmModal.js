function ConfirmModal({ show, onConfirm, onCancel, children }) {
	return (
		<div className={`modal ${show ? "is-active" : ""}`}>
			<div className="modal-background"></div>
			<div className="modal-card">
				<header className="modal-card-head">
					<p className="modal-card-title">Confirm</p>
					<button className="delete" aria-label="close" onClick={onCancel}></button>
				</header>
				<section className="modal-card-body">{children}</section>
				<footer className="modal-card-foot">
					<button className="button is-success" onClick={onConfirm}>
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

export default ConfirmModal;

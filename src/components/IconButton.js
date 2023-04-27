import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function IconButton({ type, icon, onClick, children }) {
	return (
		<button className={`button ${type}`} onClick={onClick}>
			<span>{children}</span>
			<span className="icon">
				<FontAwesomeIcon icon={icon} />
			</span>
		</button>
	);
}

export default IconButton;

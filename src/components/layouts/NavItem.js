import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as styles from "./NavItem.module.scss";

function NavItem({ name, icon, href, active = false }) {
	return (
		<Link href={href}>
			<div className={styles.item} data-is-active={active}>
				<FontAwesomeIcon icon={icon} />
				<span>{name}</span>
			</div>
		</Link>
	);
}

export default NavItem;

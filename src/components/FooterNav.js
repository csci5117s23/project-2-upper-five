import * as styles from "./FooterNav.module.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHome,
	faPlus,
	faShirt,
	faStar,
} from "@fortawesome/free-solid-svg-icons";
import NavItem from "./NavItem";

function FooterNav() {
	const tabs = [
		{
			name: "Wardrobe",
			href: "/",
			icon: faHome,
		},
		{
			name: "Add",
			href: "/add",
			icon: faPlus,
		},
		{
			name: "Outfits",
			href: "/outfits",
			icon: faShirt,
		},
		{
			name: "Saved",
			href: "/saved",
			icon: faStar,
		},
	];

	return (
		<div className={styles.footer}>
			<div className={styles.footerContent}>
				{tabs.map((tab) => (
					<NavItem key={tab.name} {...tab} />
				))}
			</div>
		</div>
	);
}

export default FooterNav;

import * as styles from "./FooterNav.module.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHome,
	faPlus,
	faShirt,
	faStar,
} from "@fortawesome/free-solid-svg-icons";
import NavItem from "./NavItem";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function FooterNav() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState("");

	useEffect(() => {
		async function process() {
			const path = router.pathname;
			setActiveTab(path);
		}

		process();
	}, [router]);

	const tabs = [
		{
			name: "Wardrobe",
			href: "/wardrobe",
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
		<footer className={styles.footer}>
			<div className={styles.footerContent}>
				{tabs.map((tab) => (
					<NavItem
						key={tab.name}
						{...tab}
						active={activeTab.includes(tab.href)}
					/>
				))}
			</div>
		</footer>
	);
}

export default FooterNav;

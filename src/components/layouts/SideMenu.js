import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import navigation from "../../data/navigation";

import * as styles from "./SideMenu.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function SideMenu() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState("");

	useEffect(() => {
		async function process() {
			const path = router.pathname;
			setActiveTab(path);
		}

		process();
	}, [router]);

	return (
		<aside className={`menu ${styles.menu}`}>
			<p className="menu-label">Main Menu</p>
			<ul className="menu-list">
				{navigation.tabs.map((tab) => (
					<li key={tab.name}>
						<Link
							href={tab.href}
							className={activeTab.includes(tab.href) ? "is-active" : ""}
						>
							<span className="icon mr-2">
								<FontAwesomeIcon icon={tab.icon} />
							</span>
							<span>{tab.name}</span>
						</Link>
					</li>
				))}
			</ul>
		</aside>
	);
}

export default SideMenu;

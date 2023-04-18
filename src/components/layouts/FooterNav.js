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
	const [scrollDirection, setScrollDirection] = useState("up");
	//const [lastScrollTop, setLastScrollTop] = useState(0);
	const [visible, setVisible] = useState(false);

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

	/*
	 * Scroll detection code, for deciding to show or hide the footer, here is the source:
	 * https://stackoverflow.com/questions/31223341/detecting-scroll-direction
	 */
	useEffect(() => {
		var lastScrollTop = 0;
		const handleScroll = () => {
			let scrollTop =
				window.pageYOffset || document.documentElement.scrollTop;
			if (
				window.innerHeight + window.scrollY >=
				document.body.offsetHeight
			) {
				setScrollDirection("up");
			} else {
				if (scrollTop > lastScrollTop) {
					setScrollDirection("down");
				} else if (scrollTop < lastScrollTop) {
					setScrollDirection("up");
				}
			}
			//setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
			lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<footer
			className={
				styles.footer +
				" " +
				(scrollDirection === "up" ? styles.show : styles.hide)
			}
		>
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

import * as styles from "./FooterNav.module.scss";

import NavItem from "./NavItem";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import navigation from "../../data/navigation";

function FooterNav() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState("");
	const [scrollDirection, setScrollDirection] = useState("up");

	useEffect(() => {
		async function process() {
			const path = router.pathname;
			setActiveTab(path);
		}

		process();
	}, [router]);

	/*
	 * Scroll detection code, for deciding to show or hide the footer, here is the source:
	 * https://stackoverflow.com/questions/31223341/detecting-scroll-direction
	 */
	useEffect(() => {
		var lastScrollTop = 0;
		const handleScroll = () => {
			let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
				setScrollDirection("up");
			} else {
				if (scrollTop > lastScrollTop) {
					setScrollDirection("down");
				} else if (scrollTop < lastScrollTop) {
					setScrollDirection("up");
				}
			}
			lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<footer
			className={styles.footer + " " + (scrollDirection === "up" ? styles.show : styles.hide)}
		>
			<div className={styles.footerContent}>
				{navigation.tabs.map((tab) => (
					<NavItem key={tab.name} {...tab} active={activeTab.includes(tab.href)} />
				))}
			</div>
		</footer>
	);
}

export default FooterNav;

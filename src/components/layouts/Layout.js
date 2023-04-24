import { SignedIn } from "@clerk/nextjs";
import FooterNav from "./FooterNav";
import Header from "./Header";
import SideMenu from "./SideMenu";

function Layout({ children }) {
	return (
		<>
			<div className="pageContainer">
				<div className="contentWrapper">
					<Header />
					<main>{children}</main>
				</div>
				<SignedIn>
					<SideMenu />
					<FooterNav />
				</SignedIn>
			</div>
		</>
	);
}

export default Layout;
